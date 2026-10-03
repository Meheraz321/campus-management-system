import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Calendar,
  FileText,
  CheckCircle2,
  Menu,
  X,
  Building2,
  Award,
  DollarSign,
  Compass,
  MessageSquare,
  Users,
  GraduationCap,
  FileCheck2
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { role, activeTab, setActiveTab, language } = useApp();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isBN = language === 'BN';

  // Bottom main 4 icons based on role
  const getBottomNavItems = () => {
    if (role === 'STUDENT') {
      return [
        { id: 'dashboard', label: isBN ? 'হোম' : 'Home', icon: LayoutDashboard },
        { id: 'routine_student', label: isBN ? 'রুটিন' : 'Routine', icon: Calendar },
        { id: 'attendance_student', label: isBN ? 'উপস্থিতি' : 'Attendance', icon: CheckCircle2 },
        { id: 'assignments_student', label: isBN ? 'টাস্ক' : 'Tasks', icon: FileText }
      ];
    } else if (role === 'PRINCIPAL') {
      return [
        { id: 'dashboard', label: isBN ? 'ওভারভিউ' : 'Overview', icon: LayoutDashboard },
        { id: 'approvals_principal', label: isBN ? 'অনুমোদন' : 'Approvals', icon: FileCheck2 },
        { id: 'circulars_principal', label: isBN ? 'সার্কুলার' : 'Circulars', icon: FileText },
        { id: 'notices_admin', label: isBN ? 'নোটিশ' : 'Notices', icon: Calendar }
      ];
    } else if (role === 'HOD') {
      return [
        { id: 'dashboard', label: isBN ? 'ডিপার্টমেন্ট' : 'HOD', icon: LayoutDashboard },
        { id: 'faculty_hod', label: isBN ? 'শিক্ষক' : 'Faculty', icon: Users },
        { id: 'students_hod', label: isBN ? 'শিক্ষার্থী' : 'Students', icon: GraduationCap },
        { id: 'leaves_hod', label: isBN ? 'ছুটি' : 'Leaves', icon: FileCheck2 }
      ];
    } else if (role === 'TEACHER') {
      return [
        { id: 'dashboard', label: isBN ? 'হোম' : 'Home', icon: LayoutDashboard },
        { id: 'attendance_teacher', label: isBN ? 'হাজিরা' : 'Attendance', icon: CheckCircle2 },
        { id: 'assignments_teacher', label: isBN ? 'টাস্ক' : 'Tasks', icon: FileText },
        { id: 'chat', label: isBN ? 'চ্যাট' : 'Chat', icon: MessageSquare }
      ];
    } else {
      return [
        { id: 'dashboard', label: isBN ? 'অ্যাডমিন' : 'Admin', icon: LayoutDashboard },
        { id: 'registered_users_db', label: isBN ? 'ডাটাবেজ' : 'Users DB', icon: Users },
        { id: 'students', label: isBN ? 'শিক্ষার্থী' : 'Students', icon: GraduationCap },
        { id: 'settings', label: isBN ? 'সেটিংস' : 'Settings', icon: FileText }
      ];
    }
  };

  const navItems = getBottomNavItems();

  const fullDrawerNav = [
    { id: 'dashboard', label: isBN ? 'ড্যাশবোর্ড ওভারভিউ' : 'Dashboard Overview' },
    { id: 'profile', label: isBN ? 'আমার প্রোফাইল' : 'My Registered Profile' },
    { id: 'directory', label: isBN ? 'ক্যাম্পাস ডিরেক্টরি' : 'Campus Directory' },
    { id: 'chat', label: isBN ? 'চ্যাট ও বার্তা' : 'Chat & Messages' },
    { id: 'campus_info', label: isBN ? 'ক্যাম্পাস ম্যাপ ও সুবিধা' : 'Campus Map & Facilities' },
    { id: 'results_student', label: isBN ? 'ফলাফল ও গ্রেডশিট' : 'Results & CGPA' },
    { id: 'fees_student', label: isBN ? 'টিউশন ফি ও পেমেন্ট' : 'Tuition & Payments' },
    { id: 'leaves_student', label: isBN ? 'ছুটির আবেদন' : 'Leave Applications' }
  ];

  return (
    <>
      {/* Mobile Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-slate-200 bg-white/95 px-2 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 md:hidden">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          );
        })}

        {/* Drawer Menu Button */}
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="flex flex-col items-center gap-1 text-[10px] font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
        >
          <Menu className="h-5 w-5" />
          <span>{isBN ? 'আরও' : 'More'}</span>
        </button>
      </div>

      {/* Slide Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex bg-slate-900/60 backdrop-blur-sm md:hidden">
          <div className="flex w-4/5 max-w-xs flex-col bg-white p-5 shadow-2xl dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {isBN ? 'ক্যাম্পাস নেভিগেশন' : 'Campus Navigation'}
              </span>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 flex-1 space-y-2 overflow-y-auto">
              {fullDrawerNav.map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsDrawerOpen(false);
                  }}
                  className={`w-full text-left rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                    activeTab === item.id
                      ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400'
                      : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1" onClick={() => setIsDrawerOpen(false)} />
        </div>
      )}
    </>
  );
};
