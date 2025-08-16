// models/WatchlistModel.js
const mongoose = require("mongoose");

const defaultStocks = [
  "INFY",
  "TCS",
  "RELIANCE",
  "HDFCBANK",
  "ICICIBANK",
  "HINDUNILVR",
  "BHARTIARTL",
  "LT",
  "WIPRO"
];

const watchlistSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  stocks: {
    type: [String],
    required: true,
    default: defaultStocks
  }
});

module.exports = mongoose.model("Watchlist", watchlistSchema);
