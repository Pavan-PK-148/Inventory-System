import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Mail,
  Phone,
  MapPin,
  X,
  UserCheck,
  Trash2,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/DashboardLayout';
import PageTransition from '../components/PageTransition';
import API from '../api/axiosInstance';

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const fetchSuppliers = async () => {
    try {
      const response = await API.get('/suppliers');
      setSuppliers(response.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Failed to load suppliers.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.address
    ) {
      toast.error('Please complete all fields.');
      return;
    }

    try {
      const response = await API.post('/suppliers', formData);

      // Add newly registered supplier to state layout stream
      setSuppliers([response.data, ...suppliers]);
      toast.success('Supplier partner registered successfully.');

      setFormData({
        name: '',
        email: '',
        phone: '',
        address: ''
      });

      setIsModalOpen(false);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Failed to register supplier.'
      );
    }
  };

  // Safe Deletion with Action Toast Confirmation Linking Your API Route
  const confirmDelete = (id, supplierName) => {
    toast((t) => (
      <div className="flex flex-col gap-3 p-1">
        <div className="flex items-start gap-2.5">
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-500 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-slate-900">Remove Supplier?</p>
            <p className="text-xs text-slate-500 mt-0.5">
              Are you sure you want to completely remove <span className="font-semibold text-slate-700">"{supplierName}"</span> from your network?
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
            Confirm
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
      // Connects directly to the delete endpoint route sequence
      await API.delete(`/suppliers/${id}`);
      setSuppliers(suppliers.filter((s) => s._id !== id));
      toast.success('Supplier removed successfully.');
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Failed to delete supplier partner.'
      );
    }
  };

  const filteredSuppliers = suppliers.filter((s) =>
    s.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-[70vh] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
            <p className="text-sm font-medium text-slate-500">
              Loading supplier networks...
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
          {/* HEADER SECTION */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900">
                Supplier Logistics Directory
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Manage vendor networks and supplier partnerships.
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-bold text-slate-900 shadow-md shadow-emerald-500/10 transition-all hover:bg-emerald-600 hover:text-white cursor-pointer"
            >
              <Plus size={18} />
              <span>Add Supplier</span>
            </motion.button>
          </motion.div>

          {/* SEARCH COMPONENT */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md rounded-3xl border border-slate-200 bg-white p-3 shadow-sm"
          >
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search suppliers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 py-3 pl-12 pr-4 text-sm outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/5"
              />
            </div>
          </motion.div>

          {/* GRID MATRIX CARDS DECK LAYOUT */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {filteredSuppliers.length === 0 ? (
                <div className="col-span-full py-16 text-center text-slate-400 text-sm font-medium bg-white rounded-3xl border border-slate-200">
                  No supplier entities found in directory.
                </div>
              ) : (
                filteredSuppliers.map((supplier, index) => (
                  <motion.div
                    key={supplier._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: index * 0.03 }}
                    whileHover={{ y: -3 }}
                    className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100/40">
                        <UserCheck size={20} />
                      </div>

                      <button
                        onClick={() => confirmDelete(supplier._id, supplier.name)}
                        className="rounded-xl p-2 text-slate-400 transition-all hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
                        title="Remove Partner"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <h3 className="mt-4 text-lg font-black text-slate-900 tracking-tight">
                      {supplier.name}
                    </h3>

                    <div className="mt-5 space-y-3.5">
                      <div className="flex items-center gap-3 text-sm text-slate-600">
                        <Mail size={15} className="text-emerald-600 shrink-0" />
                        <span className="truncate font-medium">{supplier.email}</span>
                      </div>

                      <div className="flex items-center gap-3 text-sm text-slate-600">
                        <Phone size={15} className="text-emerald-600 shrink-0" />
                        <span className="font-medium">{supplier.phone}</span>
                      </div>

                      <div className="flex items-start gap-3 text-sm text-slate-600">
                        <MapPin size={15} className="mt-0.5 text-emerald-600 shrink-0" />
                        <span className="line-clamp-2 font-medium">{supplier.address}</span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          {/* VENDOR REGISTRATION MODAL */}
          <AnimatePresence>
            {isModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* BACKDROP */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsModalOpen(false)}
                  className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
                />

                {/* MODAL FRAME Container */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.97, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97, y: 16 }}
                  transition={{ duration: 0.2 }}
                  className="relative w-full max-w-xl rounded-[32px] bg-white p-8 shadow-2xl z-10 border border-slate-100"
                >
                  {/* HEADER */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                    <div>
                      <h2 className="text-[26px] font-black tracking-tight text-slate-900">
                        Register Vendor Partner
                      </h2>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Establish catalog links for a new corporate entity resource.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="rounded-full p-2 text-slate-400 transition-all hover:bg-slate-50 hover:text-slate-700 cursor-pointer"
                    >
                      <X size={22} />
                    </button>
                  </div>

                  {/* FORM BODY */}
                  <form onSubmit={handleFormSubmit} className="mt-6 space-y-5">
                    
                    {/* VENDOR ENTITY NAME */}
                    <div className="flex flex-col">
                      <label className="text-[12px] font-black uppercase tracking-[0.14em] text-slate-400">
                        Vendor Entity Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="mt-2 h-14 w-full rounded-2xl border border-slate-200 px-4 text-[16px] font-medium text-slate-700 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5"
                        placeholder="e.g. Acme Logistics Global"
                      />
                    </div>

                    {/* CONTACT EMAIL */}
                    <div className="flex flex-col">
                      <label className="text-[12px] font-black uppercase tracking-[0.14em] text-slate-400">
                        Contact Email <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="mt-2 h-14 w-full rounded-2xl border border-slate-200 px-4 text-[16px] font-medium text-slate-700 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5"
                        placeholder="logistics@acme.com"
                      />
                    </div>

                    {/* PHONE NUMBER */}
                    <div className="flex flex-col">
                      <label className="text-[12px] font-black uppercase tracking-[0.14em] text-slate-400">
                        Phone Number <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="mt-2 h-14 w-full rounded-2xl border border-slate-200 px-4 text-[16px] font-medium text-slate-700 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5"
                        placeholder="+1 (555) 019-2834"
                      />
                    </div>

                    {/* HEADQUARTERS ADDRESS */}
                    <div className="flex flex-col">
                      <label className="text-[12px] font-black uppercase tracking-[0.14em] text-slate-400">
                        Headquarters Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="mt-2 h-14 w-full rounded-2xl border border-slate-200 px-4 text-[16px] font-medium text-slate-700 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5"
                        placeholder="Industrial Way Blvd, Suite 400"
                      />
                    </div>

                    {/* FOOTER ACTIONS */}
                    <div className="mt-8 flex justify-end gap-3 border-t border-slate-100 pt-5">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="h-12 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="h-12 rounded-xl bg-emerald-500 px-5 text-sm font-bold text-slate-900 shadow-md shadow-emerald-500/10 transition-colors hover:bg-emerald-600 hover:text-white cursor-pointer"
                      >
                        Register Supplier
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </PageTransition>
    </DashboardLayout>
  );
};

export default Suppliers;