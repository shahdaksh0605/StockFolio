const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    firebaseUID: { type: String, required: true, unique: true },
    portfolio: [{ type: mongoose.Schema.Types.ObjectId, ref: "holding" }],
    positions: [{ type: mongoose.Schema.Types.ObjectId, ref: "position" }],
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
    balance: { type: Number, default: 1000000 } 
});

const User = mongoose.model("User", userSchema);
module.exports = User;
