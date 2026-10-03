import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, Clock, XCircle, Calendar, ShieldCheck } from 'lucide-react';

export const StudentAttendance: React.FC = () => {
  const { currentStudent, attendanceRecords, language } = useApp();
  const isBN = language === 'BN';

  const studentLogs = attendanceRecords.filter(a => a.studentId === currentStudent.id);

  const subjectBreakdown = [
    { code: 'CSE-301', name: 'Data Structures & Algorithms', percentage: 95.0, present: 19, total: 20 },
    { code: 'CSE-302', name: 'Full Stack Web Development', percentage: 92.0, present: 18, total: 20 },
    { code: 'CSE-303', name: 'Database Management Systems', percentage: 90.0, present: 18, total: 20 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
          {isBN ? 'উপস্থিতির ইতিহাস ও বিষয়ভিত্তিক রেকর্ড' : 'Attendance History & Subject Ratio'}
        </h1>
        <p className="text-xs text-slate-500">
          {isBN 
            ? 'পরীক্ষায় অংশগ্রহণের যোগ্যতা ধরে রাখতে সকল বিষয়ে ন্যূনতম ৮০% উপস্থিতি বজায় রাখুন।' 
            : 'Monitor your percentage across all courses to maintain minimum 80% exam eligibility.'}
        </p>
      </div>

      {/* Overall Gauge Card */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase">
              {isBN ? 'গড় উপস্থিতি হার' : 'Total Attendance Average'}
            </div>
            <div className="mt-1 text-3xl font-extrabold text-slate-900 dark:text-white">
              {currentStudent.attendancePercentage}%
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
              <ShieldCheck className="h-4 w-4" />
              <span>{isBN ? 'সেমিস্টার ও মিডটার্ম পরীক্ষার জন্য উপযুক্ত' : 'Eligible for Midterm & Semester Examinations'}</span>
            </div>
          </div>

          <div className="h-3 w-full sm:w-64 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full"
              style={{ width: `${currentStudent.attendancePercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Subject Breakdown */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {subjectBreakdown.map(sub => (
          <div
            key={sub.code}
            className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <span className="rounded bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-mono">
              {sub.code}
            </span>
            <h3 className="mt-2 text-xs font-bold text-slate-900 dark:text-white">
              {sub.name}
            </h3>
            <div className="mt-3 flex items-baseline justify-between text-xs">
              <span className="font-extrabold text-slate-900 dark:text-white">{sub.percentage}%</span>
              <span className="text-slate-400 font-mono">
                {sub.present}/{sub.total} {isBN ? 'ক্লাস' : 'Classes'}
              </span>
            </div>
            <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full"
                style={{ width: `${sub.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Daily Logs Table */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
          {isBN ? 'দৈনিক উপস্থিতি লগ' : 'Daily Attendance Logs'}
        </h2>

        <div className="space-y-2">
          {studentLogs.map(log => (
            <div
              key={log.id}
              className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-3 text-xs dark:border-slate-800 dark:bg-slate-800/40"
            >
              <div>
                <span className="font-bold text-slate-900 dark:text-white">{log.subjectCode}</span>
                <span className="ml-2 font-mono text-slate-400">{log.date}</span>
              </div>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                  log.status === 'PRESENT'
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                }`}
              >
                {log.status === 'PRESENT' ? (isBN ? 'উপস্থিত' : 'PRESENT') : (isBN ? 'অনুপস্থিত' : 'ABSENT')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
