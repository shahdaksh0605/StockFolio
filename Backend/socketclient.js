// socket-worker.js
const { io } = require("socket.io-client");
const { OrderModel } = require("./model/Ordermodel");
const Holding = require("./model/Holdingmodel");
const User = require("./model/usersmodel");

// --- live price cache ---
const livePrices = Object.create(null);

const socket = io("http://127.0.0.1:5000", {
  transports: ["websocket"],
  reconnection: true,
});

socket.on("connect", () => {
  console.log("📡 Connected to Flask price feed");
});

socket.on("stock_update", async (payload) => {
  try {
    const { symbol, price } = payload;
    if (!symbol || price == null) return;

    const cleanSymbol = String(symbol).replace(/\.NS$/i, "").toUpperCase();

    let prevClose = payload.previous_close;

    if (prevClose == null && typeof payload.net_change === "number") {
      prevClose = Number(price) - Number(payload.net_change);
    }
    if (prevClose == null && typeof payload.percent_change === "number") {
      const pct = Number(payload.percent_change);
      if (isFinite(pct)) {
        prevClose = Number(price) / (1 + pct / 100);
      }
    }
    if (prevClose == null) prevClose = Number(price);

    livePrices[cleanSymbol] = {
      price: Number(price),
      prevClose: Number(prevClose),
      netChange:
        typeof payload.net_change === "number"
          ? Number(payload.net_change)
          : Number(price) - Number(prevClose),
      pctChange:
        typeof payload.percent_change === "number"
          ? Number(payload.percent_change)
          : ((Number(price) - Number(prevClose)) / Number(prevClose)) * 100,
      ts: Date.now(),
    };

    await handlePriceTick(cleanSymbol, Number(price));
  } catch (err) {
    console.error("❌ Error in stock_update handler:", err);
  }
});

function calcPercentChange(current, base) {
  const c = Number(current);
  const b = Number(base);
  if (!isFinite(c) || !isFinite(b) || b === 0) return "0%";
  return (((c - b) / b) * 100).toFixed(2) + "%";
}

async function handlePriceTick(cleanSymbol, currentPrice) {
  const pendingOrders = await OrderModel.find({
    symbol: cleanSymbol,
    status: "pending",
  }).sort({ createdAt: 1 });

  if (!pendingOrders.length) return;

  for (const order of pendingOrders) {
    const targetPrice = Number(order.price);
    const live = livePrices[cleanSymbol] || {};
    const px = isFinite(live.price) ? live.price : currentPrice;

    const shouldBuy = order.mode === "BUY" && px <= targetPrice + 1;
    const shouldSell = order.mode === "SELL" && px >= targetPrice;

    if (!(shouldBuy || shouldSell)) continue;

    const updated = await OrderModel.findOneAndUpdate(
      { _id: order._id, status: "pending" },
      { status: "executed", executedAt: new Date(), executedPrice: px },
      { new: true }
    );

    if (!updated) continue;

    if (shouldBuy) {
      await addToHoldings(order.user, cleanSymbol, Number(order.qty), px);
      console.log(`✅ BUY executed for ${cleanSymbol} at ${px}`);
    } else {
      await reduceHoldings(order.user, cleanSymbol, Number(order.qty));
      console.log(`✅ SELL executed for ${cleanSymbol} at ${px}`);
    }
  }
}

// --- Holdings ---
async function addToHoldings(userId, symbol, qty, execPrice) {
  qty = Number(qty);
  execPrice = Number(execPrice);

  const live = livePrices[symbol] || {};
  const prevClose = isFinite(live.prevClose) ? live.prevClose : execPrice;

  let holding = await Holding.findOne({ user: userId, stockName: symbol });

  if (holding) {
    const totalCost = holding.avg * holding.quantity + execPrice * qty;
    const totalQty = holding.quantity + qty;

    holding.avg = totalCost / totalQty;
    holding.quantity = totalQty;
    holding.stockPrice = execPrice;

    holding.net = calcPercentChange(execPrice, holding.avg);
    holding.day = calcPercentChange(execPrice, prevClose);

    await holding.save();
  } else {
    holding = await Holding.create({
      user: userId,
      stockName: symbol,
      quantity: qty,
      avg: execPrice,
      stockPrice: execPrice,
      net: "0.00%",
      day: calcPercentChange(execPrice, prevClose),
    });
  }

  await User.findByIdAndUpdate(userId, {
    $addToSet: { portfolio: holding._id },
  });
}

async function reduceHoldings(userId, symbol, qty) {
  const holding = await Holding.findOne({ user: userId, stockName: symbol });
  if (!holding) return;

  if (holding.quantity > qty) {
    holding.quantity -= qty;
    await holding.save();
  } else {
    await Holding.deleteOne({ _id: holding._id });
    await User.findByIdAndUpdate(userId, { $pull: { portfolio: holding._id } });
  }
}

module.exports = {};
