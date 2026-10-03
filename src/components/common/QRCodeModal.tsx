import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserAvatar } from './UserAvatar';
import { X, QrCode, Download, ShieldCheck, Sparkles, GraduationCap } from 'lucide-react';

export const QRCodeModal: React.FC = () => {
  const { isQRModalOpen, setIsQRModalOpen, currentStudent, language } = useApp();
  const isBN = language === 'BN';

  if (!isQRModalOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <button
          onClick={() => setIsQRModalOpen(false)}
          className="absolute right-4 top-4 rounded-full bg-slate-100 p-1.5 text-slate-400 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header Badge */}
        <div className="text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-500/30">
            <GraduationCap className="h-6 w-6" />
          </div>
          <h3 className="mt-2 text-base font-bold text-slate-900 dark:text-white">
            {isBN ? 'ডিজিটাল ক্যাম্পাস শিক্ষার্থী আইডি' : 'Digital Campus Student ID'}
          </h3>
          <p className="text-[11px] font-medium text-slate-400">
            {isBN ? 'অফিসিয়াল ডিজিটাল পরিচয়পত্র' : 'Official Identity Credentials'}
          </p>
        </div>

        {/* Physical ID Card Mockup */}
        <div className="mt-5 overflow-hidden rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 p-5 text-white shadow-xl relative">
          <div className="absolute top-0 right-0 h-24 w-24 bg-indigo-500/10 blur-xl"></div>

          {/* Card Top Branding */}
          <div className="flex items-center justify-between border-b border-indigo-800/60 pb-3">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-200">
                {isBN ? 'ক্যাম্পাস ডিজিটাল ম্যানেজমেন্ট' : 'Academia University'}
              </span>
            </div>
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          </div>

          {/* Body Info */}
          <div className="mt-4 flex gap-4">
            <UserAvatar
              src={currentStudent.avatar}
              name={currentStudent.name}
              size="xl"
            />
            <div className="flex-1 space-y-1 text-left">
              <div className="text-sm font-bold text-white leading-tight">
                {currentStudent.name}
              </div>
              <div className="text-[11px] font-medium text-indigo-300">
                {currentStudent.department}
              </div>
              <div className="pt-1 text-[10px] text-slate-300 font-mono">
                <div>{isBN ? 'রোল' : 'ID'}: {currentStudent.rollNumber}</div>
                <div>{isBN ? 'রেজিস্ট্রেশন' : 'REG'}: {currentStudent.registrationNumber}</div>
                <div>{isBN ? 'সেমিস্টার' : 'SEM'}: {currentStudent.semester} ({currentStudent.section})</div>
              </div>
            </div>
          </div>

          {/* QR Code Barcode Box */}
          <div className="mt-4 flex items-center justify-between rounded-xl bg-white p-3 text-slate-900 shadow-inner">
            <div className="space-y-0.5 text-left">
              <div className="text-[9px] font-bold text-slate-400 uppercase">
                {isBN ? 'ভেরিফিকেশন কোড' : 'Verification Code'}
              </div>
              <div className="text-[11px] font-mono font-bold text-indigo-950">
                VERIFIED-2026-REG894
              </div>
              <div className="text-[9px] text-emerald-600 font-semibold flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> {isBN ? 'ক্যাম্পাস এক্সেস অনুমোদিত' : 'Campus Access Granted'}
              </div>
            </div>
            <div className="h-12 w-12 rounded bg-slate-100 p-1 flex items-center justify-center border border-slate-300">
              <QrCode className="h-10 w-10 text-slate-900" />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-5 flex gap-2">
          <button
            onClick={handlePrint}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/25 hover:bg-indigo-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            {isBN ? 'কার্ড ডাউনলোড / প্রিন্ট করুন' : 'Download / Print ID Card'}
          </button>
        </div>
      </div>
    </div>
  );
};
