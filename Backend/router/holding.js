// routes/holdings.js
const express = require("express");
const router = express.Router();
const UserModel = require("../model/usersmodel");

router.get("/getHoldings/:firebaseUID", async (req, res) => {
  try {
    const { firebaseUID } = req.params;
    const user = await UserModel.findOne({ firebaseUID }).populate("orders");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Filter executed orders only
    const executedOrders = user.orders.filter(o => o.status === "executed");

    let positions = {};

    for (let order of executedOrders) {
      // Make sure symbol matches frontend/socket format (no .NS here)
      const symbol = order.symbol.toUpperCase();

      if (!positions[symbol]) {
        positions[symbol] = { qty: 0, avg: 0, totalCost: 0 };
      }

      let pos = positions[symbol];

      if (order.mode === "BUY") {
        let newTotalCost = pos.totalCost + order.qty * order.price;
        let newQty = pos.qty + order.qty;
        pos.avg = newTotalCost / newQty;
        pos.totalCost = newTotalCost;
        pos.qty = newQty;
      } 
      else if (order.mode === "SELL") {
        pos.qty -= order.qty;
        pos.totalCost -= order.qty * pos.avg;
        if (pos.qty <= 0) {
          delete positions[symbol];
        }
      }
    }

    // Send in the format frontend expects
    const holdingsArray = Object.entries(positions).map(([symbol, data]) => ({
      stockName: symbol,      // Matches frontend
      quantity: data.qty || 0,
      avg: Number(data.avg?.toFixed(2)) || 0,
      stockPrice: 0           // Will be updated by socket
    }));

    res.json(holdingsArray);

  } catch (err) {
    console.error("Error fetching positions:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
