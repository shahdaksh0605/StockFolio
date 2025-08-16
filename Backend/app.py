from flask import Flask, request, jsonify
from flask_socketio import SocketIO
from flask_cors import CORS
import yfinance as yf
import threading
import time
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
from datetime import datetime, timezone
import requests

app = Flask(__name__)
CORS(app)
socketio = SocketIO(
    app, cors_allowed_origins="*", ping_timeout=20, ping_interval=10, async_mode="threading"
)

# === SYMBOL CONFIG ===
base_symbols = ["^NSEI", "^BSESN"]
default_stocks = [
    "INFY.NS",
    "TCS.NS",
    "RELIANCE.NS",
    "HDFCBANK.NS",
    "ICICIBANK.NS",
    "HINDUNILVR.NS",
    "BHARTIARTL.NS",
    "LT.NS",
    "WIPRO.NS",
    "IDEA.NS"
]

symbols = base_symbols + default_stocks
latest_data = {}
symbols_lock = threading.Lock()

# === API ROUTES ===
@app.route("/setwatchlist", methods=["POST"])
def set_watchlist():
    """Set user watchlist symbols"""
    global symbols
    data = request.get_json()
    incoming = data.get("symbols", [])

    # Normalize
    new_symbols = [s + ".NS" if not s.startswith("^") and not s.endswith(".NS") else s for s in incoming]

    with symbols_lock:
        symbols = base_symbols.copy()
        for s in new_symbols:
            if s not in symbols:
                symbols.append(s)

    print(f"Updated symbols: {symbols}")
    return jsonify({"status": "success", "symbols": symbols})


@app.route("/history/<symbol>", methods=["GET"])
def get_history(symbol):
    """Return 7-day price history"""
    if not symbol.startswith("^") and not symbol.endswith(".NS"):
        symbol += ".NS"

    try:
        ticker = yf.Ticker(symbol)
        hist = ticker.history(period="7d")
        if hist.empty:
            return jsonify([])

        history_list = []
        for date, row in hist.iterrows():
            history_list.append({
                "date": date.strftime("%Y-%m-%d"),
                "price": round(row["Close"], 2)
            })

        return jsonify(history_list)

    except Exception as e:
        print(f"Error fetching history for {symbol}: {e}")
        return jsonify({"error": str(e)}), 500


# === LIVE PRICE FETCHER ===
def fetch_stock_prices():
    """Fetch live prices + run predictions automatically every 30s"""
    global latest_data
    while True:
        with symbols_lock:
            current_symbols = symbols.copy()

        for symbol in current_symbols:
            try:
                yf_symbol = symbol
                if not yf_symbol.startswith("^") and not yf_symbol.endswith(".NS"):
                    yf_symbol += ".NS"

                ticker = yf.Ticker(yf_symbol)

                # Primary source: intraday
                hist = ticker.history(period="2d", interval="1m")
                if not hist.empty:
                    current_price = hist["Close"].iloc[-1]
                    prev_close = hist["Close"].iloc[-2] if len(hist) > 1 else current_price
                else:
                    # Fallback: daily
                    hist = ticker.history(period="5d")
                    if hist.empty:
                        continue
                    current_price = hist["Close"].iloc[-1]
                    prev_close = hist["Close"].iloc[-2] if len(hist) > 1 else current_price

                net_change = current_price - prev_close
                percent_change = (net_change / prev_close) * 100 if prev_close != 0 else 0

                latest_data[yf_symbol] = {
                    "price": round(current_price, 2),
                    "prev_close": round(prev_close, 2),
                    "net_change": round(net_change, 2),
                    "percent_change": round(percent_change, 2),
                }

                clean_symbol = yf_symbol.replace(".NS", "")
                socketio.emit("stock_update", {
                    "symbol": clean_symbol,
                    "price": round(current_price, 2),
                    "prev_close": round(prev_close, 2),
                    "net_change": round(net_change, 2),
                    "percent_change": round(percent_change, 2),
                })

                # 🔥 ALSO RUN PREDICTION ALERT HERE
                result = predict_next_close_pct(clean_symbol)
                if result:
                    pct_change, current_close, next_close = result
                    decision = "fall" if pct_change <= FALL_THRESHOLD_PCT else "neutral_or_rise"

                    alert = {
                        "type": "prediction",
                        "symbol": clean_symbol,
                        "userId": None,  # global alerts (not tied to one user)
                        "now": round(current_close, 2),
                        "predicted": round(next_close, 2),
                        "predicted_change_pct": round(pct_change, 2),
                        "decision": decision,
                        "threshold_pct": FALL_THRESHOLD_PCT,
                        "ts": datetime.now(timezone.utc).isoformat()
                    }

                    socketio.emit("prediction_alert", alert)
                    try:
                        requests.post("http://localhost:8000/stockfolio/alerts/save", json=alert)
                    except Exception as e:
                        print("Failed to save alert:", e)

            except Exception as e:
                print(f"Error fetching {symbol}: {e}")

        time.sleep(30)


