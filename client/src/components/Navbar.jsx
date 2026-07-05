import React from 'react';

import {
  Menu,
  X,
  Bell,
  LogOut,
  User
} from 'lucide-react';

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Navbar = ({
  toggleSidebar,
  sidebarOpen
}) => {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();

    toast.success(
      'Successfully logged out.',
      {
        id: 'logout-toast'
      }
    );

    navigate('/login');
  };

  const firstName = user?.name
    ? user.name.split(' ')[0]
    : 'Operator';

  return (
    <header className="relative z-30 flex h-20 w-full items-center justify-between border-b border-white/30 bg-white/70 px-4 shadow-lg backdrop-blur-xl sm:px-8">
      {/* LEFT */}
      <div className="flex items-center gap-4">
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={toggleSidebar}
          className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-2.5 text-slate-600 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900"
        >
          {sidebarOpen ? (
            <X
              size={20}
              className="lg:hidden"
            />
          ) : (
            <Menu size={20} />
          )}
        </motion.button>

        <div>
          <h2 className="text-lg font-black tracking-tight text-slate-900">
            Welcome, {firstName}
          </h2>

          <p className="hidden text-xs font-medium text-slate-400 sm:block">
            Enterprise Operations Panel
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        {/* NOTIFICATION */}
        <Link to="/notifications" className="block">
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="relative cursor-pointer rounded-2xl border border-slate-200 bg-white p-3 text-slate-600 shadow-sm transition-all hover:bg-slate-50 hover:text-emerald-600"
  >
    <Bell size={18} />

    {/* Dynamic Unread Alert Pulse */}
    <span className="absolute right-2 top-2 h-2.5 w-2.5 animate-pulse rounded-full bg-amber-500" />
  </motion.button>
</Link>

        <div className="hidden h-8 w-px bg-slate-200 sm:block" />

        {/* PROFILE */}
        <div className="flex items-center gap-3">
          {/* USER DETAILS */}
          {user && (
            <div className="hidden text-right sm:block">
              <p className="text-sm font-bold text-slate-900">
                {user.name}
              </p>

              <p className="max-w-[180px] truncate text-xs text-slate-400">
                {user.email}
              </p>
            </div>
          )}

          {/* AVATAR */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-2xl border border-primary-100 bg-gradient-to-br from-primary-50 to-primary-100 text-sm font-black uppercase text-primary-700 shadow-sm"
          >
            {user?.name ? (
              user.name.charAt(0)
            ) : (
              <User size={16} />
            )}
          </motion.div>

          {/* LOGOUT */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleLogout}
            className="flex cursor-pointer items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 shadow-sm transition-all hover:border-rose-100 hover:bg-rose-50 hover:text-rose-600"
          >
            <LogOut size={15} />

            <span className="hidden md:inline">
              Logout
            </span>
          </motion.button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;