import express from 'express';
import { getProducts, createProduct, adjustStock, deleteProduct } from '../controllers/productController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Publicly viewable internally, restriction applies strictly to modifications
router.route('/')
  .get(protect, getProducts)
  .post(protect, authorizeRoles('admin', 'manager'), createProduct);

// Access to updates restricted to managers and system administrators
router.patch('/:id/adjust', protect, authorizeRoles('admin', 'manager'), adjustStock);

// Hard data deletion restricted exclusively to top-tier Administrators
router.delete('/:id', protect, authorizeRoles('admin'), deleteProduct);

export default router;