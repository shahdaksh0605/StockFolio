import React, { useState, useContext } from "react";
import GeneralContext from "./GeneralContext";
import { useAuth } from "../context/authcontext/index"; // or wherever you store Firebase user
import axios from "axios";

const SellActionWindow = ({ uid: stockSymbol }) => {
  const { closeSellWindow } = useContext(GeneralContext);
  const { currentUser } = useAuth();
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSell = async () => {
    if (!quantity || !price) {
      setMessage("Quantity and price are required.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post("http://localhost:8000/stockfolio/newOrder", {
        firebaseUID: currentUser.uid,
        symbol: stockSymbol,
        qty: Number(quantity),
        price: Number(price),
        mode: "SELL",
      });

      setMessage("Sell order placed! It will execute when the price matches.");
      setQuantity(0);
      setPrice(0);
      // Optionally close the window
      closeSellWindow()
    } catch (err) {
      console.error("Error placing sell order:", err);
      if (err.response?.data?.message) {
        setMessage(err.response.data.message);
      } else {
        setMessage("Failed to place sell order.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="sell-action-window position-fixed top-50 start-50 translate-middle bg-white p-4 rounded shadow"
      style={{ zIndex: 1000, width: "300px" }}
    >
      <h5 className="mb-3">SELL {stockSymbol}</h5>

      <div className="mb-2">
        <label className="form-label">Quantity</label>
        <input
          type="number"
          className="form-control"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          min={1}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Price</label>
        <input
          type="number"
          className="form-control"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          min={0.01}
          step={0.01}
        />
      </div>

      {message && <p className="text-danger small">{message}</p>}

      <div className="d-flex justify-content-end">
        <button className="btn btn-secondary me-2" onClick={closeSellWindow}>
          Cancel
        </button>
        <button className="btn btn-danger" onClick={handleSell} disabled={loading}>
          {loading ? "Placing..." : "SELL"}
        </button>
      </div>
    </div>
  );
};

export default SellActionWindow;
