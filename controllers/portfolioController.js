import PortfolioItem from "../models/PortfolioItems.js";
import axios from "axios"

// GET /portfolio
export const getPortfolio = async (req, res) => {
  const userId = req.userId;
  const items = await PortfolioItem.find({ user: userId }).sort({ createdAt: -1 });
  res.json(items);
};

// POST /portfolio
export const addToPortfolio = async (req, res) => {
  const { coinId, amount } = req.body;
  const userId = req.userId;

  if (!coinId || !amount) {
    return res.status(400).json({ msg: "coinId and amount are required" });
  }

  const existing = await PortfolioItem.findOne({ user: userId, coinId });
  if (existing) return res.status(400).json({ msg: "Coin already exists" });

  const cgRes = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId.toLowerCase()}`);
    if (!cgRes?.data?.id) {
      return res.status(404).json({ msg: "Coin not found on CoinGecko" });
    }
  const newItem = await PortfolioItem.create({ user: userId, coinId, amount });
  res.status(201).json(newItem);
};

// PUT /portfolio/:id
export const updatePortfolioItem = async (req, res) => {
  const { amount } = req.body;
  const updated = await PortfolioItem.findByIdAndUpdate(req.params.id, { amount }, { new: true });
  res.json(updated);
};

// DELETE /portfolio/:id
export const deletePortfolioItem = async (req, res) => {
  await PortfolioItem.findByIdAndDelete(req.params.id);
  res.json({ msg: "Deleted" });
};
