import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import connectDB from './config/db.js';
import { PORT } from './config/env.js';
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

const app = express();
const server = http.createServer(app);

// Connect to MongoDB Atlas
connectDB();

// Initialize Socket.io with CORS
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

// Attach io to express app so controllers can access it via req.app.get('io')
app.set('io', io);

// Socket.io Connection & Room Logic
io.on('connection', (socket) => {
  console.log(`[Socket.io] Real-time client connected: ${socket.id}`);

  socket.on('join_project', (projectId) => {
    socket.join(`project_${projectId}`);
    console.log(`[Socket.io] Client ${socket.id} joined room project_${projectId}`);
  });

  socket.on('leave_project', (projectId) => {
    socket.leave(`project_${projectId}`);
    console.log(`[Socket.io] Client ${socket.id} left room project_${projectId}`);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.io] Real-time client disconnected: ${socket.id}`);
  });
});

// Middleware
app.use(cors());
app.use(express.json());

// API Status Root
app.get('/api', (req, res) => {
  res.json({
    status: 'online',
    app: 'SyncBoard / CollabBoard Express REST API with Real-Time WebSockets',
    version: '3.1.0 (Session 5 - Real-Time, DevOps & Launch)',
    realtime: 'Socket.io active',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'API Endpoint Not Found' });
});

server.listen(PORT, () => {
  console.log(`================================================`);
  console.log(`SyncBoard REST API & Socket.io running on port ${PORT}`);
  console.log(`Status check: http://localhost:${PORT}/api`);
  console.log(`Real-Time Engine: Socket.io Active`);
  console.log(`================================================`);
});

export { app, server, io };
