from flask import Flask, request, jsonify
from flask_socketio import SocketIO
from flask_cors import CORS
import yfinance as yf
import threading
import time

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*", ping_timeout=20, ping_interval=10, async_mode="threading")

symbols = ["^NSEI", "^BSESN", "RELIANCE.NS", "TCS.NS", "INFY.NS", "HDFCBANK.NS"]
latest_data = {}
symbols_lock = threading.Lock()

@app.route("/setwatchlist", methods=["POST"])
def set_watchlist():
    global symbols
    data = request.get_json()
    new_symbols = [s + ".NS" if not s.startswith("^") else s for s in data.get("symbols", [])]
    base_symbols = ["^NSEI", "^BSESN"]

    with symbols_lock:
        # Ensure base symbols are always present
        for base in base_symbols:
            if base not in symbols:
                symbols.append(base)

        # Append only new symbols that are not already present
        for s in new_symbols:
            if s not in symbols:
                symbols.append(s)

    print(f"Updated symbols: {symbols}")
    return jsonify({"status": "success", "symbols": symbols})

def fetch_stock_prices():
    global latest_data
    print("Symbols lock = ",symbols_lock)
    while True:
        with symbols_lock:
            current_symbols = symbols.copy()
        for symbol in current_symbols:
            try:
                ticker = yf.Ticker(symbol)
                info = ticker.info
                current_price = info.get('currentPrice')
                previous_close = info.get('previousClose')

                if current_price is None or previous_close is None:
                    hist = ticker.history(period="2d")
                    if not hist.empty:
                        current_price = hist['Close'].iloc[-1]
                        previous_close = hist['Close'].iloc[-2]


                if current_price is None or previous_close is None:
                    continue

                net_change = current_price - previous_close
                percent_change = (net_change / previous_close) * 100

                latest_data[symbol] = {
                    "price": round(current_price, 2),
                     "prev_close": round(previous_close, 2), 
                    "net_change": round(net_change, 2),
                    "percent_change": round(percent_change, 2)
                }

                print(f"Emitting {symbol}: ₹{current_price} | Change ₹{net_change} | {percent_change:.2f}%")
                clean_symbol = symbol.replace(".NS", "")
                socketio.emit("stock_update", {
                    "symbol": clean_symbol,
                    "price": round(current_price, 2),
                    "prev_close": round(previous_close, 2),
                    "net_change": round(net_change, 2),
                    "percent_change": round(percent_change, 2)
                })

            except Exception as e:
                print(f"Error fetching {symbol}: {e}")

        time.sleep(30)

@socketio.on("connect")
def handle_connect():
    print("Client connected:", request.sid)
    for symbol, data in latest_data.items():
        socketio.emit("stock_update", {"symbol": symbol, **data}, to=request.sid)

@app.route("/")
def home():
    return "Backend running with live stock updates."

threading.Thread(target=fetch_stock_prices, daemon=True).start()

socketio.run(app, debug=False, port=5000)
