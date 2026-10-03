import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sliders, Database, RefreshCw, CheckCircle2, Shield, HardDrive } from 'lucide-react';

export const SystemSettingsLogs: React.FC = () => {
  const { systemLogs, language } = useApp();
  const isBN = language === 'BN';
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupSuccess, setBackupSuccess] = useState(false);

  const handleBackup = () => {
    setIsBackingUp(true);
    setBackupSuccess(false);
    setTimeout(() => {
      setIsBackingUp(false);
      setBackupSuccess(true);
      setTimeout(() => setBackupSuccess(false), 4000);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
          {isBN ? 'সিস্টেম অডিট লগ ও ডাটাবেস ব্যবস্থাপনা' : 'System Audit Logs & Database Management'}
        </h1>
        <p className="text-xs text-slate-500">
          {isBN
            ? 'রিয়েল-টাইম সিস্টেম ইভেন্ট মনিটরিং, নিরাপত্তা অডিট লগ এবং স্বয়ংক্রিয় ডাটাবেস ব্যাকআপ ব্যবস্থাপনা।'
            : 'Monitor real-time system events, audit security logs, and perform automated database backups.'}
        </p>
      </div>

      {/* Database Backup Tool */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                {isBN ? 'ফায়ারবেস ও ক্লাউড ডাটাবেস স্ন্যাপশট ব্যাকআপ' : 'Firestore & Database Cloud Backup'}
              </h2>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {isBN 
                ? 'সর্বশেষ ব্যাকআপ: আজ ১৮:৩০:১১ (২.৪ GB এনক্রিপ্টেড ব্যাকআপ স্টোরেজ)' 
                : 'Last full snapshot backup: Today at 18:30:11 (2.4 GB encrypted storage)'}
            </p>
          </div>

          <button
            onClick={handleBackup}
            disabled={isBackingUp}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-indigo-700 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isBackingUp ? 'animate-spin' : ''}`} />
            {isBackingUp 
              ? (isBN ? 'স্ন্যাপশট তৈরি হচ্ছে...' : 'Creating Snapshot...') 
              : (isBN ? 'এখনই ব্যাকআপ নিন' : 'Backup Database Now')}
          </button>
        </div>

        {backupSuccess && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            <CheckCircle2 className="h-4 w-4" /> 
            {isBN 
              ? 'স্ন্যাপশট সফলভাবে সম্পন্ন হয়েছে! ক্লাউড স্টোরেজে রিস্টোর পয়েন্ট সংরক্ষিত।' 
              : 'Snapshot created successfully! Restored point created at Cloud Storage.'}
          </div>
        )}
      </div>

      {/* Logs Table */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 font-bold text-sm text-slate-900 dark:text-white">
          {isBN ? 'সিস্টেম ইভেন্ট ও অডিট অ্যাক্টিভিটি লগ' : 'System Event & Audit Logs'}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-800/60">
              <tr>
                <th className="p-4 font-semibold">{isBN ? 'সময়' : 'Timestamp'}</th>
                <th className="p-4 font-semibold">{isBN ? 'ব্যবহারকারী' : 'User'}</th>
                <th className="p-4 font-semibold">{isBN ? 'অ্যাকশন' : 'Action'}</th>
                <th className="p-4 font-semibold">{isBN ? 'বিবরণ' : 'Details'}</th>
                <th className="p-4 font-semibold">{isBN ? 'আইপি অ্যাড্রেস' : 'IP Address'}</th>
                <th className="p-4 font-semibold">{isBN ? 'স্ট্যাটাস' : 'Status'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {systemLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30">
                  <td className="p-4 text-slate-500">{log.timestamp}</td>
                  <td className="p-4 font-sans font-bold text-slate-800 dark:text-slate-200">{log.user}</td>
                  <td className="p-4">
                    <span className="rounded bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 font-sans text-slate-600 dark:text-slate-300">{log.details}</td>
                  <td className="p-4 text-slate-400">{log.ipAddress}</td>
                  <td className="p-4">
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
