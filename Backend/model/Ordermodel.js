const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  symbol: { type: String, required: true },
  qty: { type: Number, required: true },
  price: { type: Number, required: true },
  mode: { type: String, enum: ["BUY", "SELL"], required: true },
  status: { type: String, enum: ["pending", "executed", "cancelled"], default: "pending" },
}, { timestamps: true }); // ✅ needed for today's positions

module.exports.OrderModel = mongoose.model("Order", orderSchema);