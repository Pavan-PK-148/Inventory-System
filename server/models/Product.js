import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product designation name required.'],
      trim: true,
    },
    sku: {
      type: String,
      required: [true, 'Unique SKU code identifier required.'],
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category classification required.'],
      enum: ['Electronics', 'Furniture', 'Materials'],
    },
    price: {
      type: Number,
      required: [true, 'Unit cost valuation required.'],
      min: [0, 'Cost valuation cannot be less than zero.'],
    },
    quantity: {
      type: Number,
      required: [true, 'Stock volume capacity definition required.'],
      min: [0, 'Stock volume capacity cannot be less than zero.'],
      default: 0,
    },
    supplier: {
      type: String,
      required: [true, 'Supplier entity association identity required.'],
      trim: true,
    },
    // Feature 2: Multi-Warehouse Segment Location Support
    warehouseLocation: {
      type: String,
      required: [true, 'Please declare a target warehouse sector location.'],
      enum: ['Warehouse Alpha', 'Warehouse Beta', 'Central Hub'],
      default: 'Warehouse Alpha'
    },
    // Feature 5: Structural Barcode Reference Tracking String
    barcode: {
      type: String,
      unique: true,
      sparse: true // Protects indexing errors when barcode generation is empty or null
    }
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);
export default Product;