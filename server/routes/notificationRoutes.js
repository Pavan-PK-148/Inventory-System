import express from 'express';
import { getNotifications, markAllAsRead } from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js'; // Swap out with your actual auth protection middleware name

const router = express.Router();

router.use(protect); // Secures all notification routes
router.get('/', getNotifications);
router.post('/mark-all', markAllAsRead);

export default router;