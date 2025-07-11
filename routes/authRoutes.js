import express from 'express';
import { Router } from 'express';
import protect from '../middleware/authMiddleware.js';
import User from '../models/User.js';
import { registerUser, loginUser } from '../controllers/authController.js';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get("/me", protect, async (req, res) => {
  const user = await User.findById(req.userId).select("-password");
  res.json(user);
});



export default router;
