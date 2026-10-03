import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserAvatar } from '../common/UserAvatar';
import {
  GraduationCap,
  Calendar,
  CheckCircle2,
  FileText,
  Award,
  Clock,
  QrCode,
  Bell,
  ArrowRight,
  Sparkles,
  BookOpen,
  Camera
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const {
    currentStudent,
    routines,
    assignments,
    notices,
    materials,
    setActiveTab,
    setIsQRModalOpen,
    language
  } = useApp();

  const isBN = language === 'BN';
  const pendingAssignmentsCount = assignments.length;
  const todaysClasses = routines.filter(r => r.day === 'Monday' || r.day === 'Wednesday');
  const featuredMaterials = materials.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Student Welcome Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 p-6 text-white shadow-xl">
        <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-indigo-500/20 blur-3xl"></div>
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <div className="relative">
              <UserAvatar
                src={currentStudent.avatar}
                name={currentStudent.name}
                size="xl"
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/30 px-3 py-0.5 text-[11px] font-semibold text-indigo-200 backdrop-blur-md">
                <Sparkles className="h-3 w-3 text-amber-300" />
                {isBN ? 'শিক্ষার্থী স্টাডি পোর্টাল' : 'Student Portal'}
              </div>
              <h1 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
                {isBN ? `স্বাগতম, ${currentStudent.name}` : `Welcome, ${currentStudent.name}`}
              </h1>
              <p className="text-xs text-indigo-200/90 font-mono">
                {currentStudent.rollNumber} • {currentStudent.department}
              </p>
              {!currentStudent.avatar && (
                <button
                  type="button"
                  onClick={() => setActiveTab('profile')}
                  className="mt-1.5 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 hover:text-white border border-amber-400/30 text-[11px] font-medium transition cursor-pointer"
                >
                  <Camera className="h-3 w-3" />
                  <span>{isBN ? 'প্রোফাইল ছবি যুক্ত করুন' : 'Add Profile Photo'}</span>
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsQRModalOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-white px-3.5 py-2 text-xs font-semibold text-slate-900 shadow-lg hover:bg-slate-100 transition-colors"
            >
              <QrCode className="h-4 w-4 text-indigo-600" />
              {isBN ? 'ডিজিটাল আইডি কার্ড' : 'Digital Student ID'}
            </button>
            <button
              onClick={() => setActiveTab('assignments_student')}
              className="flex items-center gap-2 rounded-xl bg-indigo-600/80 px-3.5 py-2 text-xs font-semibold text-white border border-indigo-400/40 hover:bg-indigo-600 transition-colors"
            >
              <FileText className="h-4 w-4" />
              {isBN ? `বাকি অ্যাসাইনমেন্ট (${pendingAssignmentsCount})` : `Pending Tasks (${pendingAssignmentsCount})`}
            </button>
          </div>
        </div>
      </div>

      {/* Quick KPI Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              {isBN ? 'ক্লাস উপস্থিতি' : 'Attendance'}
            </span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            {currentStudent.attendancePercentage}%
          </div>
          <div className="mt-1 text-[10px] font-semibold text-emerald-600">
            {isBN ? '৮৫% আবশ্যকতার চেয়ে বেশি' : 'Above 85% requirement'}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              {isBN ? 'বর্তমান সিজিপিএ (CGPA)' : 'Current CGPA'}
            </span>
            <Award className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            {currentStudent.cgpa.toFixed(2)}
          </div>
          <div className="mt-1 text-[10px] font-semibold text-indigo-600">
            {isBN ? 'ডিনস অনার রোল' : "Dean's Honor Roll"}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              {isBN ? 'বর্তমান সেমিস্টার' : 'Current Semester'}
            </span>
            <BookOpen className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="mt-2 text-lg font-bold text-slate-900 dark:text-white">
            {currentStudent.semester}
          </div>
          <div className="mt-1 text-[10px] text-slate-400">
            {isBN ? `সেকশন ${currentStudent.section}` : `Section ${currentStudent.section}`}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              {isBN ? 'শিক্ষাবর্ষ' : 'Academic Session'}
            </span>
            <Calendar className="h-4 w-4 text-violet-500" />
          </div>
          <div className="mt-2 text-sm font-bold text-slate-900 dark:text-white">
            {currentStudent.session}
          </div>
          <div className="mt-1 text-[10px] text-slate-400">
            {isBN ? '৪-বছরের ডিগ্রি কোর্স' : '4-Year Degree'}
          </div>
        </div>
      </div>

      {/* Digital Study Portal Spotlight Banner */}
      <div className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 p-6 text-white shadow-xl dark:border-indigo-950">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-indigo-800/60 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-bold text-indigo-300 border border-indigo-500/30">
              <GraduationCap className="h-3.5 w-3.5 text-indigo-400" />
              {isBN ? 'ডিজিটাল স্টাডি পোর্টাল ও রিসোর্স সেন্টার' : 'Digital Study Portal & Resource Center'}
            </div>
            <h2 className="mt-1 text-lg font-black text-white sm:text-xl">
              {isBN ? 'অনলাইন স্টাডি ম্যাটেরিয়ালস ও ক্লাস লেকচার' : 'Online Study Materials & Class Lectures'}
            </h2>
            <p className="text-xs text-indigo-200/80">
              {isBN ? 'আপনার ডিপার্টমেন্টের লেটেস্ট লেকচার স্লাইড, ভিডিও ক্লাস এবং বিগত বছরের প্রশ্নসমূহ।' : 'Access subject lecture slides, recorded video sessions, and exam materials.'}
            </p>
          </div>

          <button
            onClick={() => setActiveTab('materials_student')}
            className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg hover:bg-indigo-500 transition active:scale-95 border border-indigo-400/40 shrink-0"
          >
            <span>{isBN ? 'সম্পূর্ণ স্টাডি পোর্টাল ওপেন করুন' : 'Open Study Portal'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* 3 Quick Resource Cards */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {featuredMaterials.map(mat => (
            <div
              key={mat.id}
              onClick={() => setActiveTab('materials_student')}
              className="cursor-pointer group rounded-2xl bg-slate-800/80 p-4 border border-slate-700/80 hover:border-indigo-400/60 hover:bg-slate-800 transition-all shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-indigo-300 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800">
                  {mat.subjectCode}
                </span>
                <span className="text-[10px] font-bold text-slate-400">
                  {mat.fileType === 'video' ? (isBN ? '🎥 ভিডিও লেকচার' : '🎥 Video Lecture') : (isBN ? '📄 PDF স্লাইড' : '📄 PDF Slides')}
                </span>
              </div>
              <h4 className="mt-2 text-xs font-bold text-white line-clamp-1 group-hover:text-indigo-300 transition">
                {mat.title}
              </h4>
              <p className="mt-1 text-[11px] text-slate-400 line-clamp-2">
                {mat.description}
              </p>
              <div className="mt-3 flex items-center justify-between text-[10px] text-indigo-300/80 pt-2 border-t border-slate-700/50">
                <span>{mat.teacherName.split(' ')[0]}</span>
                <span className="font-semibold text-indigo-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  {isBN ? 'পড়ুন' : 'Open'} <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Routine & Notice Cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Today's Lectures */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                {isBN ? 'আজকের ক্লাসের সময়সূচী' : "Today's Class Schedule"}
              </h2>
              <p className="text-[11px] text-slate-400">
                {isBN ? `${currentStudent.semester} এর ক্লাস শিডিউল` : `Lectures for ${currentStudent.semester}`}
              </p>
            </div>
            <button
              onClick={() => setActiveTab('routine_student')}
              className="text-xs font-semibold text-indigo-600 hover:underline"
            >
              {isBN ? 'সম্পূর্ণ রুটিন' : 'Full Routine'}
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {todaysClasses.map(c => (
              <div
                key={c.id}
                className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5 dark:border-slate-800 dark:bg-slate-800/40"
              >
                <div>
                  <span className="rounded bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                    {c.subjectCode}
                  </span>
                  <div className="mt-1 text-xs font-bold text-slate-900 dark:text-white">
                    {c.subjectName}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {isBN ? `শিক্ষক: ${c.teacherName} • রুম: ${c.roomNumber}` : `Faculty: ${c.teacherName} • ${c.roomNumber}`}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                    <Clock className="h-3 w-3 text-indigo-500" /> {c.timeSlot}
                  </span>
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
                {isBN ? 'ক্যাম্পাস নোটিশ বোর্ড' : 'Campus Bulletin'}
              </h2>
              <p className="text-[11px] text-slate-400">
                {isBN ? 'জরুরি শিক্ষার্থী নোটিফিকেশন' : 'Important student announcements'}
              </p>
            </div>
            <Bell className="h-4 w-4 text-amber-500" />
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
