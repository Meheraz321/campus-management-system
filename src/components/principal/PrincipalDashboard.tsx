import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserAvatar } from '../common/UserAvatar';
import {
  GraduationCap,
  Users,
  Building2,
  BookOpen,
  Award,
  CheckCircle2,
  DollarSign,
  Bell,
  Clock,
  FileCheck2,
  TrendingUp,
  FileText,
  Sparkles,
  Shield,
  Edit3,
  Send,
  Calendar,
  Layers,
  ChevronRight,
  Printer,
  Stamp,
  Phone,
  Mail,
  MapPin,
  HelpCircle,
  AlertCircle
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

export const PrincipalDashboard: React.FC = () => {
  const {
    students,
    teachers,
    departments,
    subjects,
    fees,
    leaveRequests,
    updateLeaveStatus,
    notices,
    addNotice,
    results,
    principalUser,
    updateUserProfile,
    setActiveTab,
    language,
    systemSettings
  } = useApp();

  const isBN = language === 'BN';
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'approvals' | 'speech' | 'circulars' | 'profile'>('overview');
  
  // Principal's speech / directive editing
  const [isEditingSpeech, setIsEditingSpeech] = useState(false);
  const [speechText, setSpeechText] = useState(
    principalUser.speechText ||
    'আমাদের লক্ষ্য প্রতিটি শিক্ষার্থীকে সৎ, নিষ্ঠাবান এবং আধুনিক প্রযুক্তি জ্ঞানসম্পন্ন দক্ষ মানবসম্পদে রূপান্তরিত করা। শিক্ষা ও শৃঙ্খলাই আমাদের মূল চালিকাশক্তি।'
  );

  // New official circular / notice state
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeCategory, setNewNoticeCategory] = useState<'Academic' | 'Exam' | 'Admin' | 'Urgent'>('Admin');
  const [newNoticeContent, setNewNoticeContent] = useState('');
  const [noticePublished, setNoticePublished] = useState(false);

  // Leave approval remarks
  const [approvalRemark, setApprovalRemark] = useState('');
  const [selectedLeaveId, setSelectedLeaveId] = useState<string | null>(null);

  const pendingLeaves = leaveRequests.filter(l => l.status === 'PENDING');
  const totalFeesAmount = fees.reduce((sum, f) => sum + f.amount, 0);
  const paidAmount = fees.filter(f => f.status === 'PAID').reduce((sum, f) => sum + f.amount, 0);
  const collectionPercentage = totalFeesAmount > 0 ? Math.round((paidAmount / totalFeesAmount) * 100) : 100;

  const totalStudents = students.length;
  const totalTeachers = teachers.length;

  const avgAttendance = students.length > 0
    ? Math.round(students.reduce((acc, s) => acc + (s.attendancePercentage || 0), 0) / students.length)
    : 92;

  // Departmental breakdown data
  const deptPerformanceData = departments.map(d => {
    const deptStudents = students.filter(s => s.department === d.name || s.department === d.code);
    const att = deptStudents.length > 0
      ? (deptStudents.reduce((acc, s) => acc + (s.attendancePercentage || 0), 0) / deptStudents.length)
      : 88;
    return {
      name: d.code,
      fullName: d.name,
      students: deptStudents.length,
      attendance: Number(att.toFixed(1))
    };
  });

  const handleSaveSpeech = () => {
    updateUserProfile({ biography: speechText });
    setIsEditingSpeech(false);
  };

  const handlePublishCircular = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoticeTitle || !newNoticeContent) return;

    addNotice({
      title: `[অধ্যক্ষের পরিপত্র] ${newNoticeTitle}`,
      category: newNoticeCategory,
      content: newNoticeContent,
      author: `${principalUser.name} (অধ্যক্ষ)`,
      attachmentUrl: undefined,
      isPinned: true
    });

    setNewNoticeTitle('');
    setNewNoticeContent('');
    setNoticePublished(true);
    setTimeout(() => setNoticePublished(false), 3500);
  };

  const handleLeaveAction = (id: string, status: 'APPROVED' | 'REJECTED') => {
    updateLeaveStatus(id, status, approvalRemark || (status === 'APPROVED' ? 'অধ্যক্ষ কর্তৃক অনুমোদিত' : 'অধ্যক্ষ কর্তৃক বাতিল'));
    setSelectedLeaveId(null);
    setApprovalRemark('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Principal Official Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950 via-indigo-900 to-slate-900 p-6 sm:p-8 text-white shadow-2xl border border-indigo-800/40">
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="relative">
              <UserAvatar
                src={principalUser.avatar}
                name={principalUser.name}
                size="xl"
              />
              <div className="absolute -bottom-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-amber-500 text-slate-950 font-black text-[11px] shadow">
                🏅
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/20 border border-amber-400/30 px-3 py-0.5 text-xs font-bold text-amber-300 backdrop-blur-md">
                <Stamp className="h-3.5 w-3.5" />
                {isBN ? 'অধ্যক্ষ মহোদয়ের প্রাতিষ্ঠানিক প্যানেল' : 'Principal Executive Office'}
              </div>
              <h1 className="mt-1.5 text-2xl sm:text-3xl font-black tracking-tight text-white">
                {principalUser.name}
              </h1>
              <p className="mt-0.5 text-xs sm:text-sm text-indigo-200">
                {principalUser.designation || 'Principal & Institutional Head'} • {systemSettings?.campusName || 'সরকারি পলিটেকনিক ইনস্টিটিউট'}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-indigo-300">
                <span className="flex items-center gap-1">
                  <Building2 className="h-3.5 w-3.5 text-amber-400" /> {principalUser.officeRoom || 'অধ্যক্ষ কার্যালয় (কক্ষ ১০১)'}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-amber-400" /> {principalUser.officeHours || 'সকাল ৯:০০ - বিকাল ৪:৩০'}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5 text-amber-400" /> {principalUser.phone || '+880 1712-345678'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveSubTab('speech')}
              className="flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 text-xs shadow-lg shadow-amber-500/20 transition-colors"
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>{isBN ? 'অধ্যক্ষের বাণী সম্পাদন' : 'Edit Principal Speech'}</span>
            </button>
            <button
              onClick={() => setActiveSubTab('circulars')}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2.5 text-xs shadow-lg shadow-indigo-600/30 transition-colors"
            >
              <Bell className="h-3.5 w-3.5" />
              <span>{isBN ? 'পরিপত্র জারি করুন' : 'Issue Circular'}</span>
            </button>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-indigo-800/60 pt-4">
          <button
            onClick={() => setActiveSubTab('overview')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'overview'
                ? 'bg-white text-indigo-950 shadow-md'
                : 'text-indigo-200 hover:bg-white/10'
            }`}
          >
            {isBN ? 'প্রাতিষ্ঠানিক ওভারভিউ' : 'Institutional Overview'}
          </button>
          <button
            onClick={() => setActiveSubTab('approvals')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'approvals'
                ? 'bg-white text-indigo-950 shadow-md'
                : 'text-indigo-200 hover:bg-white/10'
            }`}
          >
            <span>{isBN ? 'চূড়ান্ত অনুমোদন ও যাচাই' : 'Executive Approvals'}</span>
            {pendingLeaves.length > 0 && (
              <span className="rounded-full bg-rose-500 text-white px-2 py-0.2 text-[10px] font-bold">
                {pendingLeaves.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveSubTab('speech')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'speech'
                ? 'bg-white text-indigo-950 shadow-md'
                : 'text-indigo-200 hover:bg-white/10'
            }`}
          >
            {isBN ? 'অধ্যক্ষের বাণী ও বার্তা' : 'Principal Speech & Vision'}
          </button>
          <button
            onClick={() => setActiveSubTab('circulars')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'circulars'
                ? 'bg-white text-indigo-950 shadow-md'
                : 'text-indigo-200 hover:bg-white/10'
            }`}
          >
            {isBN ? 'অফিসিয়াল পরিপত্র' : 'Official Circulars'}
          </button>
          <button
            onClick={() => setActiveSubTab('profile')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'profile'
                ? 'bg-white text-indigo-950 shadow-md'
                : 'text-indigo-200 hover:bg-white/10'
            }`}
          >
            {isBN ? 'অধ্যক্ষ প্রোফাইল ও সিলমোহর' : 'Official Profile & Seal'}
          </button>
        </div>
      </div>

      {/* Tab 1: Executive Overview */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metric Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {isBN ? 'মোট শিক্ষার্থী' : 'Enrolled Students'}
                </span>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                  <GraduationCap className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-3 text-2xl font-extrabold text-slate-900 dark:text-white">
                {totalStudents} <span className="text-xs font-normal text-slate-400">জন</span>
              </div>
              <p className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> ৯৮.৪% সফল সেমিস্টার নিবন্ধন
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {isBN ? 'শিক্ষক ও অনুষদ' : 'Total Faculty'}
                </span>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                  <Users className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-3 text-2xl font-extrabold text-slate-900 dark:text-white">
                {totalTeachers} <span className="text-xs font-normal text-slate-400">জন শিক্ষক</span>
              </div>
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                {departments.length} টি টেকনোলজিতে নিয়োজিত
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {isBN ? 'গড় উপস্থিতি হার' : 'Avg Campus Attendance'}
                </span>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-3 text-2xl font-extrabold text-slate-900 dark:text-white">
                {avgAttendance}%
              </div>
              <p className="mt-1 text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
                সর্বোচ্চ উপস্থিতি CST বিভাগে
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {isBN ? 'ফি আদায় হার' : 'Fee Collection Rate'}
                </span>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
                  <DollarSign className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-3 text-2xl font-extrabold text-slate-900 dark:text-white">
                {collectionPercentage}%
              </div>
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                আদায়ের মোট পরিমাণ: ৳{paidAmount.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Departmental Performance Chart & Principal's Vision Message */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart */}
            <div className="lg:col-span-2 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    {isBN ? 'বিভাগভিত্তিক শিক্ষার্থী উপস্থিতি ও পারফরম্যান্স অডিট' : 'Departmental Attendance & Enrolment'}
                  </h2>
                  <p className="text-xs text-slate-500">
                    বিভিন্ন টেকনোলজির শিক্ষার্থীদের তুলনামূলক গ্রাফিক্যাল চিত্র
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('academic')}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                >
                  {isBN ? 'সম্পূর্ণ কাঠামো →' : 'View Structure →'}
                </button>
              </div>

              <div className="mt-6 h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={deptPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} unit="%" />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '12px',
                        border: 'none',
                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Bar dataKey="attendance" fill="#4f46e5" radius={[6, 6, 0, 0]} name="গড় উপস্থিতি (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Principal's Vision Speech Card */}
            <div className="rounded-3xl border border-amber-200/80 bg-gradient-to-b from-amber-50/70 to-white p-6 shadow-sm dark:border-amber-900/40 dark:from-amber-950/20 dark:to-slate-900 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 mb-3">
                  <Stamp className="h-5 w-5" />
                  <span className="text-xs font-black uppercase tracking-wider">অধ্যক্ষ মহোদয়ের বাণী</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                  "গুণগত শিক্ষা ও নৈতিকতার মেলবন্ধনে সমৃদ্ধ ভবিষ্যৎ"
                </h3>
                <p className="mt-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic border-l-2 border-amber-400 pl-3">
                  "{speechText}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-amber-200/60 dark:border-amber-900/30 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">{principalUser.name}</div>
                  <div className="text-[10px] text-slate-500">অধ্যক্ষ, {systemSettings?.campusName}</div>
                </div>
                <button
                  onClick={() => setActiveSubTab('speech')}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow transition"
                >
                  বাণী পরিবর্তন
                </button>
              </div>
            </div>
          </div>

          {/* Quick Academic Governance Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              onClick={() => setActiveSubTab('approvals')}
              className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 hover:border-indigo-400 transition shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                  <FileCheck2 className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white">
                  {pendingLeaves.length} অপেক্ষমান
                </span>
              </div>
              <h3 className="mt-3 font-bold text-sm text-slate-900 dark:text-white">ছুটির চূড়ান্ত অনুমোদন</h3>
              <p className="mt-1 text-xs text-slate-500">শিক্ষক ও শিক্ষার্থীদের বিশেষ ছুটির আবেদন যাচাই ও অনুমোদন করুন।</p>
            </div>

            <div
              onClick={() => setActiveTab('teachers')}
              className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 hover:border-emerald-400 transition shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                  <Users className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold text-emerald-600">{totalTeachers} জন ফ্যাকাল্টি</span>
              </div>
              <h3 className="mt-3 font-bold text-sm text-slate-900 dark:text-white">শিক্ষকমণ্ডলী তালিকা ও পদায়ন</h3>
              <p className="mt-1 text-xs text-slate-500">সকল ডিপার্টমেন্টের শিক্ষকদের প্রোফাইল, বিষয় ও ক্লাস লোড পর্যবেক্ষণ করুন।</p>
            </div>

            <div
              onClick={() => setActiveTab('notices_admin')}
              className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 hover:border-blue-400 transition shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                  <Bell className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold text-blue-600">{notices.length} টি নোটিশ</span>
              </div>
              <h3 className="mt-3 font-bold text-sm text-slate-900 dark:text-white">ক্যাম্পাস বুলেটিন ও নোটিশ</h3>
              <p className="mt-1 text-xs text-slate-500">জরুরি প্রাতিষ্ঠানিক প্রজ্ঞাপন, পরীক্ষা সূচি ও নোটিশ প্রকাশনা ব্যবস্থাপনা।</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Executive Approvals (Leave, Results) */}
      {activeSubTab === 'approvals' && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  অপেক্ষমান ছুটির আবেদন যাচাই ও চূড়ান্ত অনুমোদন
                </h2>
                <p className="text-xs text-slate-500">
                  বিভাগীয় প্রধান কর্তৃক সুপারিশকৃত অথবা অধ্যক্ষের প্রত্যক্ষ অনুমোদনের জন্য প্রেরিত আবেদনসমূহ
                </p>
              </div>
              <span className="rounded-xl bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                {pendingLeaves.length} টি অপেক্ষমান আবেদন
              </span>
            </div>

            {pendingLeaves.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
                <div className="font-bold text-slate-700 dark:text-slate-300">কোনো অপেক্ষমান ছুটির আবেদন নেই</div>
                <p className="text-xs text-slate-500 mt-1">সকল আবেদন যথাসময়ে নিষ্পত্তি করা হয়েছে।</p>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                {pendingLeaves.map(leave => (
                  <div
                    key={leave.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 dark:border-slate-800 dark:bg-slate-800/40"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 dark:text-white">
                            {leave.applicantName}
                          </span>
                          <span className="rounded-md bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                            {leave.applicantRole === 'TEACHER' ? 'শিক্ষক' : 'শিক্ষার্থী'}
                          </span>
                          <span className="rounded-md bg-slate-200 px-2 py-0.5 text-[10px] font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                            {leave.department}
                          </span>
                        </div>
                        <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                          <span className="font-bold text-amber-600">{leave.leaveType}</span> • সময়কাল:{' '}
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{leave.startDate}</span> থেকে{' '}
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{leave.endDate}</span>
                        </div>
                        <p className="mt-2 text-xs text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                          <span className="font-bold text-slate-500">আবেদনের কারণ:</span> {leave.reason}
                        </p>
                      </div>

                      <div className="flex flex-col sm:items-end gap-2 shrink-0">
                        {selectedLeaveId === leave.id ? (
                          <div className="space-y-2 w-full sm:w-64">
                            <input
                              type="text"
                              placeholder="অধ্যক্ষের মন্তব্য / সুপারিশ..."
                              value={approvalRemark}
                              onChange={e => setApprovalRemark(e.target.value)}
                              className="w-full rounded-xl border border-slate-300 p-2 text-xs dark:border-slate-700 dark:bg-slate-900"
                            />
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleLeaveAction(leave.id, 'APPROVED')}
                                className="flex-1 rounded-lg bg-emerald-600 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 shadow"
                              >
                                অনুমোদন করুন
                              </button>
                              <button
                                onClick={() => handleLeaveAction(leave.id, 'REJECTED')}
                                className="flex-1 rounded-lg bg-rose-600 py-1.5 text-xs font-bold text-white hover:bg-rose-500 shadow"
                              >
                                বাতিল করুন
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedLeaveId(leave.id);
                                setApprovalRemark('অধ্যক্ষ মহোদয় কর্তৃক অনুমোদিত');
                              }}
                              className="rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-500 shadow transition"
                            >
                              অনুমোদন প্রক্রিয়া
                            </button>
                            <button
                              onClick={() => {
                                setSelectedLeaveId(leave.id);
                                setApprovalRemark('উপযুক্ত কারণ ও প্রমাণের অভাবে বাতিল করা হলো');
                              }}
                              className="rounded-xl border border-rose-300 bg-rose-50 px-3.5 py-2 text-xs font-bold text-rose-600 hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-400 transition"
                            >
                              বাতিল
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Principal Speech & Vision Editing */}
      {activeSubTab === 'speech' && (
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 max-w-4xl">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
              <Stamp className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                অধ্যক্ষের আনুষ্ঠানিক বাণী ও প্রাতিষ্ঠানিক ভিশন
              </h2>
              <p className="text-xs text-slate-500">
                এই বক্তব্যটি ক্যাম্পাসের প্রধান বুলেটিন, ডিজিটাল পোর্টাল ও পরিচিতিপত্রে প্রদর্শিত হবে।
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                অধ্যক্ষের প্রাতিষ্ঠানিক বাণী (Speech / Vision Statement)
              </label>
              <textarea
                rows={6}
                value={speechText}
                onChange={e => setSpeechText(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 p-4 text-sm text-slate-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                placeholder="এখানে অধ্যক্ষের প্রাতিষ্ঠানিক বাণী লিখুন..."
              />
            </div>

            <div className="flex items-center justify-between pt-4">
              <span className="text-xs text-slate-400">
                স্বাক্ষরকারী: <strong className="text-slate-700 dark:text-slate-200">{principalUser.name}</strong>, অধ্যক্ষ
              </span>
              <button
                onClick={handleSaveSpeech}
                className="flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-2.5 text-xs shadow-lg shadow-amber-500/20 transition"
              >
                <CheckCircle2 className="h-4 w-4" />
                বাণী সংরক্ষণ ও প্রকাশ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Official Circulars */}
      {activeSubTab === 'circulars' && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-100 pb-4 dark:border-slate-800">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                অধ্যক্ষ কার্যালয় হতে অফিসিয়াল পরিপত্র জারি
              </h2>
              <p className="text-xs text-slate-500">
                এই নোটিশগুলো সরাসরি "অধ্যক্ষ স্বাক্ষরিত পরিপত্র" হিসেবে ক্যাম্পাসের প্রধান নোটিশ বোর্ডে পিন করা থাকবে।
              </p>
            </div>

            {noticePublished && (
              <div className="mt-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 dark:bg-emerald-950/60 dark:border-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="h-4 w-4" /> পরিপত্রটি সফলভাবে ক্যাম্পাসে জারি করা হয়েছে!
              </div>
            )}

            <form onSubmit={handlePublishCircular} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    পরিপত্রের শিরোনাম
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: আসন্ন সেমিস্টার সমাপনী পরীক্ষার প্রস্তুতি ও প্রশাসনিক নির্দেশিকা"
                    value={newNoticeTitle}
                    onChange={e => setNewNoticeTitle(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-3 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    শ্রেণীবিভাগ (Category)
                  </label>
                  <select
                    value={newNoticeCategory}
                    onChange={e => setNewNoticeCategory(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-300 p-3 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="Admin">প্রশাসনিক নির্দেশিকা (Admin)</option>
                    <option value="Academic">একাডেমিক সার্কুলার (Academic)</option>
                    <option value="Exam">পরীক্ষা সংক্রান্ত (Exam)</option>
                    <option value="Urgent">জরুরি আদেশ (Urgent)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  পরিপত্রের বিস্তারিত বিবরণ ও নির্দেশনাবলী
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="পরিপত্রের বিস্তারিত বিবরণ লিখুন..."
                  value={newNoticeContent}
                  onChange={e => setNewNoticeContent(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-3 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 py-2.5 text-xs shadow-lg shadow-indigo-600/30 transition"
                >
                  <Send className="h-4 w-4" />
                  পরিপত্র প্রকাশ ও জারি করুন
                </button>
              </div>
            </form>
          </div>

          {/* Published Circulars */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-4">
              সম্প্রতি জারিকৃত পরিপত্র ও নোটিশসমূহ
            </h3>
            <div className="space-y-3">
              {notices.slice(0, 5).map(notice => (
                <div
                  key={notice.id}
                  className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-800/40 flex items-start justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                        {notice.category}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {notice.title}
                      </h4>
                    </div>
                    <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                      {notice.content}
                    </p>
                    <div className="mt-2 text-[11px] text-slate-400">
                      প্রকাশক: {notice.author} • তারিখ: {notice.publishDate}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Profile & Seal */}
      {activeSubTab === 'profile' && (
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 max-w-3xl">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
              <Stamp className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                অধ্যক্ষের আনুষ্ঠানিক পরিচয়পত্র ও ডিজিটাল সিলমোহর
              </h2>
              <p className="text-xs text-slate-500">
                সকল অফিসিয়াল ডকুমেন্ট ও সার্টিফিকেশনে এই প্রোফাইল তথ্য ও সিল ব্যবহৃত হয়।
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/40">
              <span className="text-[11px] font-bold text-slate-400 uppercase">অধ্যক্ষের নাম</span>
              <div className="text-sm font-extrabold text-slate-900 dark:text-white mt-1">
                {principalUser.name}
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/40">
              <span className="text-[11px] font-bold text-slate-400 uppercase">অফিসিয়াল পদবি</span>
              <div className="text-sm font-extrabold text-slate-900 dark:text-white mt-1">
                {principalUser.designation}
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/40">
              <span className="text-[11px] font-bold text-slate-400 uppercase">শিক্ষাগত যোগ্যতা</span>
              <div className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                {principalUser.qualification || 'Ph.D in Engineering, M.Sc (First Class)'}
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/40">
              <span className="text-[11px] font-bold text-slate-400 uppercase">কার্যালয় ও কক্ষ নম্বর</span>
              <div className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                {principalUser.officeRoom}
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/40">
              <span className="text-[11px] font-bold text-slate-400 uppercase">সাক্ষাতের সময়সূচী</span>
              <div className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                {principalUser.officeHours}
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/40">
              <span className="text-[11px] font-bold text-slate-400 uppercase">অফিসিয়াল মোবাইল ও ইমেইল</span>
              <div className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                {principalUser.phone} • {principalUser.email}
              </div>
            </div>
          </div>

          {/* Digital Signature & Stamp Box */}
          <div className="mt-6 p-6 rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/40 dark:border-amber-800/50 dark:bg-amber-950/20 text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/60 dark:text-amber-400 mb-2">
              <Stamp className="h-6 w-6" />
            </div>
            <div className="text-xs font-black uppercase text-amber-800 dark:text-amber-300">
              OFFICIAL VERIFIED PRINCIPAL SEAL
            </div>
            <div className="mt-1 font-serif text-lg font-bold text-slate-800 dark:text-slate-100">
              {principalUser.name}
            </div>
            <div className="text-[11px] text-slate-500">
              অধ্যক্ষ, {systemSettings?.campusName}
            </div>
            <div className="mt-2 text-[10px] text-slate-400 font-mono">
              DIGITAL IDENTIFIER: {principalUser.id || 'PRI-VERIFIED-2026'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
