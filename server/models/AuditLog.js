import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    previousQuantity: {
      type: Number,
      required: true,
    },
    newQuantity: {
      type: Number,
      required: true,
    },
    operationType: {
      type: String,
      enum: ['increment', 'decrement', 'creation', 'deletion'],
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: false }
);

const AuditLog = mongoose.model('AuditLog', auditLogSchema);
export default AuditLog;