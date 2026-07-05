import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Supplier corporate entity name required.'],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Vendor point-of-contact email address required.'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Direct telephone communication line required.'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Corporate corporate headquarters address required.'],
      trim: true,
    },
  },
  { timestamps: true }
);

const Supplier = mongoose.model('Supplier', supplierSchema);
export default Supplier;