import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FileCheck2, CheckCircle2, XCircle, Clock, MessageSquare } from 'lucide-react';

export const LeaveApprovals: React.FC = () => {
  const { leaveRequests, updateLeaveStatus, language } = useApp();
  const isBN = language === 'BN';
  const [remarks, setRemarks] = useState<{ [key: string]: string }>({});

  const handleApprove = (id: string) => {
    updateLeaveStatus(id, 'APPROVED', remarks[id] || (isBN ? 'প্রিন্সিপাল কর্তৃক অনুমোদিত' : 'Approved by Principal'));
  };

  const handleReject = (id: string) => {
    updateLeaveStatus(id, 'REJECTED', remarks[id] || (isBN ? 'যথাযথ কারণ প্রদর্শনে ব্যর্থ।' : 'Insufficient justification provided.'));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
          {isBN ? 'ছুটির আবেদন ও অনুমোদন' : 'Leave Application Approvals'}
        </h1>
        <p className="text-xs text-slate-500">
          {isBN 
            ? 'শিক্ষক ও শিক্ষার্থীদের দাখিলকৃত ছুটির আবেদনসমূহ পর্যালোচনা ও অনুমোদন করুন।'
            : 'Review absence and leave applications submitted by students and faculty members.'}
        </p>
      </div>

      {/* Leave Cards List */}
      <div className="space-y-4">
        {leaveRequests.map(req => (
          <div
            key={req.id}
            className={`rounded-3xl border p-5 shadow-sm transition-all ${
              req.status === 'PENDING'
                ? 'border-indigo-200/80 bg-white dark:border-slate-800 dark:bg-slate-900'
                : 'border-slate-200/60 bg-slate-50/50 dark:border-slate-800/60 dark:bg-slate-900/40'
            }`}
          >
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      req.applicantRole === 'TEACHER'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                    }`}
                  >
                    {req.applicantRole === 'TEACHER' ? (isBN ? 'শিক্ষক' : 'TEACHER') : (isBN ? 'শিক্ষার্থী' : 'STUDENT')}
                  </span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {req.applicantName}
                  </span>
                  <span className="text-[11px] text-slate-400">({req.department})</span>
                </div>

                <div className="mt-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {req.leaveType}: {req.startDate} {isBN ? 'হতে' : 'to'} {req.endDate}
                </div>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">{req.reason}</p>
              </div>

              {/* Status Badge or Controls */}
              <div>
                {req.status === 'PENDING' ? (
                  <div className="flex flex-col gap-2 sm:items-end">
                    <input
                      type="text"
                      placeholder={isBN ? "মন্তব্য লিখুন (ঐচ্ছিক)..." : "Add admin remark..."}
                      value={remarks[req.id] || ''}
                      onChange={e => setRemarks({ ...remarks, [req.id]: e.target.value })}
                      className="w-full sm:w-64 rounded-xl border border-slate-200 p-2 text-xs outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleReject(req.id)}
                        className="flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-300"
                      >
                        <XCircle className="h-3.5 w-3.5" /> {isBN ? 'প্রত্যাখ্যান' : 'Reject'}
                      </button>
                      <button
                        onClick={() => handleApprove(req.id)}
                        className="flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-md hover:bg-emerald-700"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" /> {isBN ? 'অনুমোদন' : 'Approve'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-right">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
                        req.status === 'APPROVED'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                      }`}
                    >
                      {req.status === 'APPROVED' ? (isBN ? 'অনুমোদিত' : 'APPROVED') : (isBN ? 'প্রত্যাখ্যাত' : 'REJECTED')}
                    </span>
                    {req.adminRemark && (
                      <div className="mt-1 text-[10px] text-slate-400">
                        {isBN ? 'মন্তব্য: ' : 'Remark: '}{req.adminRemark}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
