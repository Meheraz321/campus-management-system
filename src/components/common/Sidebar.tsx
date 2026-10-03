import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  CheckCircle2,
  FileText,
  Award,
  DollarSign,
  Bell,
  MessageSquare,
  Building2,
  LogOut,
  Sliders,
  FileCheck2,
  Compass,
  FolderDown,
  Clock,
  Sparkles,
  Database,
  UserCheck,
  Shield,
  Stamp,
  Quote
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

const SidebarLogoutButton: React.FC = () => {
  const { logout, language } = useApp();
  return (
    <button
      onClick={logout}
      className="flex w-full items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50/70 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-100 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-400 dark:hover:bg-rose-900/50 transition-colors"
    >
      <LogOut className="h-4 w-4" />
      <span>{language === 'BN' ? 'লগআউট / প্রস্থান' : 'Log Out / Exit Portal'}</span>
    </button>
  );
};

export const Sidebar: React.FC = () => {
  const { role, activeTab, setActiveTab, language } = useApp();
  const isBN = language === 'BN';

  // Master Admin Navigation (Full Institutional Control)
  const adminNav: NavItem[] = [
    { id: 'dashboard', label: isBN ? 'সিস্টেম সেন্ট্রাল কন্ট্রোল' : 'Master Admin Control', icon: LayoutDashboard },
    { id: 'registered_users_db', label: isBN ? 'ইউজার নিয়ন্ত্রণ ও এক্সপোর্ট' : 'User Control & DB', icon: Database, badge: 'Full Access' },
    { id: 'settings', label: isBN ? 'সিস্টেম ও ক্যাম্পাস সেটিংস' : 'Campus & System Settings', icon: Sliders, badge: 'Config' },
    { id: 'materials_teacher', label: isBN ? 'স্টাডি পোর্টাল রিসোর্স' : 'Study Portal & E-Library', icon: BookOpen, badge: 'E-Study' },
    { id: 'students', label: isBN ? 'শিক্ষার্থী ডাটাবেজ' : 'Student Database', icon: GraduationCap },
    { id: 'teachers', label: isBN ? 'শিক্ষক ও স্টাফ তালিকা' : 'Faculty & Staff', icon: Users, badge: 'Audit' },
    { id: 'academic', label: isBN ? 'বিভাগ ও সেমিস্টার' : 'Depts & Semesters', icon: BookOpen },
    { id: 'attendance_admin', label: isBN ? 'উপস্থিতি অডিট' : 'Attendance Audit', icon: CheckCircle2 },
    { id: 'notices_admin', label: isBN ? 'নোটিশ ও ইভেন্টস' : 'Notices & Events', icon: Bell },
    { id: 'leaves_admin', label: isBN ? 'ছুটির আবেদন নিয়ন্ত্রণ' : 'Leave Approvals', icon: FileCheck2 },
    { id: 'fees_admin', label: isBN ? 'ফি ও হিসাবরক্ষণ' : 'Fee & Accounts', icon: DollarSign },
    { id: 'push_notif', label: isBN ? 'জরুরি ব্রডকাস্ট অ্যালার্ট' : 'Broadcast Alerts', icon: Sparkles },
    { id: 'directory', label: isBN ? 'ক্যাম্পাস ডিরেক্টরি' : 'Campus Directory', icon: Building2 },
    { id: 'profile', label: isBN ? 'অ্যাডমিন প্রোফাইল' : 'Master Admin Profile', icon: Shield }
  ];

  // Principal Navigation (Institutional Executive Panel)
  const principalNav: NavItem[] = [
    { id: 'dashboard', label: isBN ? 'অধ্যক্ষ এক্সিকিউটিভ ড্যাশবোর্ড' : 'Principal Overview', icon: LayoutDashboard },
    { id: 'approvals_principal', label: isBN ? 'ছুটি ও অনুমোদন বোর্ড' : 'Executive Approvals', icon: FileCheck2, badge: 'Action' },
    { id: 'circulars_principal', label: isBN ? 'অফিসিয়াল সার্কুলার' : 'Official Circulars', icon: Stamp, badge: 'Official' },
    { id: 'speech_principal', label: isBN ? 'অধ্যক্ষের বাণী ও ভিশন' : "Principal's Speech & Vision", icon: Quote },
    { id: 'profile_principal', label: isBN ? 'অধ্যক্ষের প্রোফাইল ও সিল' : 'Official Profile & Seal', icon: UserCheck },
    { id: 'materials_teacher', label: isBN ? 'স্টাডি পোর্টাল হাব' : 'Study Portal Hub', icon: BookOpen, badge: 'E-Study' },
    { id: 'notices_admin', label: isBN ? 'ক্যাম্পাস নোটিশবোর্ড' : 'Campus Notices', icon: Bell },
    { id: 'directory', label: isBN ? 'অনুষদ ও শিক্ষক ডিরেক্টরি' : 'Faculty Directory', icon: Building2 },
    { id: 'chat', label: isBN ? 'যোগাযোগ ও মেসেজ' : 'Messages & Chat', icon: MessageSquare }
  ];

  const hodNav: NavItem[] = [
    { id: 'dashboard', label: isBN ? 'বিভাগীয় ওভারভিউ' : 'Head of Dept Overview', icon: LayoutDashboard },
    { id: 'registered_users_db', label: isBN ? 'নিবন্ধিত ডাটাবেজ' : 'Registered DB & Exports', icon: Database, badge: 'Users' },
    { id: 'materials_teacher', label: isBN ? 'স্টাডি পোর্টাল ও রিসোর্স' : 'Study Portal & Resources', icon: BookOpen, badge: 'E-Study' },
    { id: 'profile', label: isBN ? 'আমার প্রোফাইল' : 'My Registered Profile', icon: UserCheck },
    { id: 'faculty_hod', label: isBN ? 'বিভাগীয় শিক্ষকবৃন্দ' : 'Department Faculty', icon: Users, badge: '24' },
    { id: 'students_hod', label: isBN ? 'বিভাগীয় শিক্ষার্থী' : 'Dept Students Audit', icon: GraduationCap, badge: '480' },
    { id: 'routine_hod', label: isBN ? 'রুটিন ও বিষয়সমূহ' : 'Routine & Subjects', icon: Clock },
    { id: 'leaves_hod', label: isBN ? 'ছুটির আবেদন অনুমোদন' : 'Dept Leave Approvals', icon: FileCheck2 },
    { id: 'results_hod', label: isBN ? 'ফলাফল যাচাই' : 'Results Verification', icon: Award },
    { id: 'notices_hod', label: isBN ? 'বিভাগীয় নোটিশ' : 'Dept Announcements', icon: Bell },
    { id: 'directory', label: isBN ? 'শিক্ষক ডিরেক্টরি' : 'Faculty Directory', icon: Building2 }
  ];

  const teacherNav: NavItem[] = [
    { id: 'dashboard', label: isBN ? 'শিক্ষক ড্যাশবোর্ড' : 'Teacher Dashboard', icon: LayoutDashboard },
    { id: 'materials_teacher', label: isBN ? 'স্টাডি পোর্টাল হাব' : 'Study Portal Hub', icon: BookOpen, badge: 'E-Study' },
    { id: 'profile', label: isBN ? 'আমার প্রোফাইল' : 'My Registered Profile', icon: UserCheck },
    { id: 'attendance_teacher', label: isBN ? 'ক্লাস হাজিরা নিন' : 'Mark Class Attendance', icon: CheckCircle2 },
    { id: 'assignments_teacher', label: isBN ? 'অ্যাসাইনমেন্ট ও মার্কস' : 'Assignments & Marking', icon: FileText },
    { id: 'routine_teacher', label: isBN ? 'ক্লাস রুটিন' : 'Class Timetable', icon: Clock },
    { id: 'results_teacher', label: isBN ? 'ফলাফল প্রকাশ' : 'Publish Results', icon: Award },
    { id: 'notices', label: isBN ? 'ক্যাম্পাস নোটিশ' : 'Campus Notices', icon: Bell },
    { id: 'chat', label: isBN ? 'শিক্ষার্থী মেসেজ' : 'Student Messages', icon: MessageSquare, badge: 'Live' },
    { id: 'directory', label: isBN ? 'শিক্ষক ডিরেক্টরি' : 'Faculty Directory', icon: Building2 }
  ];

  const studentNav: NavItem[] = [
    { id: 'dashboard', label: isBN ? 'শিক্ষার্থী ড্যাশবোর্ড' : 'Student Dashboard', icon: LayoutDashboard },
    { id: 'materials_student', label: isBN ? 'স্টাডি পোর্টাল' : 'Study Portal', icon: BookOpen, badge: 'E-Study' },
    { id: 'profile', label: isBN ? 'আমার প্রোফাইল' : 'My Registered Profile', icon: UserCheck },
    { id: 'attendance_student', label: isBN ? 'উপস্থিতি খাতা' : 'Attendance Log', icon: CheckCircle2 },
    { id: 'routine_student', label: isBN ? 'রুটিন ও পরীক্ষা' : 'Routine & Exams', icon: Calendar },
    { id: 'assignments_student', label: isBN ? 'আমার অ্যাসাইনমেন্ট' : 'My Assignments', icon: FileText },
    { id: 'results_student', label: isBN ? 'ফলাফল ও গ্রেডশিট' : 'Results & Transcript', icon: Award },
    { id: 'fees_student', label: isBN ? 'টিউশন ও সেমিস্টার ফি' : 'Tuition & Fees', icon: DollarSign },
    { id: 'leaves_student', label: isBN ? 'ছুটির আবেদন' : 'Leave Applications', icon: FileCheck2 },
    { id: 'chat', label: isBN ? 'শিক্ষককে মেসেজ' : 'Message Teachers', icon: MessageSquare },
    { id: 'directory', label: isBN ? 'শিক্ষক ডিরেক্টরি' : 'Faculty Directory', icon: Building2 },
    { id: 'campus_info', label: isBN ? 'ক্যাম্পাস তথ্য' : 'Campus Map & Info', icon: Compass }
  ];

  const currentNav =
    role === 'ADMIN'
      ? adminNav
      : role === 'PRINCIPAL'
      ? principalNav
      : role === 'HOD'
      ? hodNav
      : role === 'TEACHER'
      ? teacherNav
      : studentNav;

  const getWorkspaceTitle = () => {
    if (role === 'ADMIN') return isBN ? 'মাস্টার অ্যাডমিন প্যানেল (সর্বময় নিয়ন্ত্রণ)' : 'Master Admin Panel';
    if (role === 'PRINCIPAL') return isBN ? 'অধ্যক্ষ প্যানেল (Executive)' : 'Principal Executive Panel';
    if (role === 'HOD') return isBN ? 'বিভাগীয় প্রধান (HOD)' : 'Department Head (HOD)';
    if (role === 'TEACHER') return isBN ? 'শিক্ষক ওয়ার্কস্পেস' : 'Teacher Workspace';
    return isBN ? 'শিক্ষার্থী পোর্টাল' : 'Student Portal';
  };

  return (
    <aside className="hidden w-64 flex-col border-r border-slate-200/80 bg-white/95 transition-all dark:border-slate-800 dark:bg-slate-900/95 md:flex">
      {/* Brand Logo Header */}
      <div className="flex h-16 items-center gap-3 border-b border-slate-200/80 px-6 dark:border-slate-800">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-600 font-bold text-white shadow-md shadow-indigo-500/20">
          <GraduationCap className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
            {isBN ? 'ক্যাম্পাস ' : 'Campus '}<span className="text-indigo-600 dark:text-indigo-400">{isBN ? 'পোর্টাল' : 'Portal'}</span>
          </h1>
          <p className="text-[10px] font-medium text-slate-400">
            {isBN ? 'ডিজিটাল ম্যানেজমেন্ট ও স্টাডি সিস্টেম' : 'Management & Study System'}
          </p>
        </div>
      </div>

      {/* Role Indicator Banner */}
      <div className="mx-4 my-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3 dark:border-slate-800/80 dark:bg-slate-800/40">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {isBN ? 'সক্রিয় প্যানেল' : 'Active Workspace'}
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            {isBN ? 'লাইভ অনলাইন' : 'Online'}
          </span>
        </div>
        <div className="mt-1 text-xs font-semibold text-slate-800 dark:text-slate-200">
          {getWorkspaceTitle()}
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2 scrollbar-none">
        {currentNav.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 dark:bg-indigo-600'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`h-4 w-4 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="rounded-full bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="border-t border-slate-200/80 p-3 space-y-2 dark:border-slate-800">
        <SidebarLogoutButton />
        <div className="flex items-center gap-3 px-1">
          <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Spring 2026</span>
            <span className="mx-1">•</span>
            v2.5.0
          </div>
        </div>
      </div>
    </aside>
  );
};
