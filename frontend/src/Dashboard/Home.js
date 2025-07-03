import React, { useEffect, useState } from "react";
import socket from "../socket"; // ✅ this must match your path

const stockSymbols = ["AAPL", "TSLA", "MSFT", "NVDA"];

const Home = () => {
  const [prices, setPrices] = useState({});

  useEffect(() => {
    console.log("🔁 useEffect called");

    // Connect once
    if (!socket.connected) {
      socket.connect(); // ✅ manual connect
    }

    socket.on("connect", () => {
      console.log("🟢 Connected to backend");
      socket.emit("subscribe_stocks", { symbols: stockSymbols });
      console.log("📤 Sent subscribe_stocks");
    });

    socket.on("disconnect", () => {
      console.log("🔴 Disconnected from backend");
    });

    socket.on("stock_update", ({ symbol, price }) => {
      console.log("📈 Received from backend:", symbol, price);
      setPrices((prev) => ({ ...prev, [symbol]: price }));
    });

    // Cleanup: don't disconnect globally
    return () => {
      socket.off("connect");
      socket.off("stock_update");
    };
  }, []);

  return (
    <div>
      <h2>📊 Live Prices</h2>
      <ul>
        {Object.entries(prices).map(([symbol, price]) => (
          <li key={symbol}>
            {symbol}: ₹{price.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
