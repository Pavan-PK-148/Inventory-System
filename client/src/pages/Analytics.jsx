import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  AlertOctagon,
  Download,
  Loader2
} from 'lucide-react';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';

import DashboardLayout from '../components/DashboardLayout';
import PageTransition from '../components/PageTransition';
import API from '../api/axiosInstance';

const Analytics = () => {
  const [loading, setLoading] = useState(true);

  const [analyticsData, setAnalyticsData] = useState({
    summary: {
      totalProducts: 0,
      totalSuppliers: 0,
      totalStockValue: 0,
      lowStockAlertsCount: 0
    },
    criticalItems: []
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await API.get('/analytics/dashboard');
        setAnalyticsData(response.data);
      } catch (error) {
        toast.error('Failed to load analytics data.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const exportToExcel = (dataList, reportTitle) => {
    if (!dataList || dataList.length === 0) {
      toast.error('No records found to export.');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(dataList);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Operational Data');
    XLSX.writeFile(
      workbook,
      `${reportTitle.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`
    );

    toast.success(`${reportTitle} exported successfully.`);
  };

  const formatMoney = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  const chartDataSummary = [
    {
      name: 'Products',
      count: analyticsData.summary.totalProducts,
      fill: '#10b981'
    },
    {
      name: 'Suppliers',
      count: analyticsData.summary.totalSuppliers,
      fill: '#3b82f6'
    },
    {
      name: 'Alert SKUs',
      count: analyticsData.summary.lowStockAlertsCount,
      fill: '#f43f5e'
    }
  ];

  const pieDataDistribution = [
    {
      name: 'Healthy Items',
      value: Math.max(
        0,
        analyticsData.summary.totalProducts - analyticsData.summary.lowStockAlertsCount
      )
    },
    {
      name: 'Low Stock',
      value: analyticsData.summary.lowStockAlertsCount
    }
  ];

  const PIE_COLORS = ['#10b981', '#f43f5e'];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-[70vh] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary-500" />
            <p className="text-sm font-medium text-slate-500">
              Loading analytics engine...
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
                Reports & Analytics
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Transform operational inventory data into enterprise insights.
              </p>
            </div>

            <button
              onClick={() => exportToExcel([analyticsData.summary], 'Inventory Summary KPI')}
              className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300 cursor-pointer"
            >
              <Download size={16} />
              <span>Export Summary</span>
            </button>
          </motion.div>

          {/* KPI CARDS MATRIX */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* VALUATION CARD */}
            <motion.div
              whileHover={{ y: -3 }}
              className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                  Inventory Liquidity
                </span>
                <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-600 border border-emerald-100/20">
                  <TrendingUp size={11} />
                  Live
                </span>
              </div>

              <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-900">
                {formatMoney(analyticsData.summary.totalStockValue)}
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Total aggregated warehouse inventory valuation metrics.
              </p>

              <div className="mt-5 border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Tracked SKUs</span>
                  <span className="font-bold text-slate-700">
                    {analyticsData.summary.totalProducts} Items
                  </span>
                </div>
              </div>
            </motion.div>

            {/* SUPPLIER CARD */}
            <motion.div
              whileHover={{ y: -3 }}
              className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                  Supply Grid
                </span>
                <span className="rounded-full bg-primary-50 px-3 py-1 text-[11px] font-bold text-primary-600 border border-primary-100/20">
                  Stable
                </span>
              </div>

              <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-900">
                {analyticsData.summary.totalSuppliers}
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Connected supplier log and logistics networks channel lines.
              </p>

              <div className="mt-5 border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Channel Status</span>
                  <span className="font-bold text-emerald-600">Operational</span>
                </div>
              </div>
            </motion.div>

            {/* LOW STOCK CARD */}
            <motion.div
              whileHover={{ y: -3 }}
              className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                  Low Stock Alerts
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-[11px] font-bold border ${
                    analyticsData.summary.lowStockAlertsCount > 0
                      ? 'bg-rose-50 text-rose-600 border-rose-100/30 animate-pulse'
                      : 'bg-emerald-50 text-emerald-600 border-emerald-100/30'
                  }`}
                >
                  {analyticsData.summary.lowStockAlertsCount > 0 ? 'Attention' : 'Optimal'}
                </span>
              </div>

              <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-900">
                {analyticsData.summary.lowStockAlertsCount}
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Sourced components remaining below minimal safety margins.
              </p>

              <div className="mt-5 border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Risk Severity Index</span>
                  <span
                    className={`font-bold ${
                      analyticsData.summary.lowStockAlertsCount > 0 ? 'text-rose-600' : 'text-emerald-600'
                    }`}
                  >
                    {analyticsData.summary.lowStockAlertsCount > 0 ? 'Action Required' : 'Secure'}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* GRAPHICAL PLOT BAYS */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* BAR CHART MODULE */}
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                <BarChart3 size={18} className="text-primary-500" />
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  Operational Component Distribution
                </h3>
              </div>

              <div className="mt-6 h-72 text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartDataSummary}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} />
                    <YAxis stroke="#94a3b8" tickLine={false} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} />
                    <Bar dataKey="count" radius={[8, 8, 0, 0]} barSize={42} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* PIE CHART MODULE */}
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  Safety Stock Threshold Spread
                </h3>
              </div>

              <div className="mt-6 h-72 text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieDataDistribution}
                      cx="50%"
                      cy="45%"
                      innerRadius={65}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieDataDistribution.map((entry, index) => (
                        <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* REAL-TIME DEPLOYED CRITICAL REPORT TABLE */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <AlertOctagon className="text-amber-500 shrink-0" size={22} />
                <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">
                    Critical Low Stock Threshold Ledger
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Automated safety limit alerts filtering items requiring reorder execution.
                  </p>
                </div>
              </div>

              <button
                onClick={() => exportToExcel(analyticsData.criticalItems, 'Critical Low Stock Details')}
                className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300 cursor-pointer"
              >
                <Download size={14} />
                <span>Download Report</span>
              </button>
            </div>

            <div className="mt-6 overflow-hidden rounded-3xl border border-slate-100">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-[0.16em] text-slate-500">
                      <th className="px-6 py-5 text-left font-bold">Component</th>
                      <th className="px-6 py-5 text-left font-bold">SKU</th>
                      <th className="px-6 py-5 text-left font-bold">Warehouse Zone</th>
                      <th className="px-6 py-5 text-left font-bold">Remaining Stock</th>
                      <th className="px-6 py-5 text-right font-bold">Risk Status</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 text-sm font-medium">
                    {analyticsData.criticalItems.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-16 text-center text-slate-400">
                          All operational balances remain inside secure threshold profiles.
                        </td>
                      </tr>
                    ) : (
                      analyticsData.criticalItems.map((item, index) => (
                        <motion.tr
                          key={index}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.02 }}
                          className="transition-all hover:bg-slate-50/80 cursor-default"
                        >
                          <td className="px-6 py-5 font-semibold text-slate-900">
                            {item.name}
                          </td>
                          <td className="px-6 py-5 font-mono text-slate-500">
                            {item.sku}
                          </td>
                          <td className="px-6 py-5">
                            <span className="rounded-xl bg-primary-50 px-2.5 py-1 text-xs font-bold text-primary-700 border border-primary-100/20">
                              {item.warehouseLocation || 'Warehouse Alpha'}
                            </span>
                          </td>
                          <td className="px-6 py-5 font-bold text-rose-600">
                            {item.quantity ?? item.stock} Units left
                          </td>
                          <td className="px-6 py-5 text-right">
                            <span className="rounded-xl bg-rose-50 border border-rose-100/30 px-3 py-1 text-xs font-bold text-rose-600">
                              {item.quantity <= 0 ? 'Out of Stock' : 'Critical'}
                            </span>
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
      </PageTransition>
    </DashboardLayout>
  );
};

export default Analytics;