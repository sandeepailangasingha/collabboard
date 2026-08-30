import express from 'express';
import cors from 'cors';
import { PORT } from './config/env.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Status Root Endpoint
app.get('/api', (req, res) => {
  res.json({
    status: 'online',
    app: 'SyncBoard / CollabBoard Express REST API',
    version: '2.0.0 (Assignment 02)',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'API Endpoint Not Found' });
});

app.listen(PORT, () => {
  console.log(`================================================`);
  console.log(`🚀 SyncBoard REST API Server running on port ${PORT}`);
  console.log(`👉 Status check: http://localhost:${PORT}/api`);
  console.log(`================================================`);
});
