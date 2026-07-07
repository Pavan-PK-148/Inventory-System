import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  X,
  Loader2,
  ScanBarcode,
  AlertTriangle,
  Printer // 🖨️ New Lucide Icon Added
} from 'lucide-react';

import toast from 'react-hot-toast';

import DashboardLayout from '../components/DashboardLayout';
import PageTransition from '../components/PageTransition';
import BarcodeScannerModal from '../components/BarcodeScannerModal';
import API from '../api/axiosInstance';

// 🖨️ Hooking your new PDF Barcode Asset Component Logic Layer
import { generateAssetLabelPDF } from '../components/BarcodeLabelGenerator';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedWarehouse, setSelectedWarehouse] = useState('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const [editingProduct, setEditingProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'Electronics',
    price: '',
    quantity: '',
    supplier: '',
    warehouseLocation: 'Warehouse Alpha',
    barcode: ''
  });

  const fetchProducts = async () => {
    try {
      const response = await API.get('/products');
      setProducts(response.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Failed to fetch inventory catalog.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);

      setFormData({
        name: product.name,
        sku: product.sku,
        category: product.category,
        price: product.price,
        quantity: product.quantity,
        supplier: product.supplier || '',
        warehouseLocation:
          product.warehouseLocation || 'Warehouse Alpha',
        barcode: product.barcode || ''
      });
    } else {
      setEditingProduct(null);

      setFormData({
        name: '',
        sku: '',
        category: 'Electronics',
        price: '',
        quantity: '',
        supplier: '',
        warehouseLocation: 'Warehouse Alpha',
        barcode: ''
      });
    }

    setIsModalOpen(true);
  };

  // Safe Deletion with Action Toast Confirmation
  const confirmDelete = (id, productName) => {
    toast((t) => (
      <div className="flex flex-col gap-3 p-1">
        <div className="flex items-start gap-2.5">
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-500 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-slate-900">Confirm Deletion</p>
            <p className="text-xs text-slate-500 mt-0.5">
              Are you sure you want to completely remove <span className="font-semibold text-slate-700">"{productName}"</span>?
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-1">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              await executeDelete(id);
            }}
            className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 transition-colors shadow-sm cursor-pointer"
          >
            Delete Item
          </button>
        </div>
      </div>
    ), {
      duration: 6000,
      position: 'top-center',
      style: { minWidth: '320px', borderRadius: '16px', border: '1px solid #f1f5f9' }
    });
  };

  const executeDelete = async (id) => {
    try {
      await API.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success('Product deleted successfully.');
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Failed to delete product.'
      );
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.sku ||
      !formData.price ||
      String(formData.quantity) === ''
    ) {
      toast.error('Please fill all required fields.');
      return;
    }

    try {
      if (editingProduct) {
        const originalQty = editingProduct.quantity;
        const targetQty = Number(formData.quantity);
        const delta = Math.abs(targetQty - originalQty);
        const operation = targetQty >= originalQty ? 'inc' : 'dec';

        if (delta > 0) {
          await API.patch(
            `/products/${editingProduct._id}/adjust`,
            {
              quantityDelta: delta,
              operation
            }
          );
        }

        toast.success('Product configurations updated.');
      } else {
        await API.post('/products', formData);
        toast.success('New product added successfully.');
      }

      setIsModalOpen(false);
      fetchProducts();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Failed to save product.'
      );
    }
  };

  const handleBarcodeScanned = (scannedCode) => {
    if (isModalOpen) {
      setFormData((prev) => ({
        ...prev,
        barcode: scannedCode
      }));
      toast.success(`Barcode scanned: ${scannedCode}`);
    } else {
      setSearchTerm(scannedCode);
      toast.success(`Searching barcode: ${scannedCode}`);
    }
  };

  const filteredProducts = products.filter((p) => {
    const nameMatch = p.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const skuMatch = p.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    const barcodeMatch = p.barcode?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSearch = nameMatch || skuMatch || barcodeMatch;
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesWarehouse = selectedWarehouse === 'All' || p.warehouseLocation === selectedWarehouse;

    return matchesSearch && matchesCategory && matchesWarehouse;
  });

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-[70vh] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary-500" />
            <p className="text-sm font-medium text-slate-500">
              Loading inventory records...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageTransition>
        <div className="space-y-6">
          {/* HEADER */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900">
                Product Inventory Catalog
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Manage products, stock balances, warehouse allocation, and barcode tracking.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsScannerOpen(true)}
                className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300 cursor-pointer"
              >
                <ScanBarcode size={18} className="text-primary-500" />
                <span className="hidden sm:inline">Scan Barcode</span>
              </button>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleOpenModal()}
                className="flex items-center gap-2 rounded-2xl bg-primary-500 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-primary-500/10 transition-all hover:bg-primary-600 cursor-pointer"
              >
                <Plus size={18} />
                <span>Add Product</span>
              </motion.button>
            </div>
          </motion.div>

          {/* FILTERS */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Search by name, SKU, or barcode..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-12 py-3 text-sm outline-none transition-all focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/5"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 sm:flex">
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3">
                  <Filter size={16} className="text-slate-400" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-transparent text-sm font-medium text-slate-700 outline-none cursor-pointer"
                  >
                    <option value="All">All Categories</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Materials">Materials</option>
                  </select>
                </div>

                <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3">
                  <select
                    value={selectedWarehouse}
                    onChange={(e) => setSelectedWarehouse(e.target.value)}
                    className="bg-transparent text-sm font-medium text-slate-700 outline-none cursor-pointer"
                  >
                    <option value="All">All Warehouses</option>
                    <option value="Warehouse Alpha">Warehouse Alpha</option>
                    <option value="Warehouse Beta">Warehouse Beta</option>
                    <option value="Central Hub">Central Hub</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>

          {/* TABLE CONTAINER */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
          >
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-[0.18em] text-slate-500">
                    <th className="px-6 py-5 text-left font-bold">Product</th>
                    <th className="px-6 py-5 text-left font-bold">SKU</th>
                    <th className="px-6 py-5 text-left font-bold">Warehouse</th>
                    <th className="px-6 py-5 text-left font-bold">Category</th>
                    <th className="px-6 py-5 text-left font-bold">Price</th>
                    <th className="px-6 py-5 text-left font-bold">Quantity</th>
                    <th className="px-6 py-5 text-right font-bold">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-16 text-center text-slate-400">
                        No product entities found matching criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product, index) => (
                      <motion.tr
                        key={product._id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.02 }}
                        className="transition-all hover:bg-slate-50/80"
                      >
                        <td className="px-6 py-5">
                          <div>
                            <p className="font-semibold text-slate-900">
                              {product.name}
                            </p>
                            <p className="mt-1 text-[11px] font-mono tracking-wider text-slate-400">
                              {product.barcode || 'No Identifier Barcode'}
                            </p>
                          </div>
                        </td>

                        <td className="px-6 py-5 font-mono text-slate-600">
                          {product.sku}
                        </td>

                        <td className="px-6 py-5">
                          <span className="rounded-xl bg-primary-50/70 px-3 py-1.5 text-xs font-bold text-primary-700 border border-primary-100/30">
                            {product.warehouseLocation}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700">
                            {product.category}
                          </span>
                        </td>

                        <td className="px-6 py-5 font-semibold text-slate-800">
                          ${Number(product.price).toLocaleString()}
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                              product.quantity <= 5
                                ? 'bg-rose-50 text-rose-600 border border-rose-100/30'
                                : 'bg-emerald-50 text-emerald-600 border border-emerald-100/30'
                            }`}
                          >
                            {product.quantity} units
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex justify-end gap-1.5">
                            {/* 🖨️ NEW FEATURE-4 PRINT TAG ACTION BUTTON BUTTON */}
                            <button
                              onClick={() => generateAssetLabelPDF(product)}
                              className="rounded-xl p-2 text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-800 cursor-pointer"
                              title="Print Asset Tag Label"
                            >
                              <Printer size={16} />
                            </button>

                            <button
                              onClick={() => handleOpenModal(product)}
                              className="rounded-xl p-2 text-slate-400 transition-all hover:bg-primary-50 hover:text-primary-600 cursor-pointer"
                              title="Edit Product"
                            >
                              <Edit3 size={16} />
                            </button>

                            <button
                              onClick={() => confirmDelete(product._id, product.name)}
                              className="rounded-xl p-2 text-slate-400 transition-all hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
                              title="Delete Product"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* DYNAMIC FORM MODAL CONTAINER */}
          <AnimatePresence>
            {isModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
                {/* BACKDROP */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsModalOpen(false)}
                  className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
                />

                {/* MODAL WINDOW BODY */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.97, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97, y: 16 }}
                  transition={{ duration: 0.2 }}
                  className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[32px] bg-white p-8 md:p-10 shadow-2xl z-10 border border-slate-100"
                >
                  {/* HEADER */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                    <div>
                      <h2 className="text-[32px] font-black tracking-tight text-slate-900">
                        {editingProduct ? 'Modify Asset Levels' : 'Create Inventory Entry'}
                      </h2>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {editingProduct ? 'Update quantity constraints for this entity.' : 'Fill schema attributes to save data record.'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="rounded-full p-2 text-slate-400 transition-all hover:bg-slate-50 hover:text-slate-700 cursor-pointer"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  {/* FORM BODY */}
                  <form onSubmit={handleFormSubmit} className="mt-8 space-y-6">
                    <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
                      
                      {/* PRODUCT NAME */}
                      <div className="flex flex-col">
                        <label className="text-[12px] font-black uppercase tracking-[0.14em] text-slate-400">
                          Product Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          disabled={!!editingProduct}
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="mt-2 h-14 w-full rounded-2xl border border-slate-200 px-4 text-[16px] font-medium text-slate-700 outline-none transition-all focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 disabled:bg-slate-50 disabled:text-slate-400"
                          placeholder="e.g. Wireless Router Core"
                        />
                      </div>

                      {/* WAREHOUSE LOCATION */}
                      <div className="flex flex-col">
                        <label className="text-[12px] font-black uppercase tracking-[0.14em] text-slate-400">
                          Warehouse Location Assignment
                        </label>
                        <select
                          disabled={!!editingProduct}
                          value={formData.warehouseLocation}
                          onChange={(e) => setFormData({ ...formData, warehouseLocation: e.target.value })}
                          className="mt-2 h-14 w-full rounded-2xl border border-slate-200 px-4 text-[16px] font-medium text-slate-700 outline-none transition-all focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 disabled:bg-slate-50 disabled:text-slate-400 cursor-pointer"
                        >
                          <option value="Warehouse Alpha">Warehouse Alpha</option>
                          <option value="Warehouse Beta">Warehouse Beta</option>
                          <option value="Central Hub">Central Hub</option>
                        </select>
                      </div>

                      {/* SKU IDENTIFIER */}
                      <div className="flex flex-col">
                        <label className="text-[12px] font-black uppercase tracking-[0.14em] text-slate-400">
                          SKU Code Identifier <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          disabled={!!editingProduct}
                          value={formData.sku}
                          onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                          className="mt-2 h-14 w-full rounded-2xl border border-slate-200 px-4 text-[16px] font-medium text-slate-700 outline-none transition-all focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 disabled:bg-slate-50 disabled:text-slate-400 font-mono text-sm"
                          placeholder="SKU-ELEC-001"
                        />
                      </div>

                      {/* CATEGORY GROUP */}
                      <div className="flex flex-col">
                        <label className="text-[12px] font-black uppercase tracking-[0.14em] text-slate-400">
                          Category Group
                        </label>
                        <select
                          disabled={!!editingProduct}
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="mt-2 h-14 w-full rounded-2xl border border-slate-200 px-4 text-[16px] font-medium text-slate-700 outline-none transition-all focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 disabled:bg-slate-50 disabled:text-slate-400 cursor-pointer"
                        >
                          <option value="Electronics">Electronics</option>
                          <option value="Furniture">Furniture</option>
                          <option value="Materials">Materials</option>
                        </select>
                      </div>

                      {/* UNIT COST */}
                      <div className="flex flex-col">
                        <label className="text-[12px] font-black uppercase tracking-[0.14em] text-slate-400">
                          Unit Cost ($) <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          disabled={!!editingProduct}
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          className="mt-2 h-14 w-full rounded-2xl border border-slate-200 px-4 text-[16px] font-medium text-slate-700 outline-none transition-all focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 disabled:bg-slate-50 disabled:text-slate-400"
                          placeholder="0.00"
                        />
                      </div>

                      {/* QUANTITY CONSTRAINTS */}
                      <div className="flex flex-col">
                        <label className="text-[12px] font-black uppercase tracking-[0.14em] text-slate-400">
                          {editingProduct ? 'Adjust Stock Target' : 'Initial Stock Volume'} <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="number"
                          value={formData.quantity}
                          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                          className="mt-2 h-14 w-full rounded-2xl border border-slate-200 px-4 text-[16px] font-medium text-slate-700 outline-none transition-all focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5"
                          placeholder="0"
                        />
                      </div>

                      {/* SUPPLIER PARTNER */}
                      <div className="flex flex-col">
                        <label className="text-[12px] font-black uppercase tracking-[0.14em] text-slate-400">
                          Assigned Supplier Partner
                        </label>
                        <input
                          type="text"
                          disabled={!!editingProduct}
                          value={formData.supplier}
                          onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                          className="mt-2 h-14 w-full rounded-2xl border border-slate-200 px-4 text-[16px] font-medium text-slate-700 outline-none transition-all focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 disabled:bg-slate-50 disabled:text-slate-400"
                          placeholder="Supplier Company Name"
                        />
                      </div>

                      {/* BARCODE SIGNATURE */}
                      <div className="flex flex-col">
                        <div className="flex items-center justify-between">
                          <label className="text-[12px] font-black uppercase tracking-[0.14em] text-slate-400">
                            Barcode Signature Identity
                          </label>
                          {!editingProduct && (
                            <button
                              type="button"
                              onClick={() => setIsScannerOpen(true)}
                              className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-primary-500 hover:text-primary-600 transition-colors cursor-pointer"
                            >
                              <ScanBarcode size={12} />
                              <span>Launch Lens</span>
                            </button>
                          )}
                        </div>
                        <input
                          type="text"
                          disabled={!!editingProduct}
                          value={formData.barcode}
                          onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                          className="mt-2 h-14 w-full rounded-2xl border border-slate-200 px-4 text-[16px] font-medium text-slate-700 outline-none transition-all focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 disabled:bg-slate-50 disabled:text-slate-400 font-mono"
                          placeholder="No code mapped"
                        />
                      </div>

                    </div>

                    {/* MODAL CONTROLS FOOTER */}
                    <div className="mt-8 flex justify-end gap-3 border-t border-slate-100 pt-6">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="h-12 rounded-xl border border-slate-200 px-6 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="h-12 rounded-xl bg-emerald-500 px-6 text-sm font-bold text-slate-900 shadow-md shadow-emerald-500/10 transition-colors hover:bg-emerald-600 hover:text-white cursor-pointer"
                      >
                        Save Configurations
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* BARCODE ENGINE ATTACHMENT */}
          <BarcodeScannerModal
            isOpen={isScannerOpen}
            onClose={() => setIsScannerOpen(false)}
            onScanSuccess={handleBarcodeScanned}
          />
        </div>
      </PageTransition>
    </DashboardLayout>
  );
};

export default Products;