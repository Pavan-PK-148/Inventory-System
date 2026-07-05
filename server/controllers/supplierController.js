import Supplier from '../models/Supplier.js';
import { createNotification } from './notificationController.js'; // Added alerts

// @desc    Get all registered suppliers
// @route   GET /api/suppliers
export const getSuppliers = async (req, res, next) => {
  try {
    const suppliers = await Supplier.find({}).sort({ createdAt: -1 });
    res.status(200).json(suppliers);
  } catch (error) {
    next(error);
  }
};

// @desc    Register a new supplier profile
// @route   POST /api/suppliers
export const createSupplier = async (req, res, next) => {
  const { name, email, phone, address } = req.body;
  try {
    const supplierExists = await Supplier.findOne({ name });
    if (supplierExists) {
      res.status(400);
      return next(new Error('A supplier entry already exists with that entity name.'));
    }

    const supplier = await Supplier.create({ name, email, phone, address });
    
    // Broadcast live telemetry activity alert log
    await createNotification(
      req.user.id,
      'SYSTEM_ALERT',
      'Supplier Node Added',
      `Supplier profile "${supplier.name}" has been authorized and registered globally.`
    );

    res.status(201).json(supplier);
  } catch (error) {
    next(error);
  }
};

// @desc    Remove explicit supplier partner profiles
// @route   DELETE /api/suppliers/:id
export const deleteSupplier = async (req, res, next) => {
  try {
    const supplier = await Supplier.findById(req.params.id);

    if (!supplier) {
      res.status(404);
      return next(new Error('Target profile could not be verified or does not exist.'));
    }

    const supplierName = supplier.name;
    await supplier.deleteOne();

    // Broadcast warning system notification
    await createNotification(
      req.user.id,
      'AUDIT_FLAG',
      'Supplier Profile De-linked',
      `Vendor contract for "${supplierName}" has been broken and stripped from database indexes.`
    );

    res.status(200).json({ message: 'Supplier profile securely unlinked.' });
  } catch (error) {
    next(error);
  }
};