import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/authcontext/index";
import useStockPrices from "../useStockprice"; // your socket hook

const Holdings = () => {
  const { currentUser } = useAuth();
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const prices = useStockPrices(); // live prices from socket

  useEffect(() => {
    if (!currentUser?.uid) return;

    axios
      .get(`http://localhost:8000/stockfolio/getHoldings/${currentUser.uid}`)
      .then((res) => {
        setHoldings(res.data || []);
      })
      .catch((err) => {
        console.error("Error fetching holdings:", err);
      })
      .finally(() => setLoading(false));
  }, [currentUser]);

  if (loading) return <p>Loading holdings...</p>;

  return (
    <>
      <h3 className="mb-4">Holdings ({holdings.length})</h3>
      <div className="table-responsive mb-4">
        <table className="table table-bordered align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg. cost</th>
              <th>LTP</th>
              <th>Cur. val</th>
              <th>P&L</th>
              <th>Net chg.</th>
              <th>Day chg.</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((stock, index) => {
              const live = prices?.[stock.stockName] || {};
              const avg = Number(stock.avg) || 0;
              const qty = Number(stock.quantity) || 0;
              const ltp = (live.price !== undefined && live.price !== null)
                ? live.price
                : (stock.stockPrice > 0 ? stock.stockPrice : stock.avg);  // fallback to avg if no live price
              const curValue = ltp * qty;
              const pl = (ltp - avg) * qty;
              
              const netChange =
                avg !== 0
                  ? `${(((ltp - avg) / avg) * 100).toFixed(2)}%`
                  : "0.00%";

              const dayChange =
                live.percent_change != null
                  ? `${Number(live.percent_change).toFixed(2)}%`  
                  : "0.00%";

              const profitClass = pl >= 0 ? "text-success" : "text-danger";
              const dayClass = dayChange.startsWith("-")
                ? "text-danger"
                : "text-success";

              return (
                <tr key={index}>
                  <td>{stock.stockName || "-"}</td>
                  <td>{qty}</td>
                  <td>{avg.toFixed(2)}</td>
                  <td>{ltp.toFixed(2)}</td>
                  <td>{curValue.toFixed(2)}</td>
                  <td className={profitClass}>{pl.toFixed(2)}</td>
                  <td className={profitClass}>{netChange}</td>
                  <td className={dayClass}>{dayChange}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Holdings;
