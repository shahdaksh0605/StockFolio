const express = require("express");
const router = express.Router();
const { OrderModel } = require("../model/Ordermodel");
const UserModel = require("../model/usersmodel");
const socketClient = require("../socketclient"); // We'll create this

router.post("/newOrder", async (req, res) => {
  try {
    const { firebaseUID, symbol, qty, price, mode } = req.body;

    if (!firebaseUID || !symbol || !qty || !price || !mode) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find the user by firebaseUID
    const user = await UserModel.findOne({ firebaseUID });
    if (!user) return res.status(404).json({ message: "User not found" });

    const cleanSymbol = symbol.replace(/\.NS$/i, "").toUpperCase();


    // Create order with status 'pending'
    const order = await OrderModel.create({
      user: user._id,
      cleanSymbol,
      qty,
      price,
      mode,
      status: "pending"
    });

    // Link to user
    user.orders.push(order._id);
    await user.save();

    // Start watching the price for this order
    socketClient.watchOrder(order);

    res.status(201).json({ message: "Order placed and pending", order });
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ message: "Server error" });
  }
});

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
