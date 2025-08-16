const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    symbol: { type: String, required: true },
    category: { type: String, enum: ["prediction"], required: true },
    decision: { type: String, enum: ["fall", "neutral_or_rise"], required: true },
    now: Number,
    predicted: Number,
    predicted_change_pct: Number,
    threshold_pct: Number,
    read: { type: Boolean, default: false },
    raw: { type: Object },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Alert", alertSchema);
