import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Send, Clock, CheckCircle2, XCircle, FileText, Sparkles } from 'lucide-react';

export const StudentLeaveApp: React.FC = () => {
  const { leaveRequests, addLeaveRequest, currentStudent, language } = useApp();
  const isBN = language === 'BN';

  const myLeaves = leaveRequests.filter(l => l.applicantId === currentStudent.id);

  const [form, setForm] = useState({
    leaveType: 'Medical' as const,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    reason: ''
  });

  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addLeaveRequest({
      applicantId: currentStudent.id,
      applicantName: currentStudent.name,
      applicantRole: 'STUDENT',
      department: currentStudent.department,
      leaveType: form.leaveType,
      startDate: form.startDate,
      endDate: form.endDate,
      reason: form.reason
    });
    setForm({
      leaveType: 'Medical',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      reason: ''
    });
    setSubmittedSuccess(true);
    setTimeout(() => setSubmittedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
          {isBN ? 'ছুটির আবেদন ও ট্র্যাকিং' : 'Absence & Leave Applications'}
        </h1>
        <p className="text-xs text-slate-500">
          {isBN 
            ? 'অসুস্থতাজনিত বা জরুরি প্রয়োজনে ছুটির দরখাস্ত জমা দিন এবং অধ্যক্ষ মহোদয়ের অনুমোদনের অবস্থা পর্যবেক্ষণ করুন।' 
            : 'Apply for medical or personal absence leaves and track Principal approval status.'}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Application Form */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
            {isBN ? 'নতুন ছুটির আবেদন ফর্ম' : 'Submit New Leave Application'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                {isBN ? 'ছুটির ধরন' : 'Leave Category'}
              </label>
              <select
                value={form.leaveType}
                onChange={e => setForm({ ...form, leaveType: e.target.value as any })}
                className="mt-1 w-full rounded-xl border p-2.5 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="Medical">{isBN ? 'চিকিৎসাজনিত ছুটি (Medical Leave)' : 'Medical Leave'}</option>
                <option value="Casual">{isBN ? 'নৈমিত্তিক ছুটি (Casual Leave)' : 'Casual Leave'}</option>
                <option value="Academic">{isBN ? 'একাডেমিক ইভেন্ট ছুটি (Academic Leave)' : 'Academic Event Leave'}</option>
                <option value="Emergency">{isBN ? 'জরুরি পারিবারিক কারণ (Family Emergency)' : 'Family Emergency'}</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  {isBN ? 'শুরুর তারিখ' : 'Start Date'}
                </label>
                <input
                  type="date"
                  required
                  value={form.startDate}
                  onChange={e => setForm({ ...form, startDate: e.target.value })}
                  className="mt-1 w-full rounded-xl border p-2.5 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  {isBN ? 'শেষের তারিখ' : 'End Date'}
                </label>
                <input
                  type="date"
                  required
                  value={form.endDate}
                  onChange={e => setForm({ ...form, endDate: e.target.value })}
                  className="mt-1 w-full rounded-xl border p-2.5 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                {isBN ? 'ছুটির সুনির্দিষ্ট কারণ / বিবরণ' : 'Reason / Description'}
              </label>
              <textarea
                required
                rows={4}
                value={form.reason}
                onChange={e => setForm({ ...form, reason: e.target.value })}
                placeholder={isBN ? 'ছুটি চাওয়ার বিস্তারিত কারণ এখানে লিখুন...' : 'Provide detailed justification for leave request...'}
                className="mt-1 w-full rounded-xl border p-2.5 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            {submittedSuccess && (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                <Sparkles className="h-4 w-4" />
                <span>{isBN ? 'ছুটির আবেদন পর্যালোচনার জন্য জমা দেওয়া হয়েছে!' : 'Leave application submitted to Principal for review!'}</span>
              </div>
            )}

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-xs font-semibold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              <Send className="h-4 w-4" />
              <span>{isBN ? 'ছুটির আবেদন জমা দিন' : 'Submit Leave Request'}</span>
            </button>
          </form>
        </div>

        {/* Leave Status History */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
            {isBN ? 'আমার জমাকৃত আবেদনসমূহ' : 'My Submitted Leave Applications'}
          </h2>

          <div className="space-y-3">
            {myLeaves.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                {isBN ? 'কোনো পূর্ববর্তী ছুটির আবেদন নেই।' : 'No leave applications submitted yet.'}
              </div>
            ) : (
              myLeaves.map(l => (
                <div
                  key={l.id}
                  className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 text-xs dark:border-slate-800 dark:bg-slate-800/40"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {l.leaveType} {isBN ? 'ছুটি' : 'Leave'}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        l.status === 'APPROVED'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : l.status === 'REJECTED'
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {l.status === 'APPROVED' ? (isBN ? 'অনুমোদিত' : 'APPROVED') : l.status === 'REJECTED' ? (isBN ? 'প্রত্যাখ্যাত' : 'REJECTED') : (isBN ? 'বিবেচনাধীন' : 'PENDING')}
                    </span>
                  </div>

                  <div className="mt-1 text-[11px] text-slate-400 font-mono">
                    📅 {l.startDate} {isBN ? 'হতে' : 'to'} {l.endDate}
                  </div>
                  <p className="mt-2 text-slate-600 dark:text-slate-300">{l.reason}</p>

                  {l.adminRemark && (
                    <div className="mt-2 text-[10px] text-slate-500 font-semibold border-t border-slate-200/60 pt-2 dark:border-slate-700">
                      {isBN ? 'মন্তব্য' : 'Remark'}: {l.adminRemark}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
