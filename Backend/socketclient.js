const { io } = require("socket.io-client");
const { OrderModel } = require("./model/Ordermodel");
const Holding = require("./model/Holdingmodel");
const User = require("./model/usersmodel");

const socket = io("http://127.0.0.1:5000", {
    transports: ["websocket"],
    reconnection: true
});

socket.on("connect", () => {
    console.log("📡 Connected to Flask price feed");
});

socket.on("stock_update", async ({ symbol, price }) => {
    try {
        console.log("💹 Price update:", symbol, price);

        // Normalize incoming symbol from Flask
        const cleanSymbol = symbol.replace(/\.NS$/i, "").toUpperCase();

        // Get all pending orders for this stock
        const pendingOrders = await OrderModel.find({
            symbol: cleanSymbol,
            status: "pending"
        });

        if (!pendingOrders.length) return;

        for (let order of pendingOrders) {
            const targetPrice = Number(order.price);
            const currentPrice = Number(price);
            console.log(`🔍 Checking ${order.symbol} | Mode: ${order.mode} | Order Price: ${targetPrice} | Current Price: ${currentPrice}`);

            if (order.mode === "BUY" && currentPrice <= targetPrice+1) {
                const updated = await OrderModel.findOneAndUpdate(
                    { _id: order._id, status: "pending" },
                    { status: "executed" },
                    { new: true }
                );
                if (updated) {
                    console.log(`✅ BUY executed for ${cleanSymbol} at ${currentPrice}`);
                    await addToHoldings(order.user, cleanSymbol, order.qty, currentPrice); // ✅ Use cleanSymbol
                }
            }

            if (order.mode === "SELL" && currentPrice >= targetPrice) {
                const updated = await OrderModel.findOneAndUpdate(
                    { _id: order._id, status: "pending" },
                    { status: "executed" },
                    { new: true }
                );
                if (updated) {
                    console.log(`✅ SELL executed for ${cleanSymbol} at ${currentPrice}`);
                    await reduceHoldings(order.user, cleanSymbol, order.qty); // ✅ Use cleanSymbol
                }
            }
        }
    } catch (err) {
        console.error("❌ Error updating orders:", err);
    }
});

async function addToHoldings(userId, symbol, qty, price) {
    console.log(`📥 Adding to holdings: ${symbol} | Qty: ${qty} | Price: ${price}`);

    let holding = await Holding.findOne({ user: userId, stockName: symbol });

    if (holding) {
        // Update existing holding
        const totalCost = holding.avg * holding.quantity + price * qty;
        const totalQty = holding.quantity + qty;
        holding.avg = totalCost / totalQty;
        holding.quantity = totalQty;
        holding.stockPrice = price;
        await holding.save();

        await User.findByIdAndUpdate(userId, {
            $addToSet: { portfolio: holding._id }
        });
    } else {
        // Create new holding
        holding = await Holding.create({
            user: userId,
            stockName: symbol,
            quantity: qty,
            avg: price,
            stockPrice: price,
            net: "+0%",
            day: "+0%"
        });

        // Add to user's portfolio without duplicates
        await User.findByIdAndUpdate(userId, {
            $addToSet: { portfolio: holding._id }
        });
    }
}

async function reduceHoldings(userId, symbol, qty) {
    const holding = await Holding.findOne({ user: userId, stockName: symbol });
    if (!holding) return;

    if (holding.quantity > qty) {
        holding.quantity -= qty;
        await holding.save();
    } else {
        // Remove holding if sold out
        await Holding.deleteOne({ _id: holding._id });
        await User.findByIdAndUpdate(userId, { $pull: { portfolio: holding._id } });
    }
}

module.exports = {};
