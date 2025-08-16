const express = require("express");
const router = express.Router();
const {OrderModel} = require("../model/Ordermodel");   // ✅ No destructure
const UserModel = require("../model/usersmodel");
const HoldingModel = require("../model/Holdingmodel"); // ✅ Import holdings
const socketClient = require("../socketclient"); // Optional: emit events to socket worker

// Place new order
router.post("/newOrder", async (req, res) => {
  try {
    let { firebaseUID, symbol, qty, price, mode } = req.body;

    // Validate required fields
    if (!firebaseUID || !symbol || !qty || !price || !mode) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Convert qty and price to numbers
    qty = Number(qty);
    price = Number(price);
    if (qty <= 0 || price <= 0) {
      return res.status(400).json({ message: "Quantity and price must be positive" });
    }

    // Find user
    const user = await UserModel.findOne({ firebaseUID });
    if (!user) return res.status(404).json({ message: "User not found" });

    const cleanSymbol = symbol.replace(/\.NS$/i, "").toUpperCase();

    // If SELL → validate holdings
    if (mode === "SELL") {
      const holdings = await HoldingModel.aggregate([
        { $match: { user: user._id, stockName: cleanSymbol } },
        { $group: { _id: null, totalQty: { $sum: "$quantity" } } }
      ]);

      const availableQty = holdings[0]?.totalQty || 0;
      if (qty > availableQty) {
        return res.status(400).json({ message: "Not enough holdings to SELL" });
      }
    }

    // Create order with status "pending"
    const order = await OrderModel.create({
      user: user._id,
      symbol: cleanSymbol,
      qty,
      price,
      mode,
      status: "pending"
    });

    // Link order to user
    user.orders.push(order._id);
    await user.save();

    // Optional: emit to socket worker for immediate handling
    // socketClient.emit("newOrder", { orderId: order._id, symbol: cleanSymbol, qty, price, mode });

    res.status(201).json({ message: "Order placed", order });
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all orders for a user
router.get("/getOrders/:firebaseUID", async (req, res) => {
  try {
    const { firebaseUID } = req.params;
    const user = await UserModel.findOne({ firebaseUID }).populate("orders");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
