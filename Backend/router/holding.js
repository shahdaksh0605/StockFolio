// routes/holdings.js
const express = require("express");
const router = express.Router();
const UserModel = require("../model/usersmodel");

const axios = require("axios");

router.get("/getHoldings/:firebaseUID", async (req, res) => {
  try {
    const { firebaseUID } = req.params;
    const user = await UserModel.findOne({ firebaseUID }).populate("orders");

    if (!user) return res.status(404).json({ message: "User not found" });

    const executedOrders = user.orders.filter(o => o.status === "executed");

    let positions = {};

    for (let order of executedOrders) {
      const symbol = order.symbol.toUpperCase();
      if (!positions[symbol]) positions[symbol] = { qty: 0, avg: 0, totalCost: 0 };

      let pos = positions[symbol];

      if (order.mode === "BUY") {
        let newTotalCost = pos.totalCost + order.qty * order.price;
        let newQty = pos.qty + order.qty;
        pos.avg = newTotalCost / newQty;
        pos.totalCost = newTotalCost;
        pos.qty = newQty;
      } else if (order.mode === "SELL") {
        pos.qty -= order.qty;
        pos.totalCost -= order.qty * pos.avg;
        if (pos.qty <= 0) delete positions[symbol];
      }
    }

    // fetch live prices from Flask (5000)
    const holdingsArray = await Promise.all(
      Object.entries(positions).map(async ([symbol, data]) => {
        let stockPrice = 0, dayChange = null, netChange = null;

        try {
          const resp = await axios.get(`http://localhost:5000/history/${symbol}`);
          const hist = resp.data;
          if (hist && hist.length >= 2) {
            const prev = hist[hist.length - 2].price;
            const current = hist[hist.length - 1].price;

            stockPrice = current;
            dayChange = current - prev;
            netChange = (dayChange / prev) * 100;
          }
        } catch (err) {
          console.error(`Price fetch failed for ${symbol}:`, err.message);
        }

        return {
          stockName: symbol,
          quantity: data.qty || 0,
          avg: Number(data.avg?.toFixed(2)) || 0,
          stockPrice: stockPrice || 0,
          dayChange: dayChange !== null ? Number(dayChange.toFixed(2)) : null,
          netChange: netChange !== null ? Number(netChange.toFixed(2)) : null,
        };
      })
    );

    res.json(holdingsArray);
  } catch (err) {
    console.error("Error fetching positions:", err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
