require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./configdb/db");
const userroutes = require("./router/userroutes");
const orderroutes = require("./router/orderroutes"); 
const holdingsRoutes = require("./router/holding");
const summaryRoutes = require("./router/summaryRoutes")
const watchlistRoutes = require("./router/watchlistRoutes");
const alertRoutes = require("./router/alertRoutes");

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors({}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

db(); // Connect MongoDB

app.get("/health", (req, res) => res.send("OK"));
app.use("/stockfolio", userroutes);
app.use("/stockfolio", orderroutes); // ✅ Register order routes
app.use("/stockfolio", holdingsRoutes);
app.use("/stockfolio", alertRoutes);
app.use("/api",summaryRoutes);
app.use("/stockfolio/watchlist", watchlistRoutes);

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
