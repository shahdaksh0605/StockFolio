import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "../context/authcontext/index"; // assuming you store user in context

const Summary = () => {
  const { currentUser } = useAuth(); // get user from firebase/auth or your system
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    if (!currentUser) return;

    axios
      .get(`http://localhost:8000/api/summary/${currentUser.uid}`)
      .then((res) => setSummary(res.data))
      .catch((err) => console.error(err));
  }, [currentUser]);

  if (!summary) return <p>Loading summary...</p>;

  return (
    <div className="p-3 bg-white rounded shadow-sm w-100 h-100">
      {/* User Greeting */}
      <div className="mb-3 d-flex align-items-center gap-2">
        <FaUserCircle size={28} className="text-primary" />
        <h6 className="mb-0">Hi, {summary.name || "User"}!</h6>
      </div>
      <hr className="my-2" />

      {/* Equity / Balance Section */}
      <div className="mb-4">
        <p className="mb-2 fw-bold">Equity</p>
        <div className="p-3 bg-light rounded">
          <div className="mb-2">
            <h3 className="mb-1">₹{summary.balance.toLocaleString()}</h3>
            <p className="mb-0 text-muted">Margin available</p>
          </div>
          <hr className="my-2" />
          <div className="d-flex flex-column gap-1">
            <p className="mb-0">
              Margins used <span className="fw-bold">₹0</span>
            </p>
            <p className="mb-0">
              Opening balance <span className="fw-bold">₹{summary.balance.toLocaleString()}</span>
            </p>
          </div>
        </div>
        <hr className="my-3" />
      </div>

      {/* Holdings Section */}
      <div className="mb-4">
        <p className="mb-2 fw-bold">Holdings</p>
        <div className="p-3 bg-light rounded">
          <div className="mb-2">
            <h3
              className={`mb-1 ${summary.pnl >= 0 ? "text-success" : "text-danger"}`}
            >
              ₹{summary.pnl.toLocaleString()}{" "}
              <small className={summary.pnl >= 0 ? "text-success" : "text-danger"}>
                {summary.pnlPercent > 0 ? "+" : ""}
                {summary.pnlPercent}%
              </small>
            </h3>
            <p className="mb-0 text-muted">P&L</p>
          </div>
          <hr className="my-2" />
          <div className="d-flex flex-column gap-1">
            <p className="mb-0">
              Current Value <span className="fw-bold">₹{summary.holdingsValue.toLocaleString()}</span>
            </p>
            <p className="mb-0">
              Investment <span className="fw-bold">₹{summary.investment.toLocaleString()}</span>
            </p>
          </div>
        </div>
        <hr className="my-3" />
      </div>
    </div>
  );
};

export default Summary;
