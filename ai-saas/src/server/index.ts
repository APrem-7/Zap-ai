import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { redis } from '@/lib/redis';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(
  cors({
    origin: 'http://localhost:3000', // your frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);
app.use(express.json());

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});
// Add after the health check
app.get('/test-cache', async (req, res) => {
  try {
    const cacheKey = 'test:key';
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      console.log('🎯 Test Cache HIT');
      return res.json({ message: 'Cache HIT', data: cachedData });
    }

    console.log('❌ Test Cache MISS');
    const testData = {
      timestamp: new Date().toISOString(),
      random: Math.random(),
    };

    await redis.set(cacheKey, testData, 60);
    console.log('💾 Test Cache SET');

    res.json({ message: 'Cache MISS', data: testData });
  } catch (error) {
    console.error('Test cache error:', error);
    res.status(500).json({ error: 'Cache test failed' });
  }
});
// Agents Route
import agentsRouter from './routes/agents';

app.use('/agents', agentsRouter);

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Express server running on http://localhost:${PORT}`);
});
