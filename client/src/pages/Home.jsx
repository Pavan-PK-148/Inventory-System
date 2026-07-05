import React from 'react';

import { Link } from 'react-router-dom';

import { motion } from 'framer-motion';

import {
  Boxes,
  ArrowRight,
  ShieldCheck,
  BarChart3,
  Layers3,
  ScanLine,
  Warehouse,
  BellRing,
  Package,
  Truck,
  History,
  Activity,
  CheckCircle2,
  TrendingUp,
  Database,
  Sparkles,
  Globe,
  Zap,
  UserPlus,
  LogIn
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: Package,
      title: 'Advanced Product Inventory',
      desc: 'Manage products, SKU identifiers, warehouse allocations, pricing matrices, and barcode mappings from one intelligent interface.',
      color: 'from-emerald-500 to-emerald-600'
    },

    {
      icon: Truck,
      title: 'Supplier Logistics Network',
      desc: 'Register and monitor supplier partnerships, contact infrastructure, logistics channels, and procurement records.',
      color: 'from-yellow-400 to-amber-500'
    },

    {
      icon: History,
      title: 'Immutable Inventory Logs',
      desc: 'Track every stock modification with secure operational history, timestamped ledger records, and quantity audit trails.',
      color: 'from-emerald-500 to-teal-500'
    },

    {
      icon: BarChart3,
      title: 'Enterprise Analytics Engine',
      desc: 'Transform inventory behavior into visual intelligence with charts, low-stock analysis, export systems, and performance metrics.',
      color: 'from-yellow-500 to-orange-500'
    },

    {
      icon: BellRing,
      title: 'Live Alert Monitoring',
      desc: 'Receive instant operational notifications for critical inventory thresholds and safety stock breaches.',
      color: 'from-emerald-500 to-green-500'
    },

    {
      icon: ShieldCheck,
      title: 'Protected System Architecture',
      desc: 'Enterprise-grade authentication layers with secure operator access and protected management workflows.',
      color: 'from-yellow-400 to-yellow-500'
    }
  ];

  const demoCards = [
    {
      title: 'Warehouse Alpha',
      value: '12,450',
      label: 'Live Units',
      icon: Warehouse
    },

    {
      title: 'Critical Alerts',
      value: '04',
      label: 'Requires Action',
      icon: BellRing
    },

    {
      title: 'Stock Valuation',
      value: '$94K',
      label: 'Inventory Worth',
      icon: TrendingUp
    }
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f8fafc] text-slate-900">
      {/* BACKGROUND GLOWS */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-20 top-0 h-[450px] w-[450px] rounded-full bg-emerald-400/10 blur-3xl" />

        <div className="absolute right-0 top-[20%] h-[500px] w-[500px] rounded-full bg-yellow-300/10 blur-3xl" />

        <div className="absolute bottom-0 left-[30%] h-[400px] w-[400px] rounded-full bg-emerald-300/10 blur-3xl" />
      </div>

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-white/40 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          {/* LOGO */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="flex items-center gap-3"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-yellow-400 text-white shadow-lg">
              <Boxes size={24} />
            </div>

            <div>
              <h1 className="text-xl font-black tracking-wide text-slate-900">
                STOCK
                <span className="text-emerald-500">
                  FLOW
                </span>
              </h1>

              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Enterprise Inventory Suite
              </p>
            </div>
          </motion.div>

          {/* ACTIONS */}
          <div className="flex items-center gap-3">
            {user ? (
              <Link
                to="/dashboard"
                className="flex cursor-pointer items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition-all hover:bg-slate-800"
              >
                Dashboard

                <ArrowRight
                  size={15}
                  className="text-yellow-400"
                />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex cursor-pointer items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition-all hover:bg-slate-50"
                >
                  <LogIn size={15} />

                  Login
                </Link>

                <Link
                  to="/signup"
                  className="hidden cursor-pointer items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-lg transition-all hover:scale-[1.02] sm:flex"
                >
                  <UserPlus size={15} />

                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative mx-auto flex max-w-7xl flex-col items-center px-6 pb-24 pt-20 text-center">
        {/* BADGE */}
        <motion.div
          initial={{
            opacity: 0,
            y: 10
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-5 py-2 text-xs font-black uppercase tracking-[0.2em] text-emerald-700 shadow-sm"
        >
          <Sparkles
            size={13}
            className="text-yellow-500"
          />

          Smart Warehouse Intelligence
        </motion.div>

        {/* TITLE */}
        <motion.h1
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{ delay: 0.1 }}
          className="max-w-5xl text-5xl font-black leading-[1.05] tracking-tight text-slate-900 sm:text-6xl lg:text-7xl"
        >
          The Modern Way To Manage
          <span className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-yellow-500 bg-clip-text text-transparent">
            {' '}
            Enterprise Inventory
          </span>
        </motion.h1>

        {/* DESC */}
        <motion.p
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{ delay: 0.2 }}
          className="mt-8 max-w-3xl text-lg font-medium leading-relaxed text-slate-500"
        >
          StockFlow centralizes products,
          suppliers, analytics, stock movement,
          warehouse operations, and audit logs
          into one powerful real-time
          management platform.
        </motion.p>

        {/* BUTTONS */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{ delay: 0.3 }}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          <Link
            to={
              user
                ? '/dashboard'
                : '/signup'
            }
            className="group flex cursor-pointer items-center justify-center gap-2 rounded-3xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-8 py-4 text-sm font-black text-white shadow-2xl shadow-emerald-500/20 transition-all hover:scale-[1.02]"
          >
            Launch Platform

            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>

          <a
            href="#features"
            className="flex cursor-pointer items-center justify-center rounded-3xl border border-slate-200 bg-white px-8 py-4 text-sm font-black text-slate-700 shadow-sm transition-all hover:bg-slate-50"
          >
            Explore Features
          </a>
        </motion.div>

        {/* DEMO DASHBOARD */}
        <motion.div
          initial={{
            opacity: 0,
            y: 30
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            delay: 0.4,
            duration: 0.5
          }}
          className="relative mt-20 w-full rounded-[40px] border border-white/40 bg-white/80 p-5 shadow-2xl backdrop-blur-xl"
        >
          {/* TOP BAR */}
          <div className="flex items-center justify-between rounded-[28px] border border-slate-100 bg-slate-50 px-6 py-4">
            <div>
              <h3 className="text-left text-lg font-black text-slate-900">
                Inventory Operations Dashboard
              </h3>

              <p className="text-left text-xs text-slate-400">
                Live warehouse management
                system
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-600">
              <Activity size={14} />

              System Active
            </div>
          </div>

          {/* STATS */}
          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            {demoCards.map((card, index) => (
              <motion.div
                key={index}
                whileHover={{
                  y: -4
                }}
                className="rounded-[28px] border border-slate-100 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-yellow-400 text-white shadow-lg">
                    <card.icon size={24} />
                  </div>

                  <div className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-600">
                    LIVE
                  </div>
                </div>

                <h3 className="mt-6 text-4xl font-black text-slate-900">
                  {card.value}
                </h3>

                <p className="mt-1 text-sm font-semibold text-slate-500">
                  {card.title}
                </p>

                <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
                  <motion.div
                    initial={{
                      width: 0
                    }}
                    animate={{
                      width: '78%'
                    }}
                    transition={{
                      duration: 1.5,
                      delay: 0.4 + index * 0.2
                    }}
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-yellow-400"
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* DEMO TABLE */}
          <div className="mt-6 overflow-hidden rounded-[28px] border border-slate-100">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-[0.16em] text-slate-500">
                    <th className="px-6 py-5 text-left">
                      Product
                    </th>

                    <th className="px-6 py-5 text-left">
                      SKU
                    </th>

                    <th className="px-6 py-5 text-left">
                      Warehouse
                    </th>

                    <th className="px-6 py-5 text-left">
                      Stock
                    </th>

                    <th className="px-6 py-5 text-right">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {[
                    {
                      name: 'Wireless Scanner',
                      sku: 'ELEC-104',
                      stock: 124
                    },

                    {
                      name: 'Smart Controller',
                      sku: 'CTRL-902',
                      stock: 16
                    },

                    {
                      name: 'Industrial Router',
                      sku: 'NET-701',
                      stock: 4
                    }
                  ].map((item, index) => (
                    <motion.tr
                      key={index}
                      initial={{
                        opacity: 0,
                        y: 8
                      }}
                      animate={{
                        opacity: 1,
                        y: 0
                      }}
                      transition={{
                        delay:
                          0.6 +
                          index * 0.15
                      }}
                      className="transition-all hover:bg-slate-50"
                    >
                      <td className="px-6 py-5 font-bold text-slate-900">
                        {item.name}
                      </td>

                      <td className="px-6 py-5 font-mono text-sm text-slate-500">
                        {item.sku}
                      </td>

                      <td className="px-6 py-5">
                        <span className="rounded-xl bg-yellow-50 px-3 py-1 text-xs font-bold text-yellow-700">
                          Warehouse Beta
                        </span>
                      </td>

                      <td className="px-6 py-5 font-bold text-slate-900">
                        {item.stock}
                      </td>

                      <td className="px-6 py-5 text-right">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            item.stock < 10
                              ? 'bg-rose-50 text-rose-600'
                              : 'bg-emerald-50 text-emerald-600'
                          }`}
                        >
                          {item.stock < 10
                            ? 'Low Stock'
                            : 'Healthy'}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </section>

      {/* FEATURES */}
      <section
        id="features"
        className="mx-auto max-w-7xl px-6 py-24"
      >
        <div className="text-center">
          <h2 className="text-4xl font-black tracking-tight text-slate-900">
            Everything Needed To Control
            Inventory Operations
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base font-medium text-slate-500">
            Built for modern inventory teams,
            suppliers, warehouse operators, and
            enterprise management systems.
          </p>
        </div>

        {/* FEATURE GRID */}
        <div className="mt-16 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{
                opacity: 0,
                y: 20
              }}
              whileInView={{
                opacity: 1,
                y: 0
              }}
              viewport={{ once: true }}
              transition={{
                delay: index * 0.06
              }}
              whileHover={{
                y: -5
              }}
              className="group relative overflow-hidden rounded-[32px] border border-slate-200 bg-white p-7 shadow-sm transition-all hover:shadow-2xl"
            >
              {/* GLOW */}
              <div
                className={`absolute right-0 top-0 h-40 w-40 rounded-full bg-gradient-to-br ${feature.color} opacity-10 blur-3xl`}
              />

              <div
                className={`flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br ${feature.color} text-white shadow-xl`}
              >
                <feature.icon size={28} />
              </div>

              <h3 className="mt-7 text-2xl font-black tracking-tight text-slate-900">
                {feature.title}
              </h3>

              <p className="mt-4 text-sm font-medium leading-relaxed text-slate-500">
                {feature.desc}
              </p>

              <div className="mt-8 flex items-center gap-2 text-sm font-bold text-emerald-600">
                Explore Feature

                <ArrowRight size={15} />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* EXTRA SECTION */}
      <section className="relative overflow-hidden border-y border-slate-200 bg-white py-24">
        <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-2 lg:items-center">
          {/* LEFT */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-yellow-50 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-yellow-700">
              <Database size={13} />

              Real-Time Infrastructure
            </div>

            <h2 className="mt-7 text-5xl font-black leading-tight tracking-tight text-slate-900">
              Built For Intelligent Warehouse
              Ecosystems
            </h2>

            <p className="mt-6 text-base font-medium leading-relaxed text-slate-500">
              Monitor stock levels, supplier
              movement, analytics, barcode
              records, and inventory adjustments
              from one centralized platform.
            </p>

            <div className="mt-10 space-y-5">
              {[
                'Real-time inventory synchronization',
                'Enterprise analytics & reports',
                'Barcode enabled workflows',
                'Operational audit trails',
                'Warehouse management system',
                'Instant low-stock alerts'
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{
                    opacity: 0,
                    x: -10
                  }}
                  whileInView={{
                    opacity: 1,
                    x: 0
                  }}
                  viewport={{ once: true }}
                  transition={{
                    delay: index * 0.08
                  }}
                  className="flex items-center gap-4"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                    <CheckCircle2 size={20} />
                  </div>

                  <span className="text-sm font-bold text-slate-700">
                    {item}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95
            }}
            whileInView={{
              opacity: 1,
              scale: 1
            }}
            viewport={{ once: true }}
            className="relative rounded-[40px] border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-8 shadow-2xl"
          >
            <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-yellow-300/20 blur-3xl" />

            <div className="space-y-5">
              {[
                {
                  icon: ScanLine,
                  title:
                    'Barcode Detection Engine'
                },

                {
                  icon: Globe,
                  title:
                    'Supplier Connectivity Grid'
                },

                {
                  icon: Zap,
                  title:
                    'Lightning Fast Operations'
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{
                    x: 4
                  }}
                  className="flex items-center gap-5 rounded-[28px] border border-slate-100 bg-white p-5 shadow-sm"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-500 to-yellow-400 text-white shadow-lg">
                    <item.icon size={28} />
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-slate-900">
                      {item.title}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Enterprise operational
                      acceleration
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <motion.div
          whileHover={{
            scale: 1.01
          }}
          className="relative overflow-hidden rounded-[42px] bg-gradient-to-br from-emerald-500 via-emerald-600 to-yellow-500 px-8 py-20 text-center shadow-2xl"
        >
          <div className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_40%)]" />

          <div className="relative z-10">
            <h2 className="text-5xl font-black leading-tight tracking-tight text-white">
              Ready To Modernize
              <br />
              Your Inventory Operations?
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-lg font-medium text-emerald-50">
              Start managing products,
              warehouses, suppliers, analytics,
              and stock operations using one
              enterprise-grade intelligent
              platform.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to={
                  user
                    ? '/dashboard'
                    : '/signup'
                }
                className="flex cursor-pointer items-center gap-2 rounded-3xl bg-white px-8 py-4 text-sm font-black text-slate-900 shadow-lg transition-all hover:scale-[1.02]"
              >
                Launch Platform

                <ArrowRight
                  size={15}
                  className="text-emerald-600"
                />
              </Link>

              {!user && (
                <Link
                  to="/login"
                  className="flex cursor-pointer items-center gap-2 rounded-3xl border border-white/30 bg-white/10 px-8 py-4 text-sm font-black text-white backdrop-blur-xl transition-all hover:bg-white/20"
                >
                  Operator Login
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 text-center sm:flex-row sm:text-left">
          <div>
            <h3 className="text-lg font-black text-slate-900">
              STOCK
              <span className="text-emerald-500">
                FLOW
              </span>
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              Enterprise Inventory Intelligence
              Platform
            </p>
          </div>

          <p className="text-sm font-medium text-slate-400">
            © 2026 StockFlow Systems. All
            rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;