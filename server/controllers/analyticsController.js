import Product from '../models/Product.js';
import Supplier from '../models/Supplier.js';

// @desc    Retrieve aggregated system dashboard metrics
// @route   GET /api/analytics/dashboard
export const getDashboardAnalytics = async (req, res, next) => {
  try {
    // Run independent pipeline lookups in parallel for high performance
    const [products, totalSuppliers] = await Promise.all([
      Product.find({}),
      Supplier.countDocuments({})
    ]);

    const totalProducts = products.length;
    
    // Calculate total on-hand equity value using an array reduce loop
    const totalStockValue = products.reduce((acc, current) => {
      return acc + (current.price * current.quantity);
    }, 0);

    // Identify low-stock items (quantity less than 5 units)
    const lowStockItems = products.filter(product => product.quantity <= 5);
    const lowStockAlertsCount = lowStockItems.length;

    res.status(200).json({
      summary: {
        totalProducts,
        totalSuppliers,
        totalStockValue,
        lowStockAlertsCount
      },
      criticalItems: lowStockItems.map(item => ({
        name: item.name,
        sku: item.sku,
        stock: item.quantity,
        status: 'Critical'
      }))
    });
  } catch (error) {
    next(error);
  }
};