@socketio.on("connect")
def handle_connect():
    print("Client connected:", request.sid)
    for symbol, data in latest_data.items():
        clean_symbol = symbol.replace(".NS", "")
        socketio.emit("stock_update", {"symbol": clean_symbol, **data}, to=request.sid)


@app.route("/")
def home():
    return "Backend running with live stock updates + predictions."


# === PREDICTION CONFIG ===
PREDICTION_WINDOW = 60
FALL_THRESHOLD_PCT = -1.0
TRAIN_EPOCHS = 5   # reduce to make it faster
BATCH_SIZE = 32


def _fetch_close_series(symbol: str, period="6mo"):
    if not symbol.startswith("^") and not symbol.endswith(".NS"):
        yf_symbol = symbol + ".NS"
    else:
        yf_symbol = symbol

    tk = yf.Ticker(yf_symbol)
    hist = tk.history(period=period, interval="1d", auto_adjust=True)
    if hist.empty or "Close" not in hist:
        return None
    closes = hist["Close"].dropna().values.astype("float32")
    return closes if len(closes) > PREDICTION_WINDOW + 1 else None


def _make_xy(closes: np.ndarray, window=PREDICTION_WINDOW):
    scaler = MinMaxScaler()
    scaled = scaler.fit_transform(closes.reshape(-1, 1))

    X, y = [], []
    for i in range(window, len(scaled)):
        X.append(scaled[i - window:i, 0])
        y.append(scaled[i, 0])
    X = np.array(X)[:, :, None]
    y = np.array(y)
    return X, y, scaler


def _build_lstm(input_timesteps=PREDICTION_WINDOW, input_features=1):
    m = Sequential()
    m.add(LSTM(64, return_sequences=True, input_shape=(input_timesteps, input_features)))
    m.add(LSTM(32))
    m.add(Dense(1))
    m.compile(optimizer="adam", loss="mse")
    return m


def predict_next_close_pct(symbol: str):
    closes = _fetch_close_series(symbol)
    if closes is None:
        return None

    X, y, scaler = _make_xy(closes)
    if len(X) < 50:
        return None

    model = _build_lstm()
    model.fit(X, y, epochs=TRAIN_EPOCHS, batch_size=BATCH_SIZE, verbose=0)

    last_window_scaled = scaler.transform(closes[-PREDICTION_WINDOW:].reshape(-1, 1)).reshape(1, PREDICTION_WINDOW, 1)
    next_scaled = model.predict(last_window_scaled, verbose=0)[0][0]
    next_close = float(scaler.inverse_transform([[next_scaled]])[0][0])

    current_close = float(closes[-1])
    pct_change = ((next_close - current_close) / current_close) * 100.0
    return pct_change, current_close, next_close


# === START BACKGROUND THREAD ===
threading.Thread(target=fetch_stock_prices, daemon=True).start()

socketio.run(app, debug=False, port=5000)
