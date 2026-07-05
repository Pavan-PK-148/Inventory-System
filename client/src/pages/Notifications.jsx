import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import { 
  Bell, 
  CheckSquare, 
  Layers, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  ShieldAlert,
  Clock,
  LogOut,
  RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';

const getIconConfig = (type) => {
  switch (type) {
    case 'LOW_STOCK': 
      return { icon: AlertTriangle, color: 'text-amber-600 bg-amber-50 border-amber-200' };
    case 'STOCK_IN': 
      return { icon: TrendingUp, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
    case 'STOCK_OUT': 
      return { icon: TrendingDown, color: 'text-amber-500 bg-amber-50 border-amber-200' };
    case 'AUDIT_FLAG': 
      return { icon: ShieldAlert, color: 'text-amber-700 bg-amber-100 border-amber-300' };
    default: 
      return { icon: Layers, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
  }
};

const Notifications = () => {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/notifications');
      setNotifications(data);
    } catch (err) {
      toast.error("Could not sync background system messages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;

    const socketUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
    const socket = io(socketUrl);
    
    socket.emit('register_user', user.id || user._id);

    socket.on('new_notification', (newNotif) => {
      setNotifications((prev) => [newNotif, ...prev]);
      toast.success(`Live Broadcast: ${newNotif.title}`);
    });

    fetchHistory();

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const handleMarkAllRead = async () => {
    try {
      await API.post('/notifications/mark-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      toast.success('All system logs verified.');
    } catch (err) {
      toast.error('Could not clear active flags.');
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f8fafc] text-slate-900 font-sans antialiased">
      
      {/* PERSISTENT SIDEBAR */}
      <Sidebar isOpen={sidebarOpen} />

      {/* CORE FRAME LAYOUT AREA */}
      <div className="flex flex-1 flex-col overflow-hidden">
        
        {/* TOP INTERACTIVE NAVBAR (Matches reference dashboard completely) */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200/80 bg-white px-8 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="h-4 w-4 rounded-full border border-slate-300 bg-slate-50" />
            <div>
              <h2 className="text-sm font-black text-slate-800 leading-none">Welcome, {user?.name || 'Pawan'}</h2>
              <p className="text-[11px] font-medium text-slate-400 mt-1">Enterprise Operations Panel</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Bell Indicator */}
            <div className="relative flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50/50 text-slate-600">
              <Bell size={16} />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              )}
            </div>

            {/* Profile Credentials Segment */}
            <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-slate-800 leading-none">{user?.name || 'Pawan Kalyan'}</p>
                <p className="text-[10px] font-semibold text-slate-400 mt-0.5">{user?.email || 'pavanthundar16@gmail.com'}</p>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                {user?.name?.charAt(0).toUpperCase() || 'P'}
              </div>
            </div>

            {/* Logout Trigger Button */}
            <button 
              onClick={logout}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-rose-600 transition-colors shadow-2xs cursor-pointer"
            >
              <LogOut size={13} />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* WORKSPACE APP WORKSPACE WRAPPER */}
        <main className="flex-1 overflow-y-auto p-8 lg:p-10">
          <div className="max-w-5xl mx-auto">
            
            {/* COMPONENT PAGE TYPOGRAPHY HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6">
              <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-900">System Logs & Live Broadcasts</h1>
                <p className="text-xs font-semibold text-slate-400 mt-1">Real-time telemetry event tracking and cross-operator notification history.</p>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={fetchHistory}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-2xs cursor-pointer"
                >
                  <RefreshCw size={13} className="text-slate-500" />
                  <span>Refresh</span>
                </button>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100/80 transition-all shadow-2xs cursor-pointer"
                  >
                    <CheckSquare size={14} />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>
            </div>

            {/* GRID MODULE LAYOUT CARDS SYSTEM */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* LEFT-SIDE STATS / CARD DECK */}
              <div className="lg:col-span-4 space-y-4">
                <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
                  <h3 className="text-sm font-black text-slate-800 tracking-tight mb-4">Telemetry Deck</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50/50 border border-amber-100">
                      <span className="text-xs font-bold text-amber-800">Unread Operational Alerts</span>
                      <span className="px-2.5 py-0.5 rounded-md text-xs font-black bg-amber-500 text-white shadow-2xs">{unreadCount}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/50 border border-emerald-100">
                      <span className="text-xs font-bold text-emerald-800">Total System Logs Cached</span>
                      <span className="px-2.5 py-0.5 rounded-md text-xs font-black bg-emerald-600 text-white shadow-2xs">{notifications.length}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT-SIDE LEDGER STREAM FEED */}
              <div className="lg:col-span-8 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-4">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <h3 className="text-xs font-black text-slate-400 tracking-wider uppercase">Live Activity Stream</h3>
                </div>

                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-20 w-full bg-slate-100 animate-pulse rounded-xl" />
                    ))}
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 mb-3">
                      <Bell size={20} />
                    </div>
                    <h4 className="text-sm font-black text-slate-800">Ecosystem Synchronized</h4>
                    <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1 font-medium">No outstanding telemetry events or notifications found.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <AnimatePresence initial={false}>
                      {notifications.map((notif, index) => {
                        const config = getIconConfig(notif.type);
                        const IconComponent = config.icon;
                        const isFirstNotification = index === notifications.length - 1;

                        return (
                          <motion.div
                            key={notif._id || notif.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className={`group relative flex gap-4 rounded-xl border p-4 transition-all bg-white ${
                              notif.isRead 
                                ? 'border-slate-100 opacity-60' 
                                : 'border-emerald-500/20 shadow-xs ring-1 ring-emerald-500/5'
                            }`}
                          >
                            {isFirstNotification && (
                              <span className="absolute top-4 right-4 bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-500 rounded-md tracking-wider border border-slate-200">
                                ORIGIN NODE
                              </span>
                            )}

                            {!notif.isRead && !isFirstNotification && (
                              <span className="absolute top-4 right-4 h-1.5 w-1.5 rounded-full bg-amber-500 shadow-xs" />
                            )}

                            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${config.color}`}>
                              <IconComponent size={16} className="stroke-[2.2]" />
                            </div>

                            <div className="flex-1 pr-6">
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-black text-slate-800 tracking-tight leading-none">
                                  {notif.title}
                                </h4>
                                <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-black uppercase tracking-wider ${
                                  notif.type.includes('STOCK_IN') 
                                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' 
                                    : 'bg-amber-50 text-amber-600 border border-amber-200'
                                }`}>
                                  {notif.type.replace('_', ' ')}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1.5">
                                {notif.message}
                              </p>
                              
                              <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-bold mt-2 uppercase tracking-wider">
                                <Clock size={10} className="text-slate-300" />
                                <span>{new Date(notif.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                <span className="text-slate-200">|</span>
                                <span>{new Date(notif.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                )}
              </div>

            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default Notifications;