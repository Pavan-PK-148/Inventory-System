import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(
    window.innerWidth >= 1024
  );

  const location = useLocation();

  useEffect(() => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, [location]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50">
      {/* Background Effects */}
      <div className="pointer-events-none absolute -top-24 left-10 h-72 w-72 rounded-full bg-primary-300/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-300/20 blur-3xl" />

      {/* MOBILE OVERLAY */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR */}
      <motion.div
        initial={false}
        animate={{
          x: sidebarOpen ? 0 : -320
        }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 28
        }}
        className="fixed inset-y-0 left-0 z-50 lg:static lg:translate-x-0"
      >
        <Sidebar
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
        />
      </motion.div>

      {/* MAIN CONTENT */}
      <div className="relative flex flex-1 flex-col overflow-hidden">
        {/* Glass Navbar */}
        <div className="border-b border-white/30 bg-white/60 backdrop-blur-xl">
          <Navbar
            toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            sidebarOpen={sidebarOpen}
          />
        </div>

        {/* MAIN */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 md:p-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;