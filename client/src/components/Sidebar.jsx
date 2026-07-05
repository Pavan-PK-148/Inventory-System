import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, LayoutGroup } from 'framer-motion';
import { 
  LayoutDashboard, 
  Package, 
  Truck, 
  History, 
  BarChart3, 
  Boxes,
  Bell
} from 'lucide-react';

const Sidebar = ({ isOpen }) => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/products', icon: Package },
    { name: 'Suppliers', path: '/suppliers', icon: Truck },
    { name: 'Inventory Logs', path: '/logs', icon: History },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'System Logs', path: '/notifications', icon: Bell }, // Added Notifications page route link
  ];

  return (
    <motion.aside
      animate={{ width: isOpen ? '260px' : '0px', opacity: isOpen ? 1 : 0 }}
      transition={{ type: 'spring', stiffness: 280, damping: 30 }}
      className="relative z-20 flex h-full flex-col overflow-hidden border-r border-slate-800/60 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white shadow-xl transform-gpu"
    >
      {/* BACKGROUND GRAPHIC GLOW ENHANCEMENTS */}
      <div className="absolute left-0 top-0 -z-10 h-64 w-64 rounded-full bg-emerald-500/5 blur-[80px] pointer-events-none" />

      {/* BRAND IDENTITY HEADER LINKS BACK TO HOME/DASHBOARD */}
      <Link 
        to="/" 
        className="relative flex h-16 items-center gap-3 border-b border-slate-800 px-6 select-none cursor-pointer transition-colors hover:bg-slate-900/20"
      >
        <motion.div
          whileHover={{ rotate: -6, scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-950 shadow-md shadow-emerald-500/20"
        >
          <Boxes size={18} className="stroke-[2.2]" />
        </motion.div>

        <div>
          <h1 className="text-md font-black tracking-wider text-white font-heading leading-none">
            STOCK<span className="text-emerald-400">FLOW</span>
          </h1>
          <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-slate-500 mt-1">
            Enterprise Suite
          </p>
        </div>
      </Link>

      {/* NAVIGATION LINKS */}
      <nav className="flex-1 space-y-1.5 px-3.5 py-6 overflow-y-auto scrollbar-none">
        <LayoutGroup id="sidebar-navigation-matrix">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `group relative flex cursor-pointer items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-semibold tracking-wide transition-all duration-300 ${
                  isActive ? 'text-emerald-400' : 'text-slate-400 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* MORPHING EMERALD GREEN ACTIVE BACKDROP */}
                  {isActive && (
                    <motion.div
                      layoutId="activePillIndicator"
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/15 to-emerald-500/5 border border-emerald-500/20"
                      transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                    />
                  )}

                  {/* ACTIVE FRONT LEADING VERTICAL GREEN ACCENT PILL */}
                  {isActive && (
                    <motion.div
                      layoutId="activeVerticalAccent"
                      className="absolute left-0 top-2.5 bottom-2.5 w-[3px] rounded-r-full bg-emerald-400"
                      transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                    />
                  )}

                  {/* NAV ICON SHIELD */}
                  <div
                    className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-300 ${
                      isActive
                        ? 'bg-emerald-500/10 text-emerald-400 shadow-inner'
                        : 'bg-slate-900/50 text-slate-400 group-hover:bg-slate-800/80 group-hover:text-slate-200'
                    }`}
                  >
                    <item.icon size={16} className="shrink-0 stroke-[2]" />
                  </div>

                  {/* LINK TEXT */}
                  <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-0.5">
                    {item.name}
                  </span>

                  {/* HOVER GLOW LAYER */}
                  {!isActive && (
                    <div className="absolute inset-0 opacity-0 rounded-xl border border-transparent transition-all duration-300 group-hover:bg-slate-900/30 group-hover:border-slate-800/30 group-hover:opacity-100" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </LayoutGroup>
      </nav>

      {/* METADATA BLOCKS FOOTER */}
      <div className="border-t border-slate-800/80 p-4 select-none">
        <div className="rounded-xl border border-slate-800/60 bg-slate-950/40 p-3 text-center backdrop-blur-xl">
          <p className="text-[10px] font-bold text-slate-400 tracking-wide uppercase">
            Core Ops Infrastructure
          </p>
          <p className="mt-0.5 text-[9px] font-medium text-slate-600 tracking-wider">
            © 2026 StockFlow Hub
          </p>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;