const express = require("express");
const router = express.Router();
const User = require("../model/usersmodel");
const Alert = require("../model/Alertmodel");

// 🔹 Save a new alert (called by Flask backend via axios.post)
// 🔹 Save a new alert (called by Flask backend via axios.post)
router.post("/alerts/save", async (req, res) => {
  try {
    const { firebaseUID, symbol, now, predicted, predicted_change_pct, threshold_pct, decision, raw } = req.body;

    // find user by firebaseUID
    const user = await User.findOne({ firebaseUID });
    if (!user) return res.status(404).json({ message: "User not found" });

    const alert = new Alert({
      user: user._id,
      symbol,
      category: "prediction", // fixed since your schema only has this category
      decision, // "fall" or "neutral_or_rise"
      now,
      predicted,
      predicted_change_pct,
      threshold_pct,
      raw
    });

    await alert.save();
    res.json(alert);
  } catch (e) {
    console.error("Error saving alert:", e);
    res.status(500).json({ message: "Server error" });
  }
});


// 🔹 Get alerts for a firebaseUID (unread first, then recent)
router.get("/alerts/:firebaseUID", async (req, res) => {
  console.log("uid = "+req.params.firebaseUID)
  try {
    const user = await User.findOne({ firebaseUID: req.params.firebaseUID });
    if (!user) return res.status(404).json({ message: "User not found" });

    const alerts = await Alert.find({ user: user._id })
      .sort({ read: 1, createdAt: -1 })
      .limit(100);

    res.json(alerts);
  } catch (e) {
    console.error("Error fetching alerts:", e);
    res.status(500).json({ message: "Server error" });
  }
});

// 🔹 Mark alert as read
router.post("/alerts/:id/read", async (req, res) => {
  try {
    const updated = await Alert.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  } catch (e) {
    console.error("Error marking alert as read:", e);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
