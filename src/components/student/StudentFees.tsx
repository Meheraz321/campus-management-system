import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DollarSign, CheckCircle2, Clock, Printer, Sparkles } from 'lucide-react';

export const StudentFees: React.FC = () => {
  const { fees, payFee, currentStudent, language } = useApp();
  const isBN = language === 'BN';
  const [receiptModalFee, setReceiptModalFee] = useState<any | null>(null);

  const studentFees = fees.filter(f => f.studentId === currentStudent.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
          {isBN ? 'টিউশন ও সেমিস্টার ফি বিবরণী' : 'Tuition & Fee Statements'}
        </h1>
        <p className="text-xs text-slate-500">
          {isBN 
            ? 'সেমিস্টার টিউশন ফি, পরীক্ষা ফি পর্যালোচনা করুন, অনলাইনে পেমেন্ট করুন এবং রসিদ ডাউনলোড করুন।' 
            : 'Review semester tuition fees, examination dues, pay online, and download receipts.'}
        </p>
      </div>

      {/* Fee Table */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-800/60">
              <tr>
                <th className="p-4 font-semibold">{isBN ? 'ফি বিবরণ' : 'Fee Title'}</th>
                <th className="p-4 font-semibold">{isBN ? 'পরিমাণ' : 'Amount'}</th>
                <th className="p-4 font-semibold">{isBN ? 'পরিশোধের শেষ তারিখ' : 'Due Date'}</th>
                <th className="p-4 font-semibold">{isBN ? 'স্ট্যাটাস' : 'Status'}</th>
                <th className="p-4 font-semibold text-right">{isBN ? 'অ্যাকশন' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {studentFees.map(f => (
                <tr key={f.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30">
                  <td className="p-4 font-bold text-slate-900 dark:text-white">{f.title}</td>
                  <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">
                    ${f.amount}
                  </td>
                  <td className="p-4 text-slate-500 font-mono">{f.dueDate}</td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        f.status === 'PAID'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {f.status === 'PAID' ? (isBN ? 'পরিশোধিত' : 'PAID') : (isBN ? 'বকেয়া' : 'UNPAID')}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {f.status === 'PAID' ? (
                      <button
                        onClick={() => setReceiptModalFee(f)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400 cursor-pointer"
                      >
                        <Printer className="h-3.5 w-3.5" /> {isBN ? 'রসিদ ডাউনলোড' : 'Download Receipt'}
                      </button>
                    ) : (
                      <button
                        onClick={() => payFee(f.id)}
                        className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 shadow-md cursor-pointer transition"
                      >
                        {isBN ? `অনলাইনে পে করুন ($${f.amount})` : `Pay Online ($${f.amount})`}
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
                {isBN ? 'ক্যাম্পাস ডিজিটাল ম্যানেজমেন্ট' : 'Academia University'}
              </div>
              <div className="text-[10px] text-slate-400">{isBN ? 'পরিশোধিত টিউশন ভাউচার' : 'Paid Tuition Voucher'}</div>
              <div className="mt-2 text-xs font-mono font-bold">{receiptModalFee.receiptNo}</div>
            </div>

            <div className="mt-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">{isBN ? 'শিক্ষার্থী' : 'Student'}</span>
                <span className="font-bold">{currentStudent.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{isBN ? 'রোল নং' : 'Roll Number'}</span>
                <span className="font-mono">{currentStudent.rollNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{isBN ? 'ফি বিবরণ' : 'Fee Item'}</span>
                <span>{receiptModalFee.title}</span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-2 font-bold text-sm text-emerald-600">
                <span>{isBN ? 'মোট পরিশোধিত' : 'Total Paid'}</span>
                <span>${receiptModalFee.amount}</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => setReceiptModalFee(null)}
                className="w-full rounded-xl bg-indigo-600 py-2.5 text-xs font-semibold text-white hover:bg-indigo-700 cursor-pointer"
              >
                {isBN ? 'ভাউচার বন্ধ করুন' : 'Close Voucher'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
