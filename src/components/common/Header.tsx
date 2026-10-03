import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserAvatar } from './UserAvatar';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Laptop,
  QrCode,
  Globe,
  Shield,
  GraduationCap,
  UserCheck,
  Award,
  ChevronDown,
  LogOut,
  BookOpen,
  Palette,
  Check
} from 'lucide-react';
import { ThemeSelectorModal } from './ThemeSelectorModal';

export const Header: React.FC = () => {
  const {
    role,
    setRole,
    logout,
    theme,
    colorMode,
    setColorMode,
    toggleTheme,
    language,
    setLanguage,
    notifications,
    setIsNotifOpen,
    setIsSearchOpen,
    setIsQRModalOpen,
    setActiveTab,
    currentStudent,
    currentTeacher,
    principalUser,
    adminUser,
    hodUser,
    t
  } = useApp();

  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  const unreadCount = (notifications || []).filter(n => !n.read).length;
  const isBN = language === 'BN';

  const getRoleUser = () => {
    if (role === 'ADMIN') return adminUser;
    if (role === 'PRINCIPAL') return principalUser;
    if (role === 'HOD') return hodUser;
    if (role === 'TEACHER') return currentTeacher;
    return currentStudent;
  };

  const currentUser = getRoleUser();

  const getRoleDisplay = () => {
    if (role === 'ADMIN') return isBN ? 'মাস্টার অ্যাডমিন' : 'Master Admin';
    if (role === 'PRINCIPAL') return isBN ? 'অধ্যক্ষ (Principal)' : 'Principal';
    if (role === 'HOD') return isBN ? 'বিভাগীয় প্রধান' : 'Head of Dept';
    if (role === 'TEACHER') return isBN ? 'শিক্ষক' : 'Teacher';
    return isBN ? 'শিক্ষার্থী' : 'Student';
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90 sm:px-6">
      {/* Search Trigger */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-1.5 text-xs text-slate-500 hover:border-indigo-300 hover:bg-slate-100 transition-all dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-400 dark:hover:border-indigo-500 sm:w-64"
        >
          <Search className="h-4 w-4 text-slate-400" />
          <span className="hidden sm:inline">
            {isBN ? 'শিক্ষক, নোটিশ, রুটিন বা স্টাডি খুঁজুন...' : 'Search teachers, notices, routines...'}
          </span>
          <span className="sm:hidden">{isBN ? 'অনুসন্ধান...' : 'Search...'}</span>
          <kbd className="ml-auto hidden rounded border border-slate-300 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 dark:border-slate-700 dark:bg-slate-900 sm:inline-block">
            ⌘K
          </kbd>
        </button>

        {/* Authenticated Role Badge (Secure - No unauthorized role switching) */}
        <div className="flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50/60 px-3 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-900/50 dark:bg-indigo-950/40 dark:text-indigo-300 shadow-xs">
          {role === 'ADMIN' && <Shield className="h-3.5 w-3.5 text-rose-500" />}
          {role === 'PRINCIPAL' && <Award className="h-3.5 w-3.5 text-amber-500" />}
          {role === 'HOD' && <Award className="h-3.5 w-3.5 text-purple-500" />}
          {role === 'TEACHER' && <UserCheck className="h-3.5 w-3.5 text-emerald-500" />}
          {role === 'STUDENT' && <GraduationCap className="h-3.5 w-3.5 text-indigo-500" />}
          <span className="capitalize">{getRoleDisplay()}</span>
        </div>

        {/* Study Portal Quick Link */}
        <button
          onClick={() => setActiveTab(role === 'STUDENT' ? 'materials_student' : 'materials_teacher')}
          className="hidden md:flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50/70 px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-900/50 dark:bg-indigo-950/40 dark:text-indigo-300 transition"
          title={isBN ? 'স্টাডি পোর্টাল ও ই-রিসোর্স হাব ওপেন করুন' : 'Open Digital Study Portal'}
        >
          <BookOpen className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>{isBN ? 'স্টাডি পোর্টাল' : 'Study Portal'}</span>
        </button>
      </div>

      {/* Right Action Icons */}
      <div className="flex items-center gap-2">
        {/* Student QR ID Button */}
        {role === 'STUDENT' && (
          <button
            onClick={() => setIsQRModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            title={isBN ? 'ডিজিটাল আইডি কার্ড দেখুন' : 'View Digital Student ID Card'}
          >
            <QrCode className="h-4 w-4 text-indigo-500" />
            <span className="hidden md:inline">{isBN ? 'আইডি কার্ড' : 'ID Card'}</span>
          </button>
        )}

        {/* Language Switcher (Prominent Dual Segment Toggle) */}
        <div className="flex items-center rounded-xl border border-slate-200 bg-slate-100/90 p-0.5 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
          <button
            type="button"
            onClick={() => setLanguage('BN')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              language === 'BN'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="বাংলা ভাষায় রূপান্তর করুন (Switch to Bangla)"
          >
            <span>🇧🇩</span>
            <span>বাংলা</span>
          </button>
          <button
            type="button"
            onClick={() => setLanguage('EN')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              language === 'EN'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Switch to English (ইংরেজি ভাষায় রূপান্তর করুন)"
          >
            <span>🇬🇧</span>
            <span>English</span>
          </button>
        </div>

        {/* Color Mode Quick Toggle (Light / Dark) */}
        <button
          onClick={toggleTheme}
          className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 hover:border-indigo-300 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-all shadow-xs"
          title={isBN ? `কালার মোড: বর্তমানে ${theme === 'light' ? 'লাইট' : 'ডার্ক'} মোডে আছে (ক্লিক করে পরিবর্তন করুন)` : `Color mode: currently ${theme}. Click to toggle.`}
        >
          {theme === 'light' ? (
            <Sun className="h-4 w-4 text-amber-500" />
          ) : (
            <Moon className="h-4 w-4 text-indigo-400" />
          )}
        </button>

        {/* Theme & Palette Customizer Modal Trigger */}
        <button
          onClick={() => setIsThemeModalOpen(true)}
          className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-all shadow-xs"
          title={isBN ? 'কালার মোড ও ভাষা কাস্টমাইজ করুন' : 'Customize Color Mode, Accents & Language'}
        >
          <Palette className="h-4 w-4 text-violet-500" />
        </button>

        {/* Notifications Bell */}
        <button
          onClick={() => setIsNotifOpen(true)}
          className="relative flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors shadow-xs"
          title={isBN ? 'নোটিফিকেশনসমূহ' : 'Notifications'}
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Profile Avatar */}
        <button
          onClick={() => setActiveTab('profile')}
          className="ml-1 flex items-center gap-2 border-l border-slate-200 pl-3 dark:border-slate-800 hover:opacity-80 transition cursor-pointer"
          title={isBN ? 'প্রোফাইল দেখুন ও সম্পাদনা করুন' : 'Click to view & edit your profile'}
        >
          <UserAvatar
            src={currentUser.avatar}
            name={currentUser.name}
            size="sm"
          />
          <div className="hidden text-left lg:block">
            <div className="text-xs font-semibold text-slate-800 dark:text-slate-100">
              {currentUser.name}
            </div>
            <div className="text-[10px] font-medium text-slate-400">
              {role === 'STUDENT'
                ? (currentUser as any).rollNumber
                : (currentUser as any).designation}
            </div>
          </div>
        </button>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="flex h-8 w-8 items-center justify-center rounded-xl border border-rose-200 bg-rose-50/70 text-rose-600 hover:bg-rose-100 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-400 dark:hover:bg-rose-900/60 transition-colors ml-1 shadow-xs"
          title={isBN ? 'ক্যাম্পাস সিস্টেম থেকে লগআউট' : 'Log Out of Campus System'}
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>

      {/* Full Theme & Language Modal */}
      <ThemeSelectorModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
      />
    </header>
  );
};
