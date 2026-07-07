import React, { useState, useEffect } from 'react';
import {
  Package,
  Truck,
  CircleDollarSign,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import PageTransition from '../components/PageTransition';
import API from '../api/axiosInstance';
import toast from 'react-hot-toast';

// 🚀 Integrated Futuristic Feature Modules
import WarehouseHeatmap from '../components/WarehouseHeatmap';
import Warehouse3D from '../components/Warehouse3D';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState({
    summary: {
      totalProducts: 0,
      totalSuppliers: 0,
      totalStockValue: 0,
      lowStockAlertsCount: 0
    },
    criticalItems: []
  });

  useEffect(() => {
    const fetchDashboardMetrics = async () => {
      try {
        const response = await API.get('/analytics/dashboard');
        setData(response.data);
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            'Failed to retrieve real-time matrix summary.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardMetrics();
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  const stats = [
    {
      id: 1,
      name: 'Total Products',
      value: data.summary.totalProducts.toLocaleString(),
      change: 'Cataloged Items',
      icon: Package,
      color: 'from-emerald-500 to-emerald-400',
      textColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      id: 2,
      name: 'Total Suppliers',
      value: data.summary.totalSuppliers.toLocaleString(),
      change: 'Active Networks',
      icon: Truck,
      color: 'from-blue-500 to-cyan-400',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 3,
      name: 'Total Stock Value',
      value: formatCurrency(data.summary.totalStockValue),
      change: 'On-Hand Assets',
      icon: CircleDollarSign,
      color: 'from-amber-500 to-orange-400',
      textColor: 'text-amber-600',
      bgColor: 'bg-amber-50'
    },
    {
      id: 4,
      name: 'Low Stock Alerts',
      value: data.summary.lowStockAlertsCount.toLocaleString(),
      change: 'Requires attention',
      icon: AlertTriangle,
      color: 'from-rose-500 to-pink-400',
      textColor: 'text-rose-600',
      bgColor: 'bg-rose-50',
      pulse: data.summary.lowStockAlertsCount > 0
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.96
    },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 180,
        damping: 18
      }
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-[70vh] items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="relative">
              <div className="absolute inset-0 animate-ping rounded-full bg-primary-400/30" />
              <Loader2 className="relative h-10 w-10 animate-spin text-primary-500" />
            </div>

            <p className="text-sm font-medium text-slate-500">
              Syncing enterprise inventory clusters...
            </p>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageTransition>
        <div className="relative space-y-8 overflow-hidden pb-12">
          {/* Background Decorations */}
          <div className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full bg-primary-200/30 blur-3xl" />
          <div className="pointer-events-none absolute top-40 right-0 h-80 w-80 rounded-full bg-cyan-200/20 blur-3xl" />

          {/* Header */}
          <div className="relative">
            <motion.h1
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-4xl font-black tracking-tight text-slate-900"
            >
              System Dashboard
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="mt-2 text-sm text-slate-500"
            >
              Real-time intelligent overview of enterprise inventory analytics.
            </motion.p>
          </div>

          {/* KPI CARDS */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <motion.div
                  key={stat.id}
                  variants={cardVariants}
                  whileHover={{
                    y: -6,
                    scale: 1.02
                  }}
                  className="group relative overflow-hidden rounded-3xl border border-white/30 bg-white/70 p-6 shadow-lg backdrop-blur-xl"
                >
                  {/* Glow */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 transition-opacity duration-500 group-hover:opacity-10`}
                  />

                  <div className="relative flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                        {stat.name}
                      </p>

                      <h3 className="mt-3 text-3xl font-black tracking-tight text-slate-900">
                        {stat.value}
                      </h3>
                    </div>

                    <motion.div
                      whileHover={{ rotate: 10, scale: 1.08 }}
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl ${stat.bgColor} ${stat.textColor} shadow-inner`}
                    >
                      <Icon
                        size={26}
                        className={stat.pulse ? 'animate-bounce' : ''}
                      />
                    </motion.div>
                  </div>

                  <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-slate-500">
                    {stat.id === 3 && (
                      <TrendingUp size={14} className="text-emerald-500" />
                    )}

                    <span>{stat.change}</span>
                  </div>

                  <div
                    className={`absolute bottom-0 left-0 h-1.5 w-full bg-gradient-to-r ${stat.color}`}
                  />
                </motion.div>
              );
            })}
          </motion.div>

          {/* 📡 PHASE 1: REAL-TIME WAREHOUSE HEATMAP GRID */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="w-full"
          >
            <WarehouseHeatmap />
          </motion.div>

          {/* LOWER GRID */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* QUICK ACTIONS */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl border border-white/30 bg-white/70 p-6 shadow-lg backdrop-blur-xl lg:col-span-2"
            >
              <h3 className="text-xl font-bold text-slate-900">
                System Operations
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Accelerate workflow with intelligent shortcuts.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  onClick={() => navigate('/products')}
                  className="group cursor-pointer rounded-2xl border border-slate-200/70 bg-gradient-to-br from-white to-slate-50 p-5 transition-all duration-300 hover:border-primary-300 hover:shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="rounded-2xl bg-primary-100 p-3 text-primary-700 shadow-inner">
                        <Package size={22} />
                      </div>

                      <div>
                        <h4 className="font-semibold text-slate-800">
                          Products Catalog
                        </h4>

                        <p className="text-xs text-slate-500">
                          Insert or update inventory SKU entries
                        </p>
                      </div>
                    </div>

                    <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  onClick={() => navigate('/suppliers')}
                  className="group cursor-pointer rounded-2xl border border-slate-200/70 bg-gradient-to-br from-white to-slate-50 p-5 transition-all duration-300 hover:border-secondary-300 hover:shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="rounded-2xl bg-secondary-100 p-3 text-secondary-700 shadow-inner">
                        <Truck size={22} />
                      </div>

                      <div>
                        <h4 className="font-semibold text-slate-800">
                          Register Supplier
                        </h4>

                        <p className="text-xs text-slate-500">
                          Link vendor logistics accounts
                        </p>
                      </div>
                    </div>

                    <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* ALERTS HUB */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-3xl border border-white/30 bg-white/70 p-6 shadow-lg backdrop-blur-xl"
            >
              <h3 className="text-xl font-bold text-slate-900">
                Active Alerts Hub
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Critical inventory thresholds.
              </p>

              <div className="mt-6 space-y-3 max-h-[220px] overflow-y-auto pr-1">
                {data.criticalItems.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-center"
                  >
                    <p className="text-sm font-semibold text-emerald-700">
                      All inventory balances secure.
                    </p>
                  </motion.div>
                ) : (
                  data.criticalItems.map((item, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center gap-3 rounded-2xl border border-rose-100 bg-gradient-to-r from-rose-50 to-pink-50 p-4"
                    >
                      <div className="rounded-xl bg-rose-100 p-2">
                        <AlertTriangle
                          size={18}
                          className="text-rose-600"
                        />
                      </div>

                      <div className="text-xs">
                        <p className="font-semibold text-rose-900">
                          {item.name}
                        </p>

                        <p className="mt-0.5 text-rose-700">
                          Critical inventory balance: {item.stock} left (
                          {item.sku})
                        </p>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </div>

          {/* 🏢 PHASE 3: DIGITAL TWIN 3D WAREHOUSE FULL-WIDTH VIEW */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="w-full"
          >
            <Warehouse3D />
          </motion.div>
        </div>
      </PageTransition>
    </DashboardLayout>
  );
};

export default Dashboard;