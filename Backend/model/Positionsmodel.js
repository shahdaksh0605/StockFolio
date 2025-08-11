const mongoose = require("mongoose")

const PositionSchema = new mongoose.Schema({
    product:{type:String},
    name:{type:String},
    qty:{type:Number},
    avg:{type:Number},
    price:{type:Number},
    net:{type:String},
    day:{type:String},
    isLoss:{type:Boolean},
})

const PositionModel =  mongoose.model("position",PositionSchema)

module.exports = {PositionModel}