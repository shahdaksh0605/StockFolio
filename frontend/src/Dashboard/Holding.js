import React, { useState, useEffect } from "react";
import useStockprice from "../useStockprice";
import { useAuth } from "../context/authcontext";
import axios from "axios";
import socket from "../socket";

const Holding = () => {
  const { currentUser } = useAuth();
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fallingSymbols, setFallingSymbols] = useState({});
  const stockSymbols = stocks.map((s) => s.stockName);

  // === Prediction Alerts ===
  useEffect(() => {
    const handler = (payload) => {
      if (payload?.decision === "fall" && payload?.symbol) {
        setFallingSymbols((prev) => ({
          ...prev,
          [payload.symbol]: true,
        }));
      }
    };
    socket.on("prediction_alert", handler);
    return () => socket.off("prediction_alert", handler);
  }, []);

  // === Fetch Holdings ===
  useEffect(() => {
    const fetchHoldings = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `http://localhost:8000/stockfolio/getHoldings/${currentUser?.uid}`
        );
        console.log("Fetched holdings:", data); // 👈 Debug
        setStocks(data);
      } catch (error) {
        console.error("Error fetching holdings:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.uid) fetchHoldings();
  }, [currentUser]);

  // === Live Prices ===
  const stockData = useStockprice(stockSymbols);

  // Safe formatter
  const formatNum = (val) =>
    typeof val === "number" && !isNaN(val) ? val.toFixed(2) : "-";

  // === Render ===
  return (
    <div className="container mt-4">
      <h3 className="mb-3">Your Holdings</h3>
      {loading ? (
        <p>Loading...</p>
      ) : stocks.length === 0 ? (
        <p>No holdings found.</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Stock</th>
              <th>Qty</th>
              <th>Avg Price</th>
              <th>Current Price</th>
              <th>P&L</th>
              <th>DayChange</th>
              <th>NetChange</th>

            </tr>
          </thead>
          <tbody>
            {stocks.map((stock) => {
              const current = stockData[stock.stockName]?.price ?? stock.stockPrice ?? 0;
              const pnl = current > 0 ? (current - stock.avg) * stock.quantity : null;

              return (
                <tr key={stock.stockName}>
                  <td>{stock.stockName}</td>
                  <td>{stock.quantity}</td>
                  <td>{formatNum(stock.avg)}</td>
                  <td>{formatNum(current)}</td>
                  <td className={pnl > 0 ? "text-success" : pnl < 0 ? "text-danger" : ""}>
                    {pnl !== null ? formatNum(pnl) : "-"}
                  </td>
                  <td className={stock.dayChange > 0 ? "text-success" : stock.dayChange < 0 ? "text-danger" : ""}>
                    {stock.dayChange !== null ? formatNum(stock.dayChange) : "-"}
                  </td>
                  <td className={stock.netChange > 0 ? "text-success" : stock.netChange < 0 ? "text-danger" : ""}>
                    {stock.netChange !== null ? formatNum(stock.netChange) + "%" : "-"}
                  </td>
                </tr>
              );
            })}

          </tbody>
        </table>
      )}
    </div>
  );
};

export default Holding;
