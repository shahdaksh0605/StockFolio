from flask import Flask
from flask_socketio import SocketIO
import threading
import websocket
import json
import time

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode="threading")
API_KEY = "d1j4nj1r01qhbuvtg17gd1j4nj1r01qhbuvtg180"

connected_symbols = set()
pending_subscriptions = set()
ws_app = None

@socketio.on("connect")
def handle_connect():
    print("🔌 A client connected via WebSocket")

def on_message(ws, message):
    print("📩 Received from Finnhub:", message)
    data = json.loads(message)
    if data.get("type") == "trade":
        for trade in data["data"]:
            print("📤 Emitting to frontend:", trade["s"], trade["p"])
            print(trade["s"],trade["p"])
            socketio.emit("stock_update", {
                "symbol": trade["s"],   
                "price": trade["p"]
            })

def on_open(ws):
    print("✅ WebSocket connection opened.")
    # Resubscribe to all connected symbols
    for symbol in connected_symbols:
        subscribe(ws, symbol)

    # Loop to handle new subscription requests dynamically
    def subscription_loop():
        while True:
            if pending_subscriptions:
                symbol = pending_subscriptions.pop()
                if symbol not in connected_symbols:
                    connected_symbols.add(symbol)
                    subscribe(ws, symbol)
            time.sleep(1)  # avoid tight loop

    threading.Thread(target=subscription_loop, daemon=True).start()

def subscribe(ws, symbol):
    message = json.dumps({"type": "subscribe", "symbol": symbol})
    print("📡 Subscribing to:", symbol)
    ws.send(message)

def run_finnhub_websocket():
    global ws_app
    ws_app = websocket.WebSocketApp(
        f"wss://ws.finnhub.io?token={API_KEY}",
        on_open=on_open,
        on_message=on_message
    )
    ws_app.run_forever()

# Start Finnhub WebSocket only once
threading.Thread(target=run_finnhub_websocket, daemon=True).start()

@socketio.on("subscribe_stocks")
def handle_subscription(data):
    symbols = data.get("symbols", [])
    print(f"🖥️  Client subscribed to: {symbols}")
    for symbol in symbols:
        print(f"📦 Adding symbol to queue: {symbol}")
        if symbol not in connected_symbols:
            pending_subscriptions.add(symbol)  # Let on_open thread handle send

@app.route("/")
def home():
    return "Backend Running"

if __name__ == "__main__":
    socketio.run(app, debug=True, port=5000)
