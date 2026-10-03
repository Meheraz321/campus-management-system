import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { UserAvatar } from './UserAvatar';
import {
  Search,
  X,
  Users,
  BookOpen,
  FileText,
  Bell,
  Calendar,
  ArrowRight
} from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    teachers,
    subjects,
    notices,
    assignments,
    routines,
    setActiveTab,
    language
  } = useApp();

  const isBN = language === 'BN';
  const [query, setQuery] = useState('');

  // Handle Cmd+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const filteredTeachers = query
    ? (teachers || []).filter(
        t =>
          (t.name?.toLowerCase() || '').includes(query.toLowerCase()) ||
          (t.department?.toLowerCase() || '').includes(query.toLowerCase()) ||
          (t.subjects || []).some(s => (s?.toLowerCase() || '').includes(query.toLowerCase()))
      )
    : [];

  const filteredSubjects = query
    ? (subjects || []).filter(
        s =>
          (s.name?.toLowerCase() || '').includes(query.toLowerCase()) ||
          (s.code?.toLowerCase() || '').includes(query.toLowerCase())
      )
    : [];

  const filteredNotices = query
    ? (notices || []).filter(
        n =>
          (n.title?.toLowerCase() || '').includes(query.toLowerCase()) ||
          (n.content?.toLowerCase() || '').includes(query.toLowerCase())
      )
    : [];

  const filteredAssignments = query
    ? (assignments || []).filter(
        a =>
          (a.title?.toLowerCase() || '').includes(query.toLowerCase()) ||
          (a.subjectName?.toLowerCase() || '').includes(query.toLowerCase())
      )
    : [];

  const filteredRoutines = query
    ? (routines || []).filter(
        r =>
          (r.subjectName?.toLowerCase() || '').includes(query.toLowerCase()) ||
          (r.day?.toLowerCase() || '').includes(query.toLowerCase())
      )
    : [];

  const totalResults =
    filteredTeachers.length +
    filteredSubjects.length +
    filteredNotices.length +
    filteredAssignments.length +
    filteredRoutines.length;

  const navigateToTab = (tab: string) => {
    setActiveTab(tab);
    setIsSearchOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/60 p-4 pt-16 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in zoom-in-95 duration-200">
        {/* Search Input Header */}
        <div className="flex items-center border-b border-slate-200 px-4 py-3 dark:border-slate-800">
          <Search className="h-5 w-5 text-indigo-500" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={isBN ? 'শিক্ষক, বিষয়, নোটিশ, অ্যাসাইনমেন্ট খুঁজুন...' : 'Search teachers, subjects, notices, assignments...'}
            autoFocus
            className="ml-3 flex-1 bg-transparent text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-100"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="ml-2 rounded-lg border border-slate-200 px-2 py-1 text-[11px] font-semibold text-slate-500 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            ESC
          </button>
        </div>

        {/* Search Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4 scrollbar-none">
          {!query && (
            <div className="py-8 text-center text-xs text-slate-400">
              {isBN 
                ? 'শিক্ষকমণ্ডলী, কোর্স কোড, অ্যাসাইনমেন্ট, রুটিন বা নোটিশ খুঁজতে যেকোনো কীওয়ার্ড লিখুন।' 
                : 'Type anything to search across teachers, course codes, assignments, routines, and announcements.'}
            </div>
          )}

          {query && totalResults === 0 && (
            <div className="py-8 text-center text-xs text-slate-500">
              {isBN 
                ? `"${query}" এর সাথে মিল রেখে কোনো তথ্য পাওয়া যায়নি।` 
                : `No matching campus records found for "${query}".`}
            </div>
          )}

          {/* Teachers */}
          {filteredTeachers.length > 0 && (
            <div>
              <div className="mb-2 flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <Users className="h-3.5 w-3.5 text-indigo-500" />
                <span>{isBN ? `শিক্ষকবৃন্দ (${filteredTeachers.length})` : `Teachers (${filteredTeachers.length})`}</span>
              </div>
              <div className="space-y-1.5">
                {filteredTeachers.map(t => (
                  <div
                    key={t.id}
                    onClick={() => navigateToTab('directory')}
                    className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-2.5 transition-all hover:border-indigo-200 hover:bg-indigo-50/50 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:border-indigo-900"
                  >
                    <div className="flex items-center gap-3">
                      <UserAvatar
                        src={t.avatar}
                        name={t.name}
                        size="xs"
                      />
                      <div>
                        <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                          {t.name}
                        </div>
                        <div className="text-[10px] text-slate-500">{t.designation} • {t.department}</div>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Subjects */}
          {filteredSubjects.length > 0 && (
            <div>
              <div className="mb-2 flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <BookOpen className="h-3.5 w-3.5 text-emerald-500" />
                <span>{isBN ? `কোর্স ও বিষয়সমূহ (${filteredSubjects.length})` : `Courses & Subjects (${filteredSubjects.length})`}</span>
              </div>
              <div className="space-y-1.5">
                {filteredSubjects.map(s => (
                  <div
                    key={s.id}
                    onClick={() => navigateToTab('routine_student')}
                    className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-2.5 transition-all hover:border-emerald-200 hover:bg-emerald-50/50 dark:border-slate-800 dark:bg-slate-800/40"
                  >
                    <div>
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {s.code}: {s.name}
                      </div>
                      <div className="text-[10px] text-slate-500">{isBN ? 'শিক্ষক' : 'Instructor'}: {s.teacherName} • {s.credits} Credits</div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notices */}
          {filteredNotices.length > 0 && (
            <div>
              <div className="mb-2 flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <Bell className="h-3.5 w-3.5 text-amber-500" />
                <span>{isBN ? `ক্যাম্পাস নোটিশ (${filteredNotices.length})` : `Notices (${filteredNotices.length})`}</span>
              </div>
              <div className="space-y-1.5">
                {filteredNotices.map(n => (
                  <div
                    key={n.id}
                    onClick={() => navigateToTab('notices')}
                    className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-2.5 transition-all hover:border-amber-200 hover:bg-amber-50/50 dark:border-slate-800 dark:bg-slate-800/40"
                  >
                    <div>
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {n.title}
                      </div>
                      <div className="text-[10px] text-slate-500">{n.publishDate} • {isBN ? 'প্রকাশক' : 'By'} {n.publishedBy}</div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Assignments */}
          {filteredAssignments.length > 0 && (
            <div>
              <div className="mb-2 flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <FileText className="h-3.5 w-3.5 text-violet-500" />
                <span>{isBN ? `অ্যাসাইনমেন্টসমূহ (${filteredAssignments.length})` : `Assignments (${filteredAssignments.length})`}</span>
              </div>
              <div className="space-y-1.5">
                {filteredAssignments.map(a => (
                  <div
                    key={a.id}
                    onClick={() => navigateToTab('assignments_student')}
                    className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-2.5 transition-all hover:border-violet-200 hover:bg-violet-50/50 dark:border-slate-800 dark:bg-slate-800/40"
                  >
                    <div>
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {a.title}
                      </div>
                      <div className="text-[10px] text-slate-500">{isBN ? 'জমা দেওয়ার শেষ সময়' : 'Due'} {a.dueDate} • {a.subjectName}</div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
