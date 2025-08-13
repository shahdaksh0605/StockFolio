require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./configdb/db");
const userroutes = require("./router/userroutes");
const orderroutes = require("./router/orderroutes"); // ✅ New

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors({}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

db(); // Connect MongoDB

app.get("/health", (req, res) => res.send("OK"));
app.use("/stockfolio", userroutes);
app.use("/stockfolio", orderroutes); // ✅ Register order routes

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
