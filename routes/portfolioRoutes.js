import express from "express";
import { Router } from "express";
import protect from "../middleware/authMiddleware.js";
import {
  getPortfolio,
  addToPortfolio,
  updatePortfolioItem,
  deletePortfolioItem,
} from "../controllers/portfolioController.js";

const router = Router();

router.use(protect);

router.get("/", getPortfolio);
router.post("/", addToPortfolio);
router.put("/:id", updatePortfolioItem);
router.delete("/:id", deletePortfolioItem);

export default router;
