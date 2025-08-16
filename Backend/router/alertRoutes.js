const express = require("express");
const router = express.Router();
const User = require("../model/usersmodel");
const Alert = require("../model/Alertmodel");

// Get alerts for a firebaseUID (unread first, then recent)
router.get("/alerts/:firebaseUID", async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUID: req.params.firebaseUID });
    if (!user) return res.status(404).json({ message: "User not found" });

    const alerts = await Alert.find({ user: user._id })
      .sort({ read: 1, createdAt: -1 })
      .limit(100);
    res.json(alerts);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});

// Mark read
router.post("/alerts/:id/read", async (req, res) => {
  try {
    const updated = await Alert.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
