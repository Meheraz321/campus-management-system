import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Calendar,
  CheckCircle2,
  FileText,
  Clock,
  MapPin,
  Users,
  Bell,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  const {
    currentTeacher,
    routines,
    submissions,
    notices,
    setActiveTab,
    language
  } = useApp();

  const isBN = language === 'BN';
  const pendingSubmissions = submissions.filter(s => s.status === 'SUBMITTED').length;
  const todaysClasses = routines.filter(r => r.day === 'Monday' || r.day === 'Wednesday');

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-800 to-slate-900 p-6 text-white shadow-xl">
        <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-emerald-500/20 blur-3xl"></div>
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/30 px-3 py-1 text-xs font-semibold text-emerald-200 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              {isBN ? 'শিক্ষক ও ফ্যাকাল্টি মেম্বার পোর্টাল' : 'Faculty Member Portal'}
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              {isBN ? `স্বাগতম, ${currentTeacher.name}` : `Welcome, ${currentTeacher.name}`}
            </h1>
            <p className="mt-1 text-xs text-emerald-200/90 sm:text-sm">
              {currentTeacher.designation} • {currentTeacher.department}. {isBN ? `আপনার মূল্যায়নের জন্য ${pendingSubmissions} টি অ্যাসাইনমেন্ট জমা আছে।` : `You have ${pendingSubmissions} pending assignment submission(s) to grade.`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('attendance_teacher')}
              className="flex items-center gap-2 rounded-xl bg-white px-3.5 py-2 text-xs font-semibold text-slate-900 shadow-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              {isBN ? 'আজকের ক্লাসের হাজিরা নিন' : "Mark Today's Attendance"}
            </button>
            <button
              onClick={() => setActiveTab('assignments_teacher')}
              className="flex items-center gap-2 rounded-xl bg-emerald-600/80 px-3.5 py-2 text-xs font-semibold text-white border border-emerald-400/40 hover:bg-emerald-600 transition-colors cursor-pointer"
            >
              <FileText className="h-4 w-4" />
              {isBN ? `অ্যাসাইনমেন্ট মূল্যায়ন (${pendingSubmissions})` : `Review Assignments (${pendingSubmissions})`}
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              {isBN ? 'আজকের ক্লাস' : "Today's Classes"}
            </span>
            <Clock className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            {todaysClasses.length} {isBN ? 'টি ক্লাস' : 'Sessions'}
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            {isBN ? 'আজকের জন্য নির্ধারিত' : 'Scheduled for today'}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              {isBN ? 'জমাকৃত অ্যাসাইনমেন্ট' : 'Pending Submissions'}
            </span>
            <FileText className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            {pendingSubmissions}
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            {isBN ? 'নম্বর ও ফিডব্যাক প্রয়োজন' : 'Needs grading and feedback'}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              {isBN ? 'অফিস কনসালটেশন সময়' : 'Office Hours'}
            </span>
            <Users className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="mt-2 text-sm font-bold text-slate-900 dark:text-white">
            {currentTeacher.officeHours}
          </div>
          <div className="mt-1 text-[11px] text-slate-400">{currentTeacher.officeRoom}</div>
        </div>
      </div>

      {/* Today's Schedule & Quick Actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Scheduled Routine */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                {isBN ? 'আমার ক্লাস রুটিন' : 'Assigned Class Timetable'}
              </h2>
              <p className="text-[11px] text-slate-400">
                {isBN ? 'আসন্ন লেকচারের তালিকা' : 'Your upcoming lectures'}
              </p>
            </div>
            <button
              onClick={() => setActiveTab('routine_teacher')}
              className="text-xs font-semibold text-emerald-600 hover:underline cursor-pointer"
            >
              {isBN ? 'সম্পূর্ণ রুটিন দেখুন' : 'Full Schedule'}
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {todaysClasses.map(c => (
              <div
                key={c.id}
                className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5 dark:border-slate-800 dark:bg-slate-800/40"
              >
                <div>
                  <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {c.day}
                  </span>
                  <div className="mt-1 text-xs font-bold text-slate-900 dark:text-white">
                    {c.subjectCode}: {c.subjectName}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {c.semester} ({c.section}) • {c.roomNumber}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                    {c.timeSlot}
                  </span>
                  <button
                    onClick={() => setActiveTab('attendance_teacher')}
                    className="mt-2 block rounded-xl bg-emerald-600 px-3 py-1 text-[10px] font-semibold text-white hover:bg-emerald-700 cursor-pointer"
                  >
                    {isBN ? 'হাজিরা নিন' : 'Mark Roll'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notices */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                {isBN ? 'ক্যাম্পাস নোটিশবোর্ড' : 'Campus Notices'}
              </h2>
              <p className="text-[11px] text-slate-400">
                {isBN ? 'অফিসিয়াল সার্কুলার ও নোটিশ' : 'Official faculty circulars'}
              </p>
            </div>
            <Bell className="h-4 w-4 text-emerald-500" />
          </div>

          <div className="mt-4 space-y-3">
            {notices.slice(0, 3).map(n => (
              <div
                key={n.id}
                className="rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5 dark:border-slate-800 dark:bg-slate-800/40"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {n.title}
                  </span>
                  <span className="text-[10px] text-slate-400">{n.publishDate}</span>
                </div>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                  {n.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
