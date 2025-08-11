const mongoose = require("mongoose")

const OrderSchema = new mongoose.Schema({
    name:{type:String},
    qty:{type:Number},
    price:{type:Number},
    mode:{type:String}
})

const OrderModel =  mongoose.model("order",OrderSchema)

module.exports = {OrderModel}
