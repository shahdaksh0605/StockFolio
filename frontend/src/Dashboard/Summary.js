import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/authcontext";
import useStockprice from "../useStockprice";
import {
  FaUserCircle,
  FaRupeeSign,
  FaChartLine,
  FaBalanceScale,
  FaPercentage,
} from "react-icons/fa";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

const Summary = () => {
  const { currentUser } = useAuth();
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [historyData, setHistoryData] = useState({});

  // Fetch holdings
  useEffect(() => {
    const fetchHoldings = async () => {
      try {
        if (!currentUser?.uid) return;
        const { data } = await axios.get(
          `http://localhost:8000/stockfolio/getHoldings/${currentUser.uid}`
        );
        setHoldings(data);
      } catch (error) {
        console.error("Summary fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHoldings();
  }, [currentUser]);

  // Fetch history for each holding
  useEffect(() => {
    const fetchHistoryData = async () => {
      try {
        const results = {};
        for (let stock of holdings) {
          const res = await axios.get(
            `http://localhost:5000/history/${stock.stockName}`
          );
          results[stock.stockName] = res.data.map((d) => ({
            date: d.date,
            value: d.price,
          }));
        }
        setHistoryData(results);
      } catch (err) {
        console.error("Error fetching history:", err);
      }
    };

    if (holdings.length > 0) fetchHistoryData();
  }, [holdings]);

  const stockSymbols = holdings.map((h) => h.stockName);
  const stockData = useStockprice(stockSymbols);

  const formatNum = (val) =>
    typeof val === "number" && !isNaN(val) ? val.toFixed(2) : "-";

  let totalInvestment = 0;
  let totalCurrent = 0;

  holdings.forEach((stock) => {
    const current = stockData[stock.stockName]?.price ?? stock.stockPrice ?? 0;
    totalInvestment += stock.avg * stock.quantity;
    totalCurrent += current * stock.quantity;
  });

  const totalPnL = totalCurrent - totalInvestment;
  const totalPnLPercent =
    totalInvestment > 0 ? (totalPnL / totalInvestment) * 100 : 0;

  // pick first stock’s history for sparklines
  const chartData =
    holdings.length > 0 && historyData[holdings[0].stockName]
      ? historyData[holdings[0].stockName]
      : [];

  // prepare bar chart data for all holdings
  const barChartData = holdings.map((stock) => {
    const current = stockData[stock.stockName]?.price ?? stock.stockPrice ?? 0;
    return {
      name: stock.stockName,
      Investment: stock.avg * stock.quantity,
      Current: current * stock.quantity,
    };
  });

  return (
    <div className="container mt-4">
      <div className="card shadow-lg p-4 border-0 rounded-4">
        {/* Header */}
        <div className="d-flex align-items-center mb-4">
          <FaUserCircle size={45} className="me-3 text-primary" />
          <h3 className="fw-bold mb-0">Portfolio Summary</h3>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : holdings.length === 0 ? (
          <p>No holdings to summarize.</p>
        ) : (
          <>
            {/* Summary cards */}
            <div className="row text-center">
              {/* Investment */}
              <div className="col-md-3 mb-3">
                <div className="p-3 rounded-4 shadow-sm h-100 bg-light hover-card">
                  <FaRupeeSign size={22} className="mb-2 text-dark" />
                  <h6>Total Investment</h6>
                  <p className="fw-bold text-primary fs-5">
                    ₹{formatNum(totalInvestment)}
                  </p>
                  <ResponsiveContainer width="100%" height={50}>
                    <LineChart data={chartData}>
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#0d6efd"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Current Value */}
              <div className="col-md-3 mb-3">
                <div className="p-3 rounded-4 shadow-sm h-100 bg-light hover-card">
                  <FaChartLine size={22} className="mb-2 text-success" />
                  <h6>Current Value</h6>
                  <p className="fw-bold text-success fs-5">
                    ₹{formatNum(totalCurrent)}
                  </p>
                  <ResponsiveContainer width="100%" height={50}>
                    <LineChart data={chartData}>
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#198754"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* P&L */}
              <div className="col-md-3 mb-3">
                <div className="p-3 rounded-4 shadow-sm h-100 bg-light hover-card">
                  <FaBalanceScale size={22} className="mb-2" />
                  <h6>P&L</h6>
                  <p
                    className={`fw-bold fs-5 ${
                      totalPnL > 0
                        ? "text-success"
                        : totalPnL < 0
                        ? "text-danger"
                        : "text-secondary"
                    }`}
                  >
                    ₹{formatNum(totalPnL)}
                  </p>
                  <ResponsiveContainer width="100%" height={50}>
                    <LineChart data={chartData}>
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke={totalPnL >= 0 ? "#198754" : "#dc3545"}
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* P&L % */}
              <div className="col-md-3 mb-3">
                <div className="p-3 rounded-4 shadow-sm h-100 bg-light hover-card">
                  <FaPercentage size={22} className="mb-2" />
                  <h6>P&L %</h6>
                  <p
                    className={`fw-bold fs-5 ${
                      totalPnLPercent > 0
                        ? "text-success"
                        : totalPnLPercent < 0
                        ? "text-danger"
                        : "text-secondary"
                    }`}
                  >
                    {formatNum(totalPnLPercent)}%
                  </p>
                  <ResponsiveContainer width="100%" height={50}>
                    <LineChart data={chartData}>
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke={totalPnLPercent >= 0 ? "#198754" : "#dc3545"}
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Holdings Bar Chart */}
            <div className="mt-5">
              <h5 className="fw-bold mb-3 text-center">Holdings Overview</h5>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Investment" fill="#0d6efd" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="Current" fill="#198754" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>

      <style>{`
        .hover-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .hover-card:hover {
          transform: translateY(-5px);
          box-shadow: 0px 8px 20px rgba(0,0,0,0.15);
        }
      `}</style>
    </div>
  );
};

export default Summary;
