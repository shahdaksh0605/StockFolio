import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import GeneralContext from "./GeneralContext";
import "./BuyActionWindow.css";
import { useAuth } from "../../src/context/authcontext/index";

const BuyActionWindow = ({ uid }) => {
  const [stockSymbol, setStockSymbol] = useState(""); // ✅ New field
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(0.0);
  const generalContext = useContext(GeneralContext);
  const { currentUser } = useAuth();


  const handleBuyClick = () => {
    if (!stockSymbol || stockQuantity <= 0 || stockPrice <= 0) {
      alert("Please enter valid stock symbol, quantity, and price.");
      return; 
    }

    axios.post("http://localhost:8000/stockfolio/newOrder", {
        firebaseUID: currentUser.uid,               // your backend should expect this
        symbol: stockSymbol.toUpperCase(), // convert to uppercase
        qty: Number(stockQuantity),
        price: Number(stockPrice),
        mode: "BUY",
      })
      .then(() => {
        console.log("✅ Order placed successfully");
      })
      .catch((err) => {
        console.error("❌ Error placing order:", err);
      });

    generalContext.closeBuyWindow();
  };

  const handleCancelClick = () => {
    generalContext.closeBuyWindow();
  };

  return (
    <div className="container" id="buy-window" draggable="true">
      <div className="regular-order">
        <div className="inputs">
          {/* ✅ Stock Symbol */}
          <fieldset>
            <legend>Stock</legend>
            <input
              type="text"
              name="symbol"
              id="symbol"
              placeholder="Enter stock symbol (e.g., TCS)"
              onChange={(e) => setStockSymbol(e.target.value)}
              value={stockSymbol}
            />
          </fieldset>

          {/* Quantity */}
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              name="qty"
              id="qty"
              min="1"
              onChange={(e) => setStockQuantity(e.target.value)}
              value={stockQuantity}
            />
          </fieldset>

          {/* Price */}
          <fieldset>
            <legend>Price</legend>
            <input
              type="number"
              name="price"
              id="price"
              step="0.05"
              onChange={(e) => setStockPrice(e.target.value)}
              value={stockPrice}
            />
          </fieldset>
        </div>
      </div>

      {/* Buttons */}
      <div className="buttons">
        <span>Margin required ₹140.65</span>
        <div>
          <Link className="btn btn-blue" onClick={handleBuyClick}>
            Buy
          </Link>
          <Link to="" className="btn btn-grey" onClick={handleCancelClick}>
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BuyActionWindow;
