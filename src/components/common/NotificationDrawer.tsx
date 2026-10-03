import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  X,
  CheckCheck,
  FileText,
  Calendar,
  CheckCircle2,
  Award,
  Sparkles
} from 'lucide-react';

export const NotificationDrawer: React.FC = () => {
  const {
    isNotifOpen,
    setIsNotifOpen,
    notifications,
    markNotificationRead,
    clearAllNotifications,
    setActiveTab,
    language
  } = useApp();

  const isBN = language === 'BN';

  if (!isNotifOpen) return null;

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'assignment':
        return <FileText className="h-4 w-4 text-violet-500" />;
      case 'attendance':
        return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case 'result':
        return <Award className="h-4 w-4 text-amber-500" />;
      case 'notice':
        return <Bell className="h-4 w-4 text-indigo-500" />;
      default:
        return <Sparkles className="h-4 w-4 text-sky-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="flex h-full w-full max-w-sm flex-col bg-white shadow-2xl dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              {isBN ? 'নোটিফিকেশন ও অ্যালার্ট' : 'Notifications & Alerts'}
            </h2>
            <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              {notifications.length}
            </span>
          </div>
          <button
            onClick={() => setIsNotifOpen(false)}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Toolbar */}
        {notifications.length > 0 && (
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-4 py-2 dark:border-slate-800/80 dark:bg-slate-800/40 text-[11px]">
            <span className="font-semibold text-slate-500">
              {isBN ? 'ইনবক্স অ্যালার্ট সেন্টার' : 'Inbox Alert Center'}
            </span>
            <button
              onClick={clearAllNotifications}
              className="flex items-center gap-1 font-semibold text-rose-600 hover:underline dark:text-rose-400"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              {isBN ? 'সব মুছুন' : 'Clear All'}
            </button>
          </div>
        )}

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              {isBN ? 'বর্তমানে কোনো নতুন নোটিফিকেশন নেই।' : 'No new notifications right now.'}
            </div>
          ) : (
            notifications.map(notif => (
              <div
                key={notif.id}
                onClick={() => {
                  markNotificationRead(notif.id);
                  if (notif.linkTab) setActiveTab(notif.linkTab);
                  setIsNotifOpen(false);
                }}
                className={`group cursor-pointer rounded-xl border p-3 transition-all ${
                  notif.read
                    ? 'border-slate-100 bg-slate-50/50 opacity-70 dark:border-slate-800 dark:bg-slate-800/30'
                    : 'border-indigo-100 bg-indigo-50/40 hover:border-indigo-200 dark:border-indigo-950 dark:bg-indigo-950/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg bg-white shadow-sm dark:bg-slate-800">
                    {getNotifIcon(notif.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                        {notif.title}
                      </h3>
                      <span className="text-[10px] text-slate-400">{notif.timestamp}</span>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-300">
                      {notif.message}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
