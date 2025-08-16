// routes/watchlistRoutes.js
const express = require("express");
const router = express.Router();
const axios = require("axios");
const Watchlist = require("../model/WatchlistModel");
const User = require("../model/usersmodel");

// GET user watchlist
router.get("/:uid", async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUID: req.params.uid });
    if (!user) return res.status(404).json({ message: "User not found" });

    let watchlist = await Watchlist.findOne({ user: user._id });

    // If no watchlist exists, create with default stocks
    if (!watchlist) {
      watchlist = await Watchlist.create({ user: user._id });

      // Send default stocks to Flask backend
      axios
        .post("http://localhost:5000/setwatchlist", { symbols: watchlist.stocks })
        .then(() => console.log("Flask backend updated with default stocks"))
        .catch((err) =>
          console.error("Failed to update Flask backend:", err.message)
        );
    }

    res.json(watchlist.stocks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/remove", async (req, res) => {
  const { uid, symbol } = req.body;
  if (!uid || !symbol)
    return res.status(400).json({ message: "Missing uid or symbol" });

  try {
    const user = await User.findOne({ firebaseUID: uid });
    if (!user) return res.status(404).json({ message: "User not found" });

    let watchlist = await Watchlist.findOne({ user: user._id });
    if (!watchlist) return res.status(404).json({ message: "Watchlist not found" });

    const upperSymbol = symbol.toUpperCase();
    if (watchlist.stocks.includes(upperSymbol)) {
      watchlist.stocks = watchlist.stocks.filter(s => s !== upperSymbol);
      await watchlist.save();

      // Notify Flask backend about the updated watchlist
      axios
        .post("http://localhost:5000/setwatchlist", {
          symbols: watchlist.stocks
        })
        .then(() => console.log(`Flask backend updated after removing ${upperSymbol}`))
        .catch(err => console.error("Failed to update Flask backend:", err.message));
    }

    res.json(watchlist.stocks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// POST add stock to watchlist
router.post("/add", async (req, res) => {
  const { uid, symbol } = req.body;
  if (!uid || !symbol)
    return res.status(400).json({ message: "Missing uid or symbol" });

  try {
    const user = await User.findOne({ firebaseUID: uid });
    if (!user) return res.status(404).json({ message: "User not found" });

    let watchlist = await Watchlist.findOne({ user: user._id });
    if (!watchlist) {
      watchlist = await Watchlist.create({ user: user._id });
    }

    const upperSymbol = symbol.toUpperCase();
    if (!watchlist.stocks.includes(upperSymbol)) {
      watchlist.stocks.push(upperSymbol);
      await watchlist.save();

      // Notify Flask backend to update live symbols
      axios
        .post("http://localhost:5000/setwatchlist", { symbols: watchlist.stocks })
        .then(() => console.log(`Flask backend updated with ${upperSymbol}`))
        .catch((err) =>
          console.error("Failed to update Flask backend:", err.message)
        );
    }

    res.json(watchlist.stocks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
