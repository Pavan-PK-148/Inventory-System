import Product from '../models/Product.js';
import AuditLog from '../models/AuditLog.js'; 
import { createNotification } from './notificationController.js'; // Wired live alerts

// @desc    Create new product entity
// @route   POST /api/products
// @access  Private (Admin/Manager)
export const createProduct = async (req, res, next) => {
  try {
    const { name, sku, category, price, quantity, supplier, warehouseLocation, barcode, minStockThreshold } = req.body;

    // Check if item SKU code is already allocated
    const productExists = await Product.findOne({ sku });
    if (productExists) {
      res.status(400);
      throw new Error('A product entity with this SKU identifier already exists.');
    }

    // Persist new schema mapping record to cloud collections
    const product = await Product.create({
      name,
      sku,
      category,
      price,
      quantity,
      supplier,
      warehouseLocation, 
      barcode,
      minStockThreshold: minStockThreshold || 10 // Dynamic fallback threshold safeguard
    });

    // Write accompanying creation record directly to the audit feed matrix
    await AuditLog.create({
      productName: product.name,
      operationType: 'creation',
      previousQuantity: 0,
      newQuantity: product.quantity,
      timestamp: new Date()
    });

    // Fire Live Notification Event
    await createNotification(
      req.user.id,
      'STOCK_IN',
      'New Product Indexed',
      `Asset "${product.name}" [SKU: ${product.sku}] has been safely onboarded into database nodes.`
    );

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all product catalog collections
// @route   GET /api/products
// @access  Private (Admin/Manager/Viewer)
export const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

// @desc    Adjust item quantities securely
// @route   PATCH /api/products/:id/adjust
// @access  Private (Admin/Manager)
export const adjustStock = async (req, res, next) => {
  try {
    const { quantityDelta, operation } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error('Target catalog asset not found.');
    }

    const previousQuantity = product.quantity;
    const changeAmount = Number(quantityDelta);

    // Calculate structural operational math matrix direction
    if (operation === 'inc') {
      product.quantity += changeAmount;
    } else if (operation === 'dec') {
      if (product.quantity - changeAmount < 0) {
        res.status(400);
        throw new Error('Insufficient operational stock volumes available to complete deduction.');
      }
      product.quantity -= changeAmount;
    } else {
      res.status(400);
      throw new Error('Invalid stock delta update instruction format specified.');
    }

    await product.save();

    // Create a historical log trace to catch mutations for Feature 6 conversions
    await AuditLog.create({
      productName: product.name,
      operationType: operation === 'inc' ? 'increment' : 'decrement',
      previousQuantity,
      newQuantity: product.quantity,
      timestamp: new Date()
    });

    // Trigger corresponding notification variant
    const alertType = operation === 'inc' ? 'STOCK_IN' : 'STOCK_OUT';
    const alertTitle = operation === 'inc' ? 'Stock Balance Inflow' : 'Stock Balance Deduction';
    const alertMessage = `Product "${product.name}" inventory adjusted by ${changeAmount} units. Current Balance: ${product.quantity}.`;

    await createNotification(req.user.id, alertType, alertTitle, alertMessage);

    // Dynamic threshold trigger calculation matrix check
    if (product.quantity <= (product.minStockThreshold || 10)) {
      await createNotification(
        req.user.id,
        'LOW_STOCK',
        'Critical Low Stock Alert',
        `Asset "${product.name}" has plummeted down to ${product.quantity} items, breaching safety parameters.`
      );
    }

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Remove explicit structural product rows
// @route   DELETE /api/products/:id
// @access  Private (Admin Only)
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error('Target asset already expunged or does not exist.');
    }

    await product.deleteOne();

    // Append standard terminal notification ledger mark
    await AuditLog.create({
      productName: product.name,
      operationType: 'deletion',
      previousQuantity: product.quantity,
      newQuantity: 0,
      timestamp: new Date()
    });

    // Trigger Systemic Audit Alert Notification
    await createNotification(
      req.user.id,
      'AUDIT_FLAG',
      'Catalog Asset Purged',
      `Product entry "${product.name}" has been permanently purged from core data arrays.`
    );

    res.status(200).json({ message: 'Product record successfully cleaned out.' });
  } catch (error) {
    next(error);
  }
};