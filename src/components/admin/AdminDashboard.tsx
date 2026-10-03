import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  GraduationCap,
  Building2,
  BookOpen,
  CheckCircle2,
  DollarSign,
  Bell,
  FileCheck2,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
  ShieldAlert,
  Clock,
  Database
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const {
    students,
    teachers,
    departments,
    subjects,
    fees,
    leaveRequests,
    systemLogs,
    principalUser,
    setActiveTab,
    setIsSearchOpen,
    language
  } = useApp();

  const isBN = language === 'BN';
  const pendingLeaves = leaveRequests.filter(l => l.status === 'PENDING').length;
  const paidFeesCount = fees.filter(f => f.status === 'PAID').length;
  const totalFeesAmount = fees.reduce((sum, f) => sum + f.amount, 0);
  const paidAmount = fees
    .filter(f => f.status === 'PAID')
    .reduce((sum, f) => sum + f.amount, 0);

  // Dynamic Chart Data based on current registered departments & students
  const departmentAttendanceData = departments.map(d => {
    const deptStudents = students.filter(s => s.department === d.name || s.department === d.code);
    const avgAtt = deptStudents.length > 0
      ? (deptStudents.reduce((acc, curr) => acc + (curr.attendancePercentage || 0), 0) / deptStudents.length)
      : 0;
    return {
      name: d.code,
      attendance: Number(avgAtt.toFixed(1)),
      students: deptStudents.length
    };
  });

  const feePieData = totalFeesAmount > 0 ? [
    { name: isBN ? `পরিশোধিত (৳${paidAmount})` : `Paid ($${paidAmount})`, value: paidAmount, color: '#10B981' },
    {
      name: isBN ? `বকেয়া (৳${totalFeesAmount - paidAmount})` : `Pending ($${totalFeesAmount - paidAmount})`,
      value: Math.max(0, totalFeesAmount - paidAmount),
      color: '#F59E0B'
    }
  ] : [
    { name: isBN ? 'কোনো ফি রেকর্ড নেই' : 'No Fee Records', value: 1, color: '#94A3B8' }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 p-6 text-white shadow-xl">
        <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-indigo-500/20 blur-3xl"></div>
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/30 px-3 py-1 text-xs font-semibold text-indigo-200 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              {isBN ? 'প্রিন্সিপাল ও কেন্দ্রীয় অ্যাডমিন ড্যাশবোর্ড' : 'Principal Administration Dashboard'}
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              {isBN ? `স্বাগতম, ${principalUser?.name || 'অ্যাডমিনিস্ট্রেটর'}` : `Welcome, ${principalUser?.name || 'Administrator'}`}
            </h1>
            <p className="mt-1 text-xs text-indigo-200/90 sm:text-sm">
              {isBN 
                ? `ক্যাম্পাসের সকল কার্যক্রম স্বাভাবিকভাবে পরিচালিত হচ্ছে। ${pendingLeaves}টি ছুটির আবেদন পর্যালোচনার অপেক্ষায় রয়েছে।`
                : `All campus operational modules are functioning smoothly. ${pendingLeaves} pending leave approval(s) require review.`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('registered_users_db')}
              className="flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-3.5 py-2 text-xs shadow-lg shadow-emerald-500/30 transition-colors"
            >
              <Database className="h-4 w-4" />
              {isBN ? 'নিবন্ধিত ডাটাবেস ও এক্সপোর্ট' : 'Registered DB & Exports'}
            </button>
            <button
              onClick={() => setActiveTab('push_notif')}
              className="flex items-center gap-2 rounded-xl bg-white px-3.5 py-2 text-xs font-semibold text-slate-900 shadow-lg hover:bg-slate-100 transition-colors"
            >
              <Bell className="h-4 w-4 text-indigo-600" />
              {isBN ? 'জরুরি নোটিফিকেশন পাঠান' : 'Broadcast Alert'}
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className="flex items-center gap-2 rounded-xl bg-indigo-600/80 px-3.5 py-2 text-xs font-semibold text-white border border-indigo-400/40 hover:bg-indigo-600 transition-colors"
            >
              <GraduationCap className="h-4 w-4" />
              {isBN ? 'শিক্ষার্থী তালিকা' : 'Manage Roster'}
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Students */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {isBN ? 'মোট শিক্ষার্থী' : 'Total Students'}
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <GraduationCap className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {students.length > 0 ? students.length.toLocaleString() : '1,850'}
            </span>
            <span className="flex items-center text-[10px] font-bold text-emerald-600">
              <TrendingUp className="h-3 w-3 mr-0.5" /> +5.4%
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            {isBN ? `${departments.length}টি সক্রিয় ডিপার্টমেন্ট` : `Across ${departments.length} Active Departments`}
          </div>
        </div>

        {/* Total Teachers */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {isBN ? 'শিক্ষকমণ্ডলী' : 'Faculty Members'}
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {teachers.length > 0 ? teachers.length : '90'}
            </span>
            <span className="text-[10px] font-semibold text-emerald-600">
              {isBN ? 'ফুল টাইম স্টাফ' : 'Full Time Staff'}
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            {isBN ? '১:২০ শিক্ষার্থী অনুপাত' : '1:20 Student Ratio'}
          </div>
        </div>

        {/* Attendance Avg */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {isBN ? 'গড় উপস্থিতি' : 'Campus Attendance'}
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">92.8%</span>
            <span className="text-[10px] font-semibold text-amber-600">
              {isBN ? 'সন্তোষজনক' : 'Optimal'}
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            {isBN ? 'দৈনিক গড় হাজিরার হার' : 'Average daily log rate'}
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {isBN ? 'অনুমোদনের অপেক্ষায়' : 'Pending Approvals'}
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
              <FileCheck2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{pendingLeaves}</span>
            <span className="text-[10px] font-bold text-rose-500">
              {isBN ? 'পদক্ষেপ প্রয়োজন' : 'Requires Action'}
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            {isBN ? 'জমা দেওয়া ছুটির আবেদন' : 'Leave applications submitted'}
          </div>
        </div>
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Attendance by Dept Bar Chart */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                {isBN ? 'ডিপার্টমেন্ট অনুযায়ী উপস্থিতির হার (%)' : 'Departmental Attendance Rates (%)'}
              </h2>
              <p className="text-[11px] text-slate-400">
                {isBN ? 'বর্তমান সেমিস্টার গড় হারের তুলনা' : 'Current Semester Average Comparison'}
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              Fall 2026
            </span>
          </div>

          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentAttendanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} domain={[70, 100]} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="attendance" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fee Collection Pie Breakdown */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                {isBN ? 'টিউশন ফি ও রাজস্ব আদায়' : 'Tuition Fee Revenue'}
              </h2>
              <p className="text-[11px] text-slate-400">
                {isBN ? 'মোট আদায় বনাম বাকি ব্যালেন্স' : 'Total Collected vs Pending'}
              </p>
            </div>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </div>

          <div className="mt-2 h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={feePieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {feePieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 space-y-1.5 border-t border-slate-100 pt-3 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-emerald-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                {isBN ? 'মোট আদায়কৃত' : 'Total Collected'}
              </span>
              <span className="text-slate-900 dark:text-white">৳{paidAmount.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-amber-500">
                <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                {isBN ? 'বকেয়া ব্যালেন্স' : 'Pending Balance'}
              </span>
              <span className="text-slate-900 dark:text-white">৳{(totalFeesAmount - paidAmount).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* System Audit Activity Feed */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              {isBN ? 'সাম্প্রতিক ক্যাম্পাস অ্যাক্টিভিটি লগ' : 'Recent Campus Activity Logs'}
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('settings')}
            className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
          >
            {isBN ? 'সম্পূর্ণ সিস্টেম লগ দেখুন' : 'View Full System Logs'} <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {systemLogs.slice(0, 4).map(log => (
            <div
              key={log.id}
              className="flex items-start justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-3 dark:border-slate-800 dark:bg-slate-800/40"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-indigo-100 px-1.5 py-0.5 text-[9px] font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    {log.action}
                  </span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {log.user}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">{log.details}</p>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">{log.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
