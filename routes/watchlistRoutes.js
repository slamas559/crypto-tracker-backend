import express from "express";
import Watchlist from "../models/Watchlists.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/watchlist
router.get("/", auth, async (req, res) => {
  const coins = await Watchlist.find({ user: req.userId }).sort({ createdAt: -1 });
  res.json(coins);
});

// POST /api/watchlist
router.post("/", auth, async (req, res) => {
  const { coinId } = req.body;
  const entry = await Watchlist.create({ user: req.userId, coinId });
  res.status(201).json(entry);
});

// DELETE /api/watchlist/:coinId
router.delete("/:coinId", auth, async (req, res) => {
  await Watchlist.findOneAndDelete({ user: req.userId, coinId: req.params.coinId });
  res.sendStatus(204);
});

export default router;
