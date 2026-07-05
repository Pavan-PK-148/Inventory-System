import React, { useState } from 'react';

import {
  useNavigate,
  Link
} from 'react-router-dom';

import { motion } from 'framer-motion';

import {
  Lock,
  Mail,
  User,
  Boxes,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

import toast from 'react-hot-toast';

import API from '../api/axiosInstance';

const Register = () => {
  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({
      name: '',
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
      !formData.name ||
      !formData.email ||
      !formData.password
    ) {
      toast.error(
        'Please complete all fields.'
      );
      return;
    }

    setLoading(true);

    const loadToast =
      toast.loading(
        'Creating enterprise account...'
      );

    try {
      await API.post(
        '/auth/register',
        formData
      );

      toast.dismiss(loadToast);

      toast.success(
        'Registration successful.'
      );

      navigate('/login');
    } catch (error) {
      toast.dismiss(loadToast);

      toast.error(
        error.response?.data
          ?.message ||
          'Registration failed.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[#f8fafc]">
      {/* SAME LEFT PANEL DESIGN AS LOGIN */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-0 h-[450px] w-[450px] rounded-full bg-emerald-400/10 blur-3xl" />

        <div className="absolute right-0 top-[20%] h-[500px] w-[500px] rounded-full bg-yellow-300/10 blur-3xl" />
      </div>

      {/* LEFT */}
      <div className="hidden w-1/2 bg-gradient-to-br from-emerald-500 via-emerald-600 to-yellow-400 p-12 lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/20 text-white backdrop-blur-xl">
            <Boxes size={30} />
          </div>

          <div>
            <h1 className="text-3xl font-black text-white">
              STOCKFLOW
            </h1>

            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-50">
              Enterprise Platform
            </p>
          </div>
        </div>

        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-5 py-2 text-xs font-black uppercase tracking-[0.18em] text-white backdrop-blur-xl">
            <Sparkles size={13} />

            Create Enterprise Account
          </div>

          <h2 className="mt-8 text-6xl font-black leading-[1.05] text-white">
            Start Managing Inventory Smarter
          </h2>

          <p className="mt-6 text-lg font-medium leading-relaxed text-emerald-50">
            Register your secure enterprise
            workspace and access intelligent
            inventory management tools.
          </p>

          <div className="mt-12 space-y-5">
            {[
              'Analytics dashboards',
              'Supplier management',
              'Warehouse monitoring',
              'Inventory intelligence'
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-4"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20">
                  <CheckCircle2
                    size={20}
                    className="text-white"
                  />
                </div>

                <span className="font-semibold text-white">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div />
      </div>

      {/* RIGHT */}
      <div className="relative flex flex-1 items-center justify-center px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-[28px] border border-white/60 bg-white/80 p-8 shadow-xl backdrop-blur-xl"
        >
          {/* Form Header */}
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-amber-700 shadow-2xs">
              <ShieldCheck size={11} className="text-emerald-600" />
              Secure System Node
            </div>

            <h1 className="mt-4 text-2xl font-black tracking-tight text-slate-900">
              Create Account
            </h1>

            <p className="mt-1.5 text-xs font-semibold text-slate-400">
              Register your enterprise inventory workspace.
            </p>
          </div>

          {/* Form Inputs Matrix */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* NAME FIELD */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                Full Name
              </label>
              <div className="relative mt-1.5">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-11 pr-4 text-sm font-semibold text-slate-800 placeholder-slate-300 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            {/* EMAIL FIELD */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                Email Address
              </label>
              <div className="relative mt-1.5">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="operator@stockflow.com"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-11 pr-4 text-sm font-semibold text-slate-800 placeholder-slate-300 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            {/* PASSWORD FIELD */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                Secure Password
              </label>
              <div className="relative mt-1.5">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••••••"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-11 pr-4 text-sm font-semibold text-slate-800 placeholder-slate-300 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            {/* REGISTER EXECUTE CORE TRIGGER */}
            <motion.button
              whileHover={{ scale: 1.005 }}
              whileTap={{ scale: 0.995 }}
              type="submit"
              disabled={loading}
              className="group flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-sm font-black text-white shadow-md shadow-emerald-500/10 transition-all hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-60"
            >
              <span>{loading ? 'Creating Account...' : 'Register Workspace'}</span>
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5 text-amber-300" />
            </motion.button>
          </form>

          {/* REDIRECT LINK */}
          <p className="mt-6 text-center text-xs font-semibold text-slate-400">
            Already registered?{' '}
            <Link
              to="/login"
              className="cursor-pointer font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              Login Here
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;