const express = require("express");
const Holding = require("../model/Holdingmodel.js"); // your holdings schema
const User = require("../model/usersmodel.js"); // your user schema

const router = express.Router();

router.get("/summary/:firebaseUID", async (req, res) => {
  try {
    const firebaseUID = req.params.firebaseUID;
    console.log("Fetching summary for Firebase UID:", firebaseUID);

    // 🔑 Find the user by firebaseUID
    const user = await User.findOne({ firebaseUID });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // 🔑 Get holdings
    const holdings = await Holding.find({ user: user._id });

    // If no holdings, return default summary
    if (!holdings || holdings.length === 0) {
      return res.json({
        name: user.name,
        balance: user.balance,
        investment: 0,
        currentValue: 0,
        pnl: 0,
        pnlPercent: 0,
        holdings: []
      });
    }

    let investment = 0;
    let currentValue = 0;

    const holdingsWithPnL = holdings.map(h => {
      const invested = h.quantity * h.avg;
      const value = h.quantity * h.stockPrice;
      const pnl = value - invested;
      const pnlPercent = invested > 0 ? (pnl / invested) * 100 : 0;

      // add to totals
      investment += invested;
      currentValue += value;

      return {
        stockName: h.stockName,
        quantity: h.quantity,
        avg: h.avg,
        stockPrice: h.stockPrice,
        invested,
        currentValue: value,
        pnl,
        pnlPercent
      };
    });

    const totalPnL = currentValue - investment;
    const totalPnLPercent = investment > 0 ? (totalPnL / investment) * 100 : 0;

    res.json({
      name: user.name,
      balance: user.balance,
      investment,
      currentValue,
      pnl: totalPnL,
      pnlPercent: totalPnLPercent,
      holdings: holdingsWithPnL // 👈 detailed breakdown
    });

  } catch (err) {
    console.error("SUMMARY API ERROR:", err);
    res.status(500).json({ error: "Failed to fetch summary", details: err.message });
  }
});

module.exports = router
