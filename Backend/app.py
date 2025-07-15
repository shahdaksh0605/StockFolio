from flask import Flask
from flask_socketio import SocketIO
from flask_cors import CORS
from flask import request
import yfinance as yf
import threading
import time

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app,cors_allowed_origins="*",ping_timeout=20, ping_interval=10,async_mode="threading")

symbols = ["RELIANCE.NS", "TCS.NS", "INFY.NS", "HDFCBANK.NS", "^BSESN", "^NSEI"]
latest_prices = {}


def fetch_stock_prices():
    global latest_prices
    while True:
        for symbol in symbols:
            ticker = yf.Ticker(symbol)
            hist = ticker.history(period="1d")
            if not hist.empty:
                price = hist["Close"].iloc[-1]
                latest_prices[symbol] = float(price)
                print(f"Emitting {symbol}: ₹{price}")
                # Emit to ALL clients
                socketio.emit("stock_update", {"symbol": symbol, "price": float(price)})
        time.sleep(30)


@socketio.on("connect")
def handle_connect():
    print("A client connected")
    for symbol, price in latest_prices.items():
        print(symbol,price)
        socketio.emit("stock_update", {"symbol": symbol, "price": price},to=request.sid)

@app.route("/")
def home():
    return "backend running"



threading.Thread(target=fetch_stock_prices, daemon=True).start()
socketio.run(app, debug=False, port=5000)
