import express from 'express';
import { createServer } from 'http'; // Required to attach Socket.io alongside Express
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import { errorHandler } from './middleware/errorMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import supplierRoutes from './routes/supplierRoutes.js';
import logRoutes from './routes/logRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js'; // Imported notification lines
import { initSocket } from './socket.js'; // Imported socket initializer

// Initialize context environments
dotenv.config();

// Initialize Database connection instance
connectDB();

const app = express();
const httpServer = createServer(app); // Wrapped Express app in HTTP Server

// Initialize WebSockets matrix
initSocket(httpServer);

// Modern Dynamic CORS configuration setup using env variables
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', 
  credentials: true
}));

app.use(express.json());

// Base Health Validation Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'active', timestamp: new Date() });
});

// Structural Routing Architecture Links
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notificationRoutes); // Attached secure notification endpoints

// Fallback Global Error Parsing Interceptor Pipeline
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

// Listen via httpServer instead of app.listen so WebSockets and API requests share the port
httpServer.listen(PORT, () => {
  console.log(`[Server] Live Inventory Engine running securely with WebSocket streams on port ${PORT}`);
});