import express from 'express';
import { getDashboardAnalytics } from '../controllers/analyticsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Secure backend aggregation endpoint with our protection gateway
router.get('/dashboard', protect, getDashboardAnalytics);

export default router;