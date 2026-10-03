import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TeacherProfile } from '../../types';
import { UserAvatar } from './UserAvatar';
import {
  Users,
  Search,
  Building2,
  Mail,
  Phone,
  Award,
  BookOpen,
  Clock,
  MapPin,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Filter,
  ArrowLeft
} from 'lucide-react';

interface PublicFacultyDirectoryProps {
  onBackToAuth?: () => void;
  isGuestView?: boolean;
}

export const PublicFacultyDirectory: React.FC<PublicFacultyDirectoryProps> = ({
  onBackToAuth,
  isGuestView = false
}) => {
  const { teachers, registeredUsers, departments, role, setActiveTab, language } = useApp();
  const isBN = language === 'BN';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('ALL');
  const [selectedRank, setSelectedRank] = useState<string>('ALL');
  const [activeTeacherModal, setActiveTeacherModal] = useState<TeacherProfile | null>(null);

  // Helper function to assign hierarchy rank (1 to 6)
  const getHierarchyRank = (designation: string, isPrincipal?: boolean): { rank: number; label: string; bgClass: string; textClass: string } => {
    const des = designation.toLowerCase();
    if (isPrincipal || des.includes('principal') || des.includes('vice chancellor')) {
      return { 
        rank: 1, 
        label: isBN ? 'লেভেল ১: ক্যাম্পাস প্রিন্সিপাল' : 'Level 1: Campus Principal', 
        bgClass: 'bg-amber-500/10 border-amber-500/30 dark:bg-amber-950/60', 
        textClass: 'text-amber-700 dark:text-amber-300' 
      };
    }
    if (des.includes('head') || des.includes('hod') || des.includes('head of department')) {
      return { 
        rank: 2, 
        label: isBN ? 'লেভেল ২: বিভাগীয় প্রধান (HOD)' : 'Level 2: Head of Department (HOD)', 
        bgClass: 'bg-purple-500/10 border-purple-500/30 dark:bg-purple-950/60', 
        textClass: 'text-purple-700 dark:text-purple-300' 
      };
    }
    if (des.includes('professor') && !des.includes('associate') && !des.includes('assistant')) {
      return { 
        rank: 3, 
        label: isBN ? 'লেভেল ৩: পূর্ণ অধ্যাপক' : 'Level 3: Full Professor', 
        bgClass: 'bg-indigo-500/10 border-indigo-500/30 dark:bg-indigo-950/60', 
        textClass: 'text-indigo-700 dark:text-indigo-300' 
      };
    }
    if (des.includes('associate professor')) {
      return { 
        rank: 4, 
        label: isBN ? 'লেভেল ৪: সহযোগী অধ্যাপক' : 'Level 4: Associate Professor', 
        bgClass: 'bg-blue-500/10 border-blue-500/30 dark:bg-blue-950/60', 
        textClass: 'text-blue-700 dark:text-blue-300' 
      };
    }
    if (des.includes('assistant professor')) {
      return { 
        rank: 5, 
        label: isBN ? 'লেভেল ৫: সহকারী অধ্যাপক' : 'Level 5: Assistant Professor', 
        bgClass: 'bg-emerald-500/10 border-emerald-500/30 dark:bg-emerald-950/60', 
        textClass: 'text-emerald-700 dark:text-emerald-300' 
      };
    }
    return { 
      rank: 6, 
      label: isBN ? 'লেভেল ৬: প্রভাষক / শিক্ষক' : 'Level 6: Faculty Lecturer', 
      bgClass: 'bg-slate-500/10 border-slate-500/30 dark:bg-slate-800', 
      textClass: 'text-slate-700 dark:text-slate-300' 
    };
  };

  // Merge mock teachers with any dynamically registered teachers/HODs
  const allFaculty: TeacherProfile[] = [...teachers];

  // Add registered HODs/Teachers from registeredUsers if not already present
  registeredUsers.forEach(u => {
    if ((u.role === 'TEACHER' || u.role === 'HOD' || u.role === 'ADMIN') && !allFaculty.some(f => f.email.toLowerCase() === u.email.toLowerCase())) {
      allFaculty.push({
        id: `reg-fac-${u.id}`,
        userId: u.id,
        name: u.name,
        email: u.email,
        avatar: u.avatar || '',
        designation: u.designation || (u.role === 'HOD' ? 'Head of Department' : u.role === 'ADMIN' ? 'Principal Administrator' : 'Assistant Professor'),
        department: u.department || 'Computer Science & Engineering',
        subjects: ['Specialized Course Lectures', 'Department Seminar'],
        phone: u.phone || '+1 (555) 019-2831',
        officeRoom: 'Faculty Building Suite',
        qualification: 'M.Sc. / Ph.D.',
        experienceYears: 6,
        biography: `${u.name} is a valued member of the campus faculty in ${u.department || 'Engineering'}.`,
        officeHours: 'Mon-Thu: 10:00 AM - 1:00 PM',
        isPrincipal: u.role === 'ADMIN'
      });
    }
  });

  // Sort faculty serially by hierarchy rank ascending (Level 1 Principal down to Level 6 Lecturers)
  const sortedFaculty = [...allFaculty].sort((a, b) => {
    const rankA = getHierarchyRank(a.designation, a.isPrincipal).rank;
    const rankB = getHierarchyRank(b.designation, b.isPrincipal).rank;
    if (rankA !== rankB) return rankA - rankB;
    return a.name.localeCompare(b.name);
  });

  // Filter faculty by search query, department, and rank level
  const filteredFaculty = sortedFaculty.filter(fac => {
    const matchesDept =
      selectedDepartment === 'ALL' ||
      fac.department === selectedDepartment ||
      fac.department.startsWith(selectedDepartment) ||
      (selectedDepartment === 'প্রশাসন (Administration)' && fac.department === 'প্রশাসন');
    const facRank = getHierarchyRank(fac.designation, fac.isPrincipal).rank;
    const matchesRank = selectedRank === 'ALL' || facRank === parseInt(selectedRank, 10);
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      fac.name.toLowerCase().includes(q) ||
      fac.designation.toLowerCase().includes(q) ||
      fac.department.toLowerCase().includes(q) ||
      fac.qualification.toLowerCase().includes(q) ||
      fac.email.toLowerCase().includes(q) ||
      fac.subjects.some(s => s.toLowerCase().includes(q));

    return matchesDept && matchesRank && matchesQuery;
  });

  return (
    <div className="space-y-6">
      {/* Top Bar for Guest View */}
      {isGuestView && onBackToAuth && (
        <div className="flex items-center justify-between rounded-2xl bg-slate-900 border border-slate-800 p-4 text-white shadow-md">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            <span className="text-xs font-semibold text-slate-200">
              {isBN ? 'পাবলিক গেস্ট ভিউ — প্রাতিষ্ঠানিক শিক্ষক ডিরেক্টরি' : 'Public Guest Access — View Official Campus Faculty Directory'}
            </span>
          </div>
          <button
            onClick={onBackToAuth}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{isBN ? 'লগইন / রেজিস্ট্রেশনে ফিরুন' : 'Back to Login / Register'}</span>
          </button>
        </div>
      )}

      {/* Main Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-bold text-indigo-300 border border-indigo-500/30">
                <Users className="h-3.5 w-3.5" />
                {isBN ? 'ক্যাম্পাস শিক্ষক পদমর্যাদা ও নির্দেশিকা' : 'Campus Academic Hierarchy & Directory'}
              </div>
              <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight">
                {isBN ? `ক্যাম্পাস শিক্ষক ডিরেক্টরি (${allFaculty.length} জন অধ্যাপক ও শিক্ষক)` : `Campus Faculty Directory (${allFaculty.length} Professors & Teachers)`}
              </h1>
            </div>
            {role === 'ADMIN' && (
              <button
                onClick={() => setActiveTab('teachers')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-lg shadow-emerald-500/30 transition shrink-0"
              >
                <Sparkles className="h-4 w-4" />
                <span>{isBN ? 'শিক্ষক পরিচালনা করুন (অ্যাডমিন)' : 'Manage & Add Teachers (Admin Panel)'}</span>
              </button>
            )}
          </div>
          <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
            {isBN 
              ? 'প্রিন্সিপাল, বিভাগীয় প্রধান (HOD), অধ্যাপক এবং প্রভাষকগণের তথ্য ক্রমানুসারে সাজানো হয়েছে। পূর্ণাঙ্গ বায়োগ্রাফি, শিক্ষাগত যোগ্যতা ও যোগাযোগের তথ্য।'
              : 'Organized serially by academic hierarchy rank — from Principal and Heads of Department (HOD) to Senior Professors and Faculty Lecturers. Detailed profile, qualifications, office hours, and contact information.'}
          </p>

          {/* Quick Stats Grid */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-amber-400 font-bold text-lg">1</div>
              <div className="text-[11px] text-slate-300">{isBN ? 'প্রিন্সিপাল ও ভিসি' : 'Principal & VC'}</div>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-purple-400 font-bold text-lg">5</div>
              <div className="text-[11px] text-slate-300">{isBN ? 'বিভাগীয় প্রধান (HOD)' : 'Heads of Dept (HOD)'}</div>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-indigo-400 font-bold text-lg">
                {allFaculty.filter(f => f.designation.toLowerCase().includes('professor')).length}
              </div>
              <div className="text-[11px] text-slate-300">{isBN ? 'অধ্যাপক ও সহযোগী' : 'Professors & Associates'}</div>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-emerald-400 font-bold text-lg">{departments.length}</div>
              <div className="text-[11px] text-slate-300">{isBN ? 'একাডেমিক বিভাগ' : 'Academic Departments'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="space-y-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={isBN ? "শিক্ষকের নাম, পদবী, বিষয় বা বিভাগ দিয়ে খুঁজুন..." : "Search teacher name, rank, department, subject, qualification..."}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            <select
              value={selectedRank}
              onChange={e => setSelectedRank(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 focus:outline-none"
            >
              <option value="ALL">{isBN ? 'সকল পদমর্যাদা (লেভেল ১-৬)' : 'All Hierarchy Levels (Ranks 1-6)'}</option>
              <option value="1">{isBN ? 'লেভেল ১: প্রিন্সিপাল' : 'Level 1: Principal & VC'}</option>
              <option value="2">{isBN ? 'লেভেল ২: বিভাগীয় প্রধান (HOD)' : 'Level 2: Head of Dept (HOD)'}</option>
              <option value="3">{isBN ? 'লেভেল ৩: পূর্ণ অধ্যাপক' : 'Level 3: Full Professor'}</option>
              <option value="4">{isBN ? 'লেভেল ৪: সহযোগী অধ্যাপক' : 'Level 4: Associate Professor'}</option>
              <option value="5">{isBN ? 'লেভেল ৫: সহকারী অধ্যাপক' : 'Level 5: Assistant Professor'}</option>
              <option value="6">{isBN ? 'লেভেল ৬: প্রভাষক' : 'Level 6: Lecturer'}</option>
            </select>
          </div>
        </div>

        {/* Department Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1 shrink-0">
            <Filter className="h-3.5 w-3.5" /> {isBN ? 'ডিপার্টমেন্ট:' : 'Department:'}
          </span>
          <button
            onClick={() => setSelectedDepartment('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 ${
              selectedDepartment === 'ALL'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            {isBN ? `সকল বিভাগ (${allFaculty.length})` : `All Departments (${allFaculty.length})`}
          </button>
          {departments.map(dept => {
            const count = allFaculty.filter(
              f => f.department === dept.name || f.department.startsWith(dept.name) || (dept.name.startsWith('প্রশাসন') && f.department === 'প্রশাসন')
            ).length;
            return (
              <button
                key={dept.id}
                onClick={() => setSelectedDepartment(dept.name)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 ${
                  selectedDepartment === dept.name
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {dept.code} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Serialized Faculty Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredFaculty.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
            No faculty members match your filter criteria. Try clearing the search query or department filter.
          </div>
        ) : (
          filteredFaculty.map((fac, index) => {
            const rankInfo = getHierarchyRank(fac.designation, fac.isPrincipal);
            return (
              <div
                key={fac.id}
                className="group relative flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
              >
                <div>
                  {/* Serial Rank Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-extrabold text-slate-400 font-mono">
                      SERIAL #{index + 1}
                    </span>
                    <span className={`px-2.5 py-1 rounded-full border text-[10px] font-bold ${rankInfo.bgClass} ${rankInfo.textClass}`}>
                      {rankInfo.label}
                    </span>
                  </div>

                  {/* Teacher Avatar & Header */}
                  <div className="flex items-start gap-4">
                    <UserAvatar
                      src={fac.avatar}
                      name={fac.name}
                      size="lg"
                    />
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                        {fac.name}
                      </h3>
                      <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
                        {fac.designation}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                        <Building2 className="h-3 w-3 text-slate-400 shrink-0" />
                        <span>{fac.department}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Info Grid */}
                  <div className="mt-4 space-y-2 border-t border-slate-100 dark:border-slate-800/80 pt-3 text-xs">
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                        <GraduationCap className="h-3.5 w-3.5" /> {isBN ? 'শিক্ষাগত যোগ্যতা' : 'Qualification'}
                      </span>
                      <span className="font-semibold text-right text-[11px] max-w-[180px] truncate">{fac.qualification}</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                        <Award className="h-3.5 w-3.5" /> {isBN ? 'অভিজ্ঞতা' : 'Experience'}
                      </span>
                      <span className="font-semibold text-[11px]">{fac.experienceYears} {isBN ? 'বছর' : 'Years Academic'}</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                        <MapPin className="h-3.5 w-3.5" /> {isBN ? 'অফিস রুম' : 'Office Location'}
                      </span>
                      <span className="font-semibold text-[11px]">{fac.officeRoom}</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                        <Clock className="h-3.5 w-3.5" /> {isBN ? 'সাক্ষাতের সময়' : 'Office Hours'}
                      </span>
                      <span className="font-semibold text-[11px]">{fac.officeHours}</span>
                    </div>
                  </div>

                  {/* Subjects Taught Chips */}
                  <div className="mt-3">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <BookOpen className="h-3 w-3" /> {isBN ? 'কোর্স ও গবেষণার ক্ষেত্র' : 'Courses & Specializations'}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {fac.subjects.map((subj, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-700 dark:text-slate-300"
                        >
                          {subj}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <Mail className="h-3 w-3 text-indigo-500" />
                    <span className="truncate max-w-[140px]">{fac.email}</span>
                  </div>

                  <button
                    onClick={() => setActiveTeacherModal(fac)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-400 text-xs font-bold transition shrink-0"
                  >
                    <span>{isBN ? 'পূর্ণাঙ্গ প্রোফাইল' : 'Full Profile'}</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Faculty Full Profile Modal */}
      {activeTeacherModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-4">
                <UserAvatar
                  src={activeTeacherModal.avatar}
                  name={activeTeacherModal.name}
                  size="lg"
                />
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {activeTeacherModal.name}
                  </h3>
                  <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    {activeTeacherModal.designation}
                  </div>
                  <div className="text-xs text-slate-500">{activeTeacherModal.department}</div>
                </div>
              </div>
              <button
                onClick={() => setActiveTeacherModal(null)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40">
                <div className="font-bold text-indigo-900 dark:text-indigo-200 mb-1 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-indigo-500" /> {isBN ? 'শিক্ষক পরিচিতি ও গবেষণার ক্ষেত্র' : 'Professional Biography & Research Focus'}
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {activeTeacherModal.biography}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div className="text-slate-400 font-semibold mb-1">{isBN ? 'সর্বোচ্চ শিক্ষাগত যোগ্যতা' : 'Highest Qualification'}</div>
                  <div className="font-bold text-slate-900 dark:text-white">{activeTeacherModal.qualification}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div className="text-slate-400 font-semibold mb-1">{isBN ? 'শিক্ষকতা অভিজ্ঞতা' : 'Academic Experience'}</div>
                  <div className="font-bold text-slate-900 dark:text-white">{activeTeacherModal.experienceYears} {isBN ? 'বছরের শিক্ষকতা' : 'Years Teaching'}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div className="text-slate-400 font-semibold mb-1 flex items-center gap-1">
                    <Mail className="h-3 w-3 text-indigo-500" /> {isBN ? 'ইমেইল অ্যাড্রেস' : 'Email Address'}
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white">{activeTeacherModal.email}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div className="text-slate-400 font-semibold mb-1 flex items-center gap-1">
                    <Phone className="h-3 w-3 text-indigo-500" /> {isBN ? 'ফোন যোগাযোগ' : 'Phone Contact'}
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white">
                    {activeTeacherModal.mobilePhone || activeTeacherModal.phone}
                    {activeTeacherModal.officePhone && ` (${isBN ? 'অফিস: ' : 'Off: '}${activeTeacherModal.officePhone})`}
                  </div>
                </div>

                {activeTeacherModal.bcsBatch && (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <div className="text-slate-400 font-semibold mb-1 flex items-center gap-1">
                      <Award className="h-3 w-3 text-indigo-500" /> {isBN ? 'বিসিএস ব্যাচ' : 'BCS Batch'}
                    </div>
                    <div className="font-bold text-slate-900 dark:text-white">{activeTeacherModal.bcsBatch}{isBN ? 'তম বিসিএস (কারিগরি শিক্ষা)' : 'th BCS (Technical Education)'}</div>
                  </div>
                )}

                {activeTeacherModal.shift && (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <div className="text-slate-400 font-semibold mb-1 flex items-center gap-1">
                      <Clock className="h-3 w-3 text-indigo-500" /> {isBN ? 'একাডেমিক শিফট' : 'Academic Shift'}
                    </div>
                    <div className="font-bold text-slate-900 dark:text-white">{activeTeacherModal.shift}</div>
                  </div>
                )}

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div className="text-slate-400 font-semibold mb-1 flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-indigo-500" /> {isBN ? 'অফিস রুম' : 'Office Room'}
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white">{activeTeacherModal.officeRoom}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div className="text-slate-400 font-semibold mb-1 flex items-center gap-1">
                    <Clock className="h-3 w-3 text-indigo-500" /> {isBN ? 'শিক্ষার্থী কাউন্সেলিং সময়' : 'Student Consultation Hours'}
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white">{activeTeacherModal.officeHours}</div>
                </div>
              </div>

              <div>
                <div className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4 text-indigo-500" /> {isBN ? 'পাঠদানকৃত বিষয়সমূহ' : 'Courses & Subjects Taught'}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {activeTeacherModal.subjects.map((subj, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-xl bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800"
                    >
                      {subj}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setActiveTeacherModal(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white dark:bg-slate-800 font-bold text-xs"
              >
                {isBN ? 'বন্ধ করুন' : 'Close Profile'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
