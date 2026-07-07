import mongoose from 'mongoose';

const WarehouseSectionSchema = new mongoose.Schema({
  sectionId: { type: String, required: true }, // e.g., "A1", "B4"
  stockLevel: { type: Number, required: true, default: 0 },
  activity: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'LOW' },
  temperature: { type: Number, default: 20 },
  utilization: { type: Number, default: 0 } // Percentage 0 - 100
});

const WarehouseSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  sections: [WarehouseSectionSchema]
}, { timestamps: true });

const Warehouse = mongoose.model('Warehouse', WarehouseSchema);
export default Warehouse;