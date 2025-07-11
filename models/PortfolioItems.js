import mongoose from "mongoose";

const portfolioItemSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  coinId: { type: String, required: true }, // e.g., "bitcoin"
  amount: { type: Number, required: true },
}, { timestamps: true });

const PortfolioItem = mongoose.model("PortfolioItem", portfolioItemSchema);

export default PortfolioItem;
