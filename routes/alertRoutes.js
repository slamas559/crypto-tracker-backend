import express from "express";
import Alert from "../models/Alert.js";
import auth from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Get user alerts
router.get("/", auth, async (req, res) => {
  const alerts = await Alert.find({ user: req.userId }).sort({ createdAt: -1 });
  res.json(alerts);
});

// Add alert
router.post("/", auth, async (req, res) => {
  const { coinId, targetPrice, direction } = req.body;
  const alert = new Alert({ user: req.userId, coinId, targetPrice, direction });
  await alert.save();
  res.status(201).json(alert);
});

// Delete alert
router.delete("/:id", auth, async (req, res) => {
  await Alert.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

// POST /api/users/push-subscribe
router.post("/push-subscribe", protect, async (req, res) => {
  await User.findByIdAndUpdate(req.userId, {
    pushSubscription: req.body.subscription,
  });
  res.sendStatus(200);
});


export default router;
