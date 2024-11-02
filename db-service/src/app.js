import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import { ACTIONS_CORS_HEADERS } from '@solana/actions';
import connectDB from './utils/mongo.js';
import productRoutes from './routes/productRoutes.js';
import blinkRoutes from './routes/blinkRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static('public'));

// Apply CORS headers middleware
app.use((req, res, next) => {
  console.log('Request URL:', req.originalUrl);
  Object.entries(ACTIONS_CORS_HEADERS).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
  if (req.method === 'OPTIONS') {
    // Send 204 for preflight requests
    return res.sendStatus(204);
  }
  next();
});

connectDB();

app.use('/api/products', productRoutes);
app.use('/api/blinks', blinkRoutes);

export default app;