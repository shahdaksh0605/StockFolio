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

    // 🔑 Find holdings by user's MongoDB _id (since holding.user is an ObjectId ref to User)
    const holdings = await Holding.find({ user: user._id });

    let investment = 0;
    let currentValue = 0;

    holdings.forEach(h => {
      investment += h.quantity * h.avg;
      currentValue += h.quantity * h.stockPrice;
    });

    const pnl = currentValue - investment;
    const pnlPercent = investment > 0 ? ((pnl / investment) * 100).toFixed(2) : 0;

    res.json({
      name: user.name,
      balance: user.balance,
      holdingsValue: currentValue,
      investment,
      pnl,
      pnlPercent
    });

  } catch (err) {
    console.error("SUMMARY API ERROR:", err);
    res.status(500).json({ error: "Failed to fetch summary", details: err.message });
  }
});

module.exports = router
