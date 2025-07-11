import mongoose from "mongoose";

const alertSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  coinId: { type: String, required: true },
  targetPrice: { type: Number, required: true },
  direction: { type: String, enum: ["above", "below"], default: "above" },
  triggered: { type: Boolean, default: false },
},{ timestamps: true });

export default mongoose.model("Alert", alertSchema);
