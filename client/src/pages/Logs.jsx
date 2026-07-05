import React, { useState, useEffect } from 'react';
import { RefreshCw, Plus, Minus, ArrowUpRight, ArrowDownLeft, Loader2, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';
import DashboardLayout from '../components/DashboardLayout';
import PageTransition from '../components/PageTransition';
import API from '../api/axiosInstance';
import { motion } from 'framer-motion';

const Logs = () => {
  const [stockControl, setStockControl] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingLogs, setLoadingLogs] = useState(true);

  const fetchProducts = async () => {
    try {
      const response = await API.get('/products');
      setStockControl(response.data);
    } catch (error) {
      toast.error('Failed to sync master operational balances.');
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const response = await API.get('/logs');
      setAuditLogs(response.data);
    } catch (error) {
      toast.error('Failed to parse database system logs.');
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchAuditLogs();
  }, []);

  const handleStockAdjustment = async (productId, deltaAmount, operationDirection) => {
    try {
      await API.patch(`/products/${productId}/adjust`, {
        quantityDelta: deltaAmount,
        operation: operationDirection
      });

      toast.success(`Inventory balance adjusted successfully.`);
      fetchProducts();
      fetchAuditLogs();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Transaction submission rejected.');
    }
  };

  // Feature 6: Local Excel sheet compiler for audit logs
  const exportLogsToExcel = () => {
    if (auditLogs.length === 0) {
      toast.error('No audit logging data history found to convert.');
      return;
    }

    const flatLogs = auditLogs.map(log => ({
      'Product Name': log.productName,
      'Operation Type': log.operationType,
      'Previous Balance': log.previousQuantity,
      'New Balance': log.newQuantity,
      'Timestamp': new Date(log.timestamp || log.createdAt).toLocaleString()
    }));

    const worksheet = XLSX.utils.json_to_sheet(flatLogs);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'System Audit Logs');
    
    XLSX.writeFile(workbook, `stockflow_audit_report_${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success('System audit log sheet processed successfully.');
  };

  const isDataLoading = loadingProducts || loadingLogs;

  if (isDataLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
            <p className="text-xs font-medium text-slate-400">Compiling unified transactional ledgers...</p>
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
                Stock Delta & Audit Logs
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Real-time inventory balance tracking and operational ledger history.
              </p>
            </div>

            <button
              onClick={exportLogsToExcel}
              className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300 cursor-pointer"
            >
              <Download size={16} className="text-emerald-500" />
              <span>Export Audit Sheet</span>
            </button>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* STOCK CONTROL */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  Rapid Modification Deck
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Instant inventory adjustments.
                </p>
              </div>

              <div className="mt-5 space-y-4 max-h-[68vh] overflow-y-auto pr-1 scrollbar-thin">
                {stockControl.length === 0 ? (
                  <p className="text-sm text-slate-400 py-4 text-center">No catalog items available.</p>
                ) : (
                  stockControl.map((item, index) => (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02 }}
                      whileHover={{ y: -2 }}
                      className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5 transition-all hover:shadow-sm"
                    >
                      <div className="flex items-start justify-between">
                        <div className="max-w-[70%]">
                          <h4 className="font-bold text-slate-900 truncate">
                            {item.name}
                          </h4>
                          <p className="mt-1 text-xs text-slate-400">
                            {item.warehouseLocation}
                          </p>
                        </div>
                        <span className="rounded-xl bg-primary-50 px-3 py-1 text-[11px] font-bold text-primary-700 shrink-0 border border-primary-100/30">
                          {item.quantity} Units
                        </span>
                      </div>

                      <div className="mt-5 flex gap-3">
                        <button
                          onClick={() => handleStockAdjustment(item._id, 1, 'dec')}
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-700 transition-all hover:border-rose-200 hover:bg-rose-50/50 hover:text-rose-600 cursor-pointer"
                        >
                          <Minus size={14} />
                          <span>Deduct</span>
                        </button>

                        <button
                          onClick={() => handleStockAdjustment(item._id, 1, 'inc')}
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-700 transition-all hover:border-emerald-200 hover:bg-emerald-50/50 hover:text-emerald-600 cursor-pointer"
                        >
                          <Plus size={14} />
                          <span>Receive</span>
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>

            {/* AUDIT TABLE */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="flex items-center gap-2 text-lg font-black text-slate-900 tracking-tight">
                    <RefreshCw size={18} className="text-primary-500" />
                    Historical Tracking Ledger
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    System generated audit history.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setLoadingLogs(true);
                    fetchAuditLogs();
                  }}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition-all hover:bg-slate-50 hover:border-slate-300 cursor-pointer"
                >
                  Refresh
                </button>
              </div>

              <div className="mt-6 overflow-hidden rounded-3xl border border-slate-100">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-[0.16em] text-slate-500">
                        <th className="px-6 py-5 text-left font-bold">Product</th>
                        <th className="px-6 py-5 text-left font-bold">Operation</th>
                        <th className="px-6 py-5 text-left font-bold">Previous</th>
                        <th className="px-6 py-5 text-left font-bold">Updated</th>
                        <th className="px-6 py-5 text-right font-bold">Timestamp</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 text-sm">
                      {auditLogs.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="px-6 py-16 text-center text-slate-400">
                            No audit logs found in the ledger database.
                          </td>
                        </tr>
                      ) : (
                        auditLogs.map((log, index) => (
                          <motion.tr
                            key={log._id}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.02 }}
                            className="transition-all hover:bg-slate-50/80 cursor-default"
                          >
                            <td className="px-6 py-5 font-semibold text-slate-900">
                              {log.productName}
                            </td>

                            <td className="px-6 py-5">
                              <span
                                className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold uppercase border ${
                                  log.operationType === 'creation' || log.operationType === 'increment'
                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100/30'
                                    : log.operationType === 'deletion'
                                    ? 'bg-rose-50 text-rose-600 border-rose-100/30'
                                    : 'bg-amber-50 text-amber-600 border-amber-100/30'
                                }`}
                              >
                                {log.operationType === 'creation' || log.operationType === 'increment' ? (
                                  <ArrowUpRight size={12} />
                                ) : (
                                  <ArrowDownLeft size={12} />
                                )}
                                {log.operationType}
                              </span>
                            </td>

                            <td className="px-6 py-5 font-mono text-slate-500">
                              {log.previousQuantity}
                            </td>

                            <td className="px-6 py-5 font-mono font-bold text-slate-900">
                              {log.newQuantity}
                            </td>

                            <td className="px-6 py-5 text-right text-xs text-slate-400 whitespace-nowrap">
                              {new Date(log.timestamp || log.createdAt).toLocaleString()}
                            </td>
                          </motion.tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </PageTransition>
    </DashboardLayout>
  );
};

export default Logs;