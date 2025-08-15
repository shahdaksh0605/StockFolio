// socket-worker.js
const { io } = require("socket.io-client");
const { OrderModel } = require("./model/Ordermodel");
const Holding = require("./model/Holdingmodel");
const User = require("./model/usersmodel");

// --- live price cache ---
const livePrices = {};

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
    livePrices[cleanSymbol] = Number(price);

    await handleOrders(cleanSymbol, Number(price));
  } catch (err) {
    console.error("❌ Error in stock_update handler:", err);
  }
});

// --- Percent change helper ---
function calcPercentChange(current, base) {
  const c = Number(current);
  const b = Number(base);
  if (!isFinite(c) || !isFinite(b) || b === 0) return "0%";
  return (((c - b) / b) * 100).toFixed(2) + "%";
}

// --- Handle pending orders ---
async function handleOrders(symbol, ltp) {
  const pendingOrders = await OrderModel.find({
    symbol,
    status: "pending",
  }).sort({ createdAt: 1 });

  if (!pendingOrders.length) return;

  for (const order of pendingOrders) {
    const targetPrice = Number(order.price);
    const userId = order.user;

    const shouldBuy = order.mode === "BUY" && ltp <= targetPrice;
    const shouldSell = order.mode === "SELL" && ltp >= targetPrice;

    if (!(shouldBuy || shouldSell)) continue;

    // Execute order
    const updated = await OrderModel.findOneAndUpdate(
      { _id: order._id, status: "pending" },
      { status: "executed", executedAt: new Date(), executedPrice: ltp },
      { new: true }
    );

    if (!updated) continue;

    if (shouldBuy) {
      const cost = ltp * order.qty;
      const canBuy = await updateBalance(userId, -cost);
      if (!canBuy) {
        console.log(`❌ BUY failed for ${symbol}: insufficient balance`);
        continue;
      }
      await addToHoldings(userId, symbol, order.qty, ltp);
      console.log(`✅ BUY executed: ${symbol} @ ₹${ltp} | Cost: ₹${cost}`);
    } else {
      const gain = ltp * order.qty;
      await updateBalance(userId, gain);
      await reduceHoldings(userId, symbol, order.qty);
      console.log(`✅ SELL executed: ${symbol} @ ₹${ltp} | Gain: ₹${gain}`);
    }
  }
}

// --- Update balance ---
async function updateBalance(userId, amountChange) {
  const user = await User.findById(userId);
  if (!user) return false;

  if (typeof user.balance !== "number") user.balance = 1000000;

  if (amountChange < 0 && user.balance + amountChange < 0) return false; // insufficient funds

  user.balance += amountChange;
  await user.save();
  return true;
}

// --- Holdings ---
async function addToHoldings(userId, symbol, qty, price) {
  qty = Number(qty);
  price = Number(price);

  const live = livePrices[symbol] || {};
  const prevClose = isFinite(live.prevClose) ? live.prevClose : price;

  let holding = await Holding.findOne({ user: userId, stockName: symbol });

  if (holding) {
    const totalCost = holding.avg * holding.quantity + price * qty;
    const totalQty = holding.quantity + qty;

    holding.avg = totalCost / totalQty;
    holding.quantity = totalQty;
    holding.stockPrice = price;
    holding.net = calcPercentChange(price, holding.avg);
    holding.day = calcPercentChange(price, prevClose);

    await holding.save();
  } else {
    holding = await Holding.create({
      user: userId,
      stockName: symbol,
      quantity: qty,
      avg: price,
      stockPrice: price,
      net: "0.00%",
      day: calcPercentChange(price, prevClose),
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
