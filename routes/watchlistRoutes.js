import express from "express";
import WatchLists from "../models/WatchLists.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/watchlist
router.get("/", auth, async (req, res) => {
  const coins = await WatchLists.find({ user: req.userId }).sort({ createdAt: -1 });
  res.json(coins);
});

// POST /api/watchlist
router.post("/", auth, async (req, res) => {
  const { coinId } = req.body;
  const entry = await WatchLists.create({ user: req.userId, coinId });
  res.status(201).json(entry);
});

// DELETE /api/watchlist/:coinId
router.delete("/:coinId", auth, async (req, res) => {
  await WatchLists.findOneAndDelete({ user: req.userId, coinId: req.params.coinId });
  res.sendStatus(204);
});

export default router;
