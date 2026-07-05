import Notification from '../models/Notification.js'; // Note the explicit .js extension for ES modules
import { sendLiveNotification } from '../socket.js';

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving logs.' });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user.id, isRead: false },
      { $set: { isRead: true } }
    );
    res.json({ message: 'All logs verified.' });
  } catch (error) {
    res.status(500).json({ message: 'Update execution error.' });
  }
};

export const createNotification = async (userId, type, title, message) => {
  try {
    const notification = await Notification.create({
      recipient: userId,
      type,
      title,
      message
    });
    
    sendLiveNotification(userId, notification);
    return notification;
  } catch (error) {
    console.error('Failed to register systemic notification', error);
  }
};