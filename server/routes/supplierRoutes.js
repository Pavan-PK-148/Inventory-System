import express from 'express';
import { getSuppliers, createSupplier,deleteSupplier } from '../controllers/supplierController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getSuppliers)
  .post(protect, createSupplier);

router.route('/:id')
  .delete(protect, deleteSupplier);

export default router;