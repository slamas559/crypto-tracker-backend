import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js';
import alertRoutes from './routes/alertRoutes.js';
import watchlistRoutes from './routes/watchlistRoutes.js';


dotenv.config();
connectDB();

import './config/alertChecker.js';

const app = express();
app.use(cors());
app.use(express.json(
  {
    origin: "*", // Replace with actual Vercel domain
    credentials: true
  }
));


app.use('/api/auth', authRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/watchlist', watchlistRoutes);

app.get("/api/test", (req, res) => {
  res.json({ message: "Server running on Vercel!" });
});

// Simple health check
app.get('/', (req, res) => res.send('Crypto Tracker API Running'));

// Connect DB and start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

