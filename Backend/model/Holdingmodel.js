const mongoose = require('mongoose')
const holdingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    stockName: { type: String, required: true },
    quantity: { type: Number, required: true },
    avg:{type:Number},
    stockPrice: { type: Number, required: true },
    net:{type:String},
    day:{type:String}
});

const Holding = mongoose.model("holding", holdingSchema);
module.exports = Holding;
