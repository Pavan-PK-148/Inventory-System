import React, { useState } from 'react';

import {
  useNavigate,
  Link
} from 'react-router-dom';

import { motion } from 'framer-motion';

import {
  Lock,
  Mail,
  Boxes,
  ArrowRight,
  ShieldCheck,
  Activity,
  Database,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

import toast from 'react-hot-toast';

import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({
      email: '',
      password: ''
    });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.email ||
      !formData.password
    ) {
      toast.error(
        'Please fill all required fields.'
      );
      return;
    }

    setLoading(true);

    const loadToast =
      toast.loading(
        'Authenticating credentials...'
      );

    try {
      await login(
        formData.email,
        formData.password
      );

      toast.dismiss(loadToast);

      toast.success(
        'Access granted successfully.'
      );

      navigate('/dashboard');
    } catch (error) {
      toast.dismiss(loadToast);

      toast.error(
        error.response?.data
          ?.message ||
          'Authentication failed.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[#f8fafc]">
      {/* BACKGROUND */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-0 h-[450px] w-[450px] rounded-full bg-emerald-400/10 blur-3xl" />

        <div className="absolute right-0 top-[20%] h-[500px] w-[500px] rounded-full bg-yellow-300/10 blur-3xl" />
      </div>

      {/* LEFT PANEL */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden border-r border-white/40 bg-gradient-to-br from-emerald-500 via-emerald-600 to-yellow-400 p-12 lg:flex">
        {/* OVERLAY */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent_40%)]" />

        {/* LOGO */}
        <motion.div
          initial={{
            opacity: 0,
            y: -10
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          className="relative z-10 flex items-center gap-4"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/20 text-white backdrop-blur-xl">
            <Boxes size={30} />
          </div>

          <div>
            <h1 className="text-3xl font-black tracking-wide text-white">
              STOCKFLOW
            </h1>

            <p className="mt-1 text-sm font-semibold uppercase tracking-[0.18em] text-emerald-50">
              Enterprise Inventory Suite
            </p>
          </div>
        </motion.div>

        {/* HERO CONTENT */}
        <div className="relative z-10 max-w-xl">
          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-5 py-2 text-xs font-black uppercase tracking-[0.18em] text-white backdrop-blur-xl">
              <Sparkles size={13} />

              Secure Authentication
            </div>

            <h2 className="mt-8 text-6xl font-black leading-[1.05] tracking-tight text-white">
              Control Your Entire Inventory Ecosystem
            </h2>

            <p className="mt-6 text-lg font-medium leading-relaxed text-emerald-50">
              Access warehouse intelligence,
              supplier networks, operational
              analytics, stock logs, and
              enterprise dashboards securely.
            </p>
          </motion.div>

          {/* FEATURE LIST */}
          <div className="mt-12 space-y-5">
            {[
              'Real-time warehouse analytics',
              'Low stock alert systems',
              'Enterprise audit tracking',
              'Supplier network management'
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{
                  opacity: 0,
                  x: -10
                }}
                animate={{
                  opacity: 1,
                  x: 0
                }}
                transition={{
                  delay:
                    index * 0.1
                }}
                className="flex items-center gap-4"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-xl">
                  <CheckCircle2
                    size={20}
                    className="text-white"
                  />
                </div>

                <span className="text-base font-semibold text-white">
                  {item}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* FLOATING CARDS */}
        <motion.div
          animate={{
            y: [0, -8, 0]
          }}
          transition={{
            repeat: Infinity,
            duration: 4
          }}
          className="absolute right-10 top-24 rounded-[30px] border border-white/20 bg-white/10 p-5 shadow-2xl backdrop-blur-2xl"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
              <Activity className="text-white" />
            </div>

            <div>
              <p className="text-sm font-bold text-white">
                Live Operations
              </p>

              <p className="text-xs text-emerald-50">
                Inventory Active
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          animate={{
            y: [0, 10, 0]
          }}
          transition={{
            repeat: Infinity,
            duration: 5
          }}
          className="absolute bottom-24 right-16 rounded-[30px] border border-white/20 bg-white/10 p-5 shadow-2xl backdrop-blur-2xl"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
              <Database className="text-white" />
            </div>

            <div>
              <p className="text-sm font-bold text-white">
                12,450 Units
              </p>

              <p className="text-xs text-emerald-50">
                Live Stock Balance
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* RIGHT PANEL */}
      <div className="relative flex flex-1 items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg rounded-[32px] border border-white/60 bg-white/80 p-8 shadow-xl backdrop-blur-xl"
        >
          {/* MOBILE LOGO REDIRECTION */}
          <Link to="/" className="mb-8 flex items-center gap-3 lg:hidden cursor-pointer">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-amber-500 text-white shadow-md">
              <Boxes size={22} />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-wide">STOCKFLOW</h2>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Enterprise Suite</p>
            </div>
          </Link>

          {/* HEADER SECTOR */}
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-100 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">
              <ShieldCheck size={12} />
              Secure Access Shield
            </div>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900">
              Welcome Back
            </h1>
            <p className="mt-1.5 text-sm font-medium text-slate-400">
              Login to access your inventory dashboard and enterprise systems.
            </p>
          </div>

          {/* ACTUAL INTERACTIVE INPUT MATRIX */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {/* EMAIL ROW */}
            <div>
              <label className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                Email Address
              </label>
              <div className="relative mt-2">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@stockflow.com"
                  className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-12 pr-4 text-base font-semibold text-slate-800 placeholder-slate-300 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500/10"
                />
              </div>
            </div>

            {/* PASSWORD ROW */}
            <div>
              <label className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                Secure Password
              </label>
              <div className="relative mt-2">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-12 pr-4 text-base font-semibold text-slate-800 placeholder-slate-300 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500/10"
                />
              </div>
            </div>

            {/* SUBMIT BUTTON TRIGGER */}
            <motion.button
              whileHover={{ scale: 1.005 }}
              whileTap={{ scale: 0.995 }}
              type="submit"
              disabled={loading}
              className="group flex h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-base font-black text-white shadow-lg shadow-emerald-500/10 transition-all hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-60"
            >
              <span>{loading ? 'Authenticating...' : 'Authenticate Access'}</span>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5 text-amber-300" />
            </motion.button>
          </form>

          {/* REDIRECT ACTION BLOCK */}
          <p className="mt-6 text-center text-sm font-medium text-slate-400">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="cursor-pointer font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              Register Here
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;