import AuditLog from '../models/AuditLog.js';

// @desc    Retrieve historical systemic inventory log streams
// @route   GET /api/logs
export const getAuditLogs = async (req, res, next) => {
  try {
    const logs = await AuditLog.find({}).sort({ timestamp: -1 });
    res.status(200).json(logs);
  } catch (error) {
    next(error);
  }
};