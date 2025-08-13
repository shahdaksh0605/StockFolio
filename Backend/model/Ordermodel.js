const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    symbol: { type: String, required: true },
    qty: { type: Number, required: true },
    price: { type: Number, required: true },
    mode: { type: String, enum: ["BUY", "SELL"], required: true },
    status: { type: String, enum: ["pending", "executed"], default: "pending" },
    createdAt: { type: Date, default: Date.now }
});

const OrderModel = mongoose.model("Order", OrderSchema);
module.exports = { OrderModel };
