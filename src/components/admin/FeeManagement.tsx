import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DollarSign, CheckCircle2, Clock, FileText, Download, Printer } from 'lucide-react';

export const FeeManagement: React.FC = () => {
  const { fees, payFee, language } = useApp();
  const isBN = language === 'BN';
  const [filter, setFilter] = useState<'ALL' | 'PAID' | 'PENDING' | 'OVERDUE'>('ALL');
  const [receiptModalFee, setReceiptModalFee] = useState<any | null>(null);

  const filteredFees = fees.filter(f => (filter === 'ALL' ? true : f.status === filter));

  const filterLabels = {
    ALL: isBN ? 'সকল' : 'ALL',
    PAID: isBN ? 'পরিশোধিত' : 'PAID',
    PENDING: isBN ? 'বকেয়া' : 'PENDING',
    OVERDUE: isBN ? 'মেয়াদোত্তীর্ণ' : 'OVERDUE'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
            {isBN ? 'ক্যাম্পাস টিউশন ও ফি হিসাবরক্ষণ' : 'Campus Tuition & Fee Accounting'}
          </h1>
          <p className="text-xs text-slate-500">
            {isBN 
              ? 'শিক্ষার্থীদের ফি খাতা, লেনদেনের স্থিতি এবং অফিসিয়াল ভাউচার রসিদ ব্যবস্থাপনা।'
              : 'Track student fee ledgers, payment statuses, and generate official receipts.'}
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900">
          {(['ALL', 'PAID', 'PENDING', 'OVERDUE'] as const).map(st => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                filter === st
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              {filterLabels[st]}
            </button>
          ))}
        </div>
      </div>

      {/* Fee Table */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-800/60">
              <tr>
                <th className="p-4 font-semibold">{isBN ? 'শিক্ষার্থীর নাম ও রোল' : 'Student Name & Roll'}</th>
                <th className="p-4 font-semibold">{isBN ? 'ফি শিরোনাম' : 'Fee Title'}</th>
                <th className="p-4 font-semibold">{isBN ? 'পরিমাণ' : 'Amount'}</th>
                <th className="p-4 font-semibold">{isBN ? 'পরিশোধের শেষ তারিখ' : 'Due Date'}</th>
                <th className="p-4 font-semibold">{isBN ? 'অবস্থা' : 'Status'}</th>
                <th className="p-4 font-semibold text-right">{isBN ? 'পদক্ষেপ' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredFees.map(f => (
                <tr key={f.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30">
                  <td className="p-4">
                    <div className="font-bold text-slate-900 dark:text-white">{f.studentName}</div>
                    <div className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400">
                      {f.rollNumber} • {f.department}
                    </div>
                  </td>
                  <td className="p-4 font-medium text-slate-800 dark:text-slate-200">{f.title}</td>
                  <td className="p-4 font-bold text-slate-900 dark:text-white">৳{f.amount}</td>
                  <td className="p-4 text-slate-500 font-mono">{f.dueDate}</td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        f.status === 'PAID'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : f.status === 'OVERDUE'
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {f.status === 'PAID' ? (isBN ? 'পরিশোধিত' : 'PAID') : f.status === 'OVERDUE' ? (isBN ? 'মেয়াদোত্তীর্ণ' : 'OVERDUE') : (isBN ? 'বকেয়া' : 'PENDING')}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {f.status === 'PAID' ? (
                      <button
                        onClick={() => setReceiptModalFee(f)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
                      >
                        <Printer className="h-3.5 w-3.5" /> {isBN ? 'রসিদ প্রিন্ট করুন' : 'Print Receipt'}
                      </button>
                    ) : (
                      <button
                        onClick={() => payFee(f.id)}
                        className="rounded-xl bg-emerald-600 px-3 py-1 text-[11px] font-semibold text-white hover:bg-emerald-700"
                      >
                        {isBN ? 'পরিশোধিত চিহ্নিত করুন' : 'Mark as Paid'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Receipt Modal */}
      {receiptModalFee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white">
            <div className="border-b border-dashed border-slate-200 pb-4 dark:border-slate-800 text-center">
              <div className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Academia University
              </div>
              <div className="text-[10px] text-slate-400">{isBN ? 'অফিসিয়াল পেমেন্ট ভাউচার' : 'Official Payment Voucher'}</div>
              <div className="mt-2 text-xs font-mono font-bold">{receiptModalFee.receiptNo}</div>
            </div>

            <div className="mt-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">{isBN ? 'শিক্ষার্থী' : 'Student'}</span>
                <span className="font-bold">{receiptModalFee.studentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{isBN ? 'রোল নম্বর' : 'Roll Number'}</span>
                <span className="font-mono">{receiptModalFee.rollNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{isBN ? 'ফি বিবরণ' : 'Fee Item'}</span>
                <span>{receiptModalFee.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{isBN ? 'পরিশোধের তারিখ' : 'Payment Date'}</span>
                <span>{receiptModalFee.paidDate}</span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-2 font-bold text-sm text-emerald-600">
                <span>{isBN ? 'মোট পরিশোধিত' : 'Total Paid'}</span>
                <span>৳{receiptModalFee.amount}</span>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <button
                onClick={() => setReceiptModalFee(null)}
                className="w-full rounded-xl bg-indigo-600 py-2.5 text-xs font-semibold text-white hover:bg-indigo-700"
              >
                {isBN ? 'রসিদ বন্ধ করুন' : 'Close Receipt'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
