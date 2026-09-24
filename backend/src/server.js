import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { seedDummyData } from './utils/seedData.js';

import authRoutes from './routes/authRoutes.js';
import cowRoutes from './routes/cowRoutes.js';
import vaccinationRoutes from './routes/vaccinationRoutes.js';
import healthEventRoutes from './routes/healthEventRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: true, // Allow requests from any origin in dev (e.g. localhost:5173)
  credentials: true
}));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/cows', cowRoutes);
app.use('/api/cows/:tagId/vaccinations', vaccinationRoutes);
app.use('/api/vaccinations', vaccinationRoutes);
app.use('/api/cows/:tagId/health-events', healthEventRoutes);
app.use('/api/cows/:tagId/ai-assistant', aiRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Cow Assistant Backend API active', timestamp: new Date() });
});

// Centralized Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start Express server
connectDB().then(async () => {
  await seedDummyData();
  app.listen(PORT, () => {
    console.log(`[Server] Cow Assistant Backend running on port ${PORT}`);
  });
});

export default app;
