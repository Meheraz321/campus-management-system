import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserAvatar } from '../common/UserAvatar';
import {
  Users,
  GraduationCap,
  BookOpen,
  CheckCircle2,
  Clock,
  FileCheck2,
  Bell,
  Award,
  Search,
  Plus,
  Send,
  Calendar,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  UserPlus,
  FileText,
  Check,
  X,
  MessageSquare,
  Sparkles,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

interface DepartmentHeadDashboardProps {
  initialSubTab?: string;
}

export const DepartmentHeadDashboard: React.FC<DepartmentHeadDashboardProps> = ({ initialSubTab = 'overview' }) => {
  const {
    hodUser,
    teachers,
    students,
    routines,
    leaveRequests,
    notices,
    results,
    updateLeaveStatus,
    addNotice,
    addRoutineItem,
    sendPushNotification,
    language
  } = useApp();

  const isBN = language === 'BN';

  const [activeSubTab, setActiveSubTab] = useState<string>(initialSubTab);

  // Filters & State
  const [semesterFilter, setSemesterFilter] = useState<string>('ALL');
  const [studentSearch, setStudentSearch] = useState<string>('');
  const [teacherSearch, setTeacherSearch] = useState<string>('');
  
  // Modals state
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeContent, setNewNoticeContent] = useState('');
  const [newNoticeCategory, setNewNoticeCategory] = useState<'Academic' | 'Exam' | 'General' | 'Event'>('Academic');

  const [isAssignCourseOpen, setIsAssignCourseOpen] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [newCourseName, setNewCourseName] = useState('');

  const [isRoutineModalOpen, setIsRoutineModalOpen] = useState(false);
  const [routineDay, setRoutineDay] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'>('Monday');
  const [routineTime, setRoutineTime] = useState('09:00 AM - 10:30 AM');
  const [routineSubject, setRoutineSubject] = useState('');
  const [routineRoom, setRoutineRoom] = useState('Lab 301');
  const [routineSemester, setRoutineSemester] = useState('3rd Semester');
  const [routineTeacher, setRoutineTeacher] = useState('Prof. Sarah Jenkins');

  // Filter CSE teachers
  const cseTeachers = (teachers || []).filter(
    t => t && t.department && (t.department.toLowerCase().includes('computer') || t.department.toLowerCase().includes('cse'))
  );

  // Filter CSE students
  const cseStudents = (students || []).filter(
    s => s && s.department && (s.department.toLowerCase().includes('computer') || s.department.toLowerCase().includes('cse'))
  );

  // Filter CSE leave requests
  const cseLeaves = (leaveRequests || []).filter(
    l => l && l.department && (l.department.toLowerCase().includes('computer') || l.department.toLowerCase().includes('cse'))
  );

  // Filter CSE routines
  const cseRoutines = (routines || []).filter(
    r => r && r.department && (r.department.toLowerCase().includes('computer') || r.department.toLowerCase().includes('cse') || r.department === 'CSE')
  );

  const pendingLeavesCount = cseLeaves.filter(l => l.status === 'PENDING').length;
  const lowAttendanceStudents = cseStudents.filter(s => s.attendancePercentage < 75);

  // Syllabus completion data mock
  const syllabusProgress = [
    { semester: '1st Semester', subject: 'Structured Programming', progress: 88, teacher: 'Prof. Sarah Jenkins' },
    { semester: '3rd Semester', subject: 'Data Structures & Algorithms', progress: 75, teacher: 'Dr. Alan Turing' },
    { semester: '5th Semester', subject: 'Database Management Systems', progress: 82, teacher: 'Dr. Marcus Sterling' },
    { semester: '7th Semester', subject: 'Artificial Intelligence & ML', progress: 65, teacher: 'Prof. Sarah Jenkins' }
  ];

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoticeTitle || !newNoticeContent) return;

    addNotice({
      title: `[CSE Dept] ${newNoticeTitle}`,
      content: newNoticeContent,
      category: newNoticeCategory,
      publishedBy: `${hodUser.name} (HOD CSE)`,
      targetRole: 'ALL',
      isImportant: true
    });

    setIsNoticeModalOpen(false);
    setNewNoticeTitle('');
    setNewNoticeContent('');
    alert('Departmental Announcement published successfully!');
  };

  const handleAddRoutine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!routineSubject || !routineTeacher) return;

    addRoutineItem({
      day: routineDay,
      timeSlot: routineTime,
      subjectCode: 'CSE-' + Math.floor(100 + Math.random() * 900),
      subjectName: routineSubject,
      teacherName: routineTeacher,
      roomNumber: routineRoom,
      department: 'Computer Science & Engineering',
      semester: routineSemester,
      section: 'A'
    });

    setIsRoutineModalOpen(false);
    setRoutineSubject('');
    alert('Class routine slot added successfully!');
  };

  const handleSendAttendanceWarning = (studentName: string) => {
    sendPushNotification(
      'Attendance Warning Alert',
      `Dear ${studentName}, your current attendance in CSE department is below 75%. Please report to the HOD office.`,
      'STUDENT'
    );
    alert(`Attendance warning notification sent to ${studentName}`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner / HOD Identity Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-purple-950 to-indigo-950 p-6 text-white shadow-xl sm:p-8">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl pointer-events-none"></div>
        
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <UserAvatar
              src={hodUser.avatar}
              name={hodUser.name}
              size="xl"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full border border-purple-400/30 bg-purple-500/20 px-3 py-1 text-xs font-semibold text-purple-300">
                  <Award className="h-3.5 w-3.5 text-purple-400" />
                  {isBN ? 'বিভাগীয় প্রধান (HOD)' : 'Head of Department (HOD)'}
                </span>
                <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                  {isBN ? 'সক্রিয় দায়িত্ব' : 'Active Tenure'}
                </span>
              </div>
              <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                {hodUser.name}
              </h1>
              <p className="mt-1 text-xs text-purple-200/80 max-w-xl">
                {hodUser.department} • {isBN ? `অফিস: ${hodUser.officeRoom}` : `Office: ${hodUser.officeRoom}`}
              </p>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center backdrop-blur-sm">
              <div className="text-xl font-extrabold text-purple-300">{cseTeachers.length}</div>
              <div className="text-[10px] text-slate-300 font-medium mt-0.5">
                {isBN ? 'বিভাগের শিক্ষক' : 'Dept Faculty'}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center backdrop-blur-sm">
              <div className="text-xl font-extrabold text-indigo-300">{cseStudents.length || 480}</div>
              <div className="text-[10px] text-slate-300 font-medium mt-0.5">
                {isBN ? 'শিক্ষার্থীবৃন্দ' : 'Students'}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center backdrop-blur-sm">
              <div className="text-xl font-extrabold text-emerald-300">94.2%</div>
              <div className="text-[10px] text-slate-300 font-medium mt-0.5">
                {isBN ? 'গড় উপস্থিতি' : 'Avg Attendance'}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center backdrop-blur-sm">
              <div className="text-xl font-extrabold text-amber-300">{pendingLeavesCount}</div>
              <div className="text-[10px] text-slate-300 font-medium mt-0.5">
                {isBN ? 'অপেক্ষমাণ ছুটি' : 'Pending Leaves'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto border-b border-slate-200/80 pb-2 dark:border-slate-800 scrollbar-none">
        <button
          onClick={() => setActiveSubTab('overview')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all whitespace-nowrap ${
            activeSubTab === 'overview'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25'
              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
          }`}
        >
          <BarChart3 className="h-4 w-4" />
          <span>{isBN ? 'এইচওডি ওভারভিউ' : 'HOD Overview'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('faculty')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all whitespace-nowrap ${
            activeSubTab === 'faculty'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25'
              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
          }`}
        >
          <Users className="h-4 w-4" />
          <span>{isBN ? `বিভাগীয় শিক্ষক (${cseTeachers.length})` : `Department Faculty (${cseTeachers.length})`}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('students')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all whitespace-nowrap ${
            activeSubTab === 'students'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25'
              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
          }`}
        >
          <GraduationCap className="h-4 w-4" />
          <span>{isBN ? 'শিক্ষার্থী অডিট' : 'Student Audit'}</span>
          {lowAttendanceStudents.length > 0 && (
            <span className="rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
              {lowAttendanceStudents.length} {isBN ? 'ঝুঁকি' : 'Risk'}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('routine')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all whitespace-nowrap ${
            activeSubTab === 'routine'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25'
              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
          }`}
        >
          <Clock className="h-4 w-4" />
          <span>{isBN ? 'রুটিন ও বিষয়সমূহ' : 'Routine & Subjects'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('leaves')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all whitespace-nowrap ${
            activeSubTab === 'leaves'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25'
              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
          }`}
        >
          <FileCheck2 className="h-4 w-4" />
          <span>{isBN ? 'ছুটির অনুমোদন' : 'Leave Approvals'}</span>
          {pendingLeavesCount > 0 && (
            <span className="rounded-full bg-amber-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
              {pendingLeavesCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('notices')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all whitespace-nowrap ${
            activeSubTab === 'notices'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25'
              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
          }`}
        >
          <Bell className="h-4 w-4" />
          <span>{isBN ? 'বিভাগীয় নোটিশ' : 'Dept Notices'}</span>
        </button>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* SUB-TAB 1: OVERVIEW */}
      {/* ---------------------------------------------------------------- */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {isBN ? 'বিভাগীয় প্রধানের কুইক অ্যাকশন' : 'Department Head Quick Actions'}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setIsNoticeModalOpen(true)}
                className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-3 py-2 text-xs font-semibold text-white shadow-md shadow-purple-600/20 hover:bg-purple-700 transition"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>{isBN ? 'বিভাগীয় নোটিশ প্রকাশ' : 'Issue Dept Notice'}</span>
              </button>

              <button
                onClick={() => setIsRoutineModalOpen(true)}
                className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition"
              >
                <Calendar className="h-3.5 w-3.5" />
                <span>{isBN ? 'ক্লাস স্লট যুক্ত করুন' : 'Add Class Slot'}</span>
              </button>

              <button
                onClick={() => setActiveSubTab('leaves')}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 transition"
              >
                <FileCheck2 className="h-3.5 w-3.5 text-amber-500" />
                <span>{isBN ? `অপেক্ষমাণ ছুটি পর্যালোচনা (${pendingLeavesCount})` : `Review Pending Leaves (${pendingLeavesCount})`}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left 2 Columns: Syllabus Progress & Low Attendance Alerts */}
            <div className="space-y-6 lg:col-span-2">
              {/* Syllabus Completion Card */}
              <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Departmental Syllabus Completion Progress
                    </h3>
                    <p className="text-xs text-slate-500">Current mid-semester course coverage tracking</p>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                    On Schedule (78% Avg)
                  </span>
                </div>

                <div className="space-y-4">
                  {syllabusProgress.map((item, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {item.subject} <span className="text-slate-400 font-normal">({item.semester})</span>
                        </span>
                        <span className="font-bold text-purple-600 dark:text-purple-400">{item.progress}%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            item.progress >= 80
                              ? 'bg-emerald-500'
                              : item.progress >= 70
                              ? 'bg-indigo-500'
                              : 'bg-amber-500'
                          }`}
                          style={{ width: `${item.progress}%` }}
                        ></div>
                      </div>
                      <div className="text-[10px] text-slate-400">Assigned Faculty: {item.teacher}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Attendance Risk Warning Alert Card */}
              <div className="rounded-3xl border border-rose-200/80 bg-rose-50/40 p-6 shadow-sm dark:border-rose-900/50 dark:bg-rose-950/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="h-5 w-5 text-rose-500" />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        Attendance Risk Alert (&lt;75% Threshold)
                      </h3>
                      <p className="text-xs text-slate-500">Students requiring immediate departmental intervention</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white">
                    {lowAttendanceStudents.length} Students
                  </span>
                </div>

                <div className="space-y-2.5">
                  {lowAttendanceStudents.map((st, i) => (
                    <div
                      key={i}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-2xl border border-rose-200 bg-white p-3 dark:border-rose-900/60 dark:bg-slate-900"
                    >
                      <div className="flex items-center gap-3">
                        <UserAvatar
                          src={st.avatar}
                          name={st.name}
                          size="sm"
                        />
                        <div>
                          <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{st.name}</div>
                          <div className="text-[10px] text-slate-400">{st.rollNumber} • {st.semester}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-extrabold text-rose-600 dark:text-rose-400">
                          {st.attendancePercentage}% Attendance
                        </span>
                        <button
                          onClick={() => handleSendAttendanceWarning(st.name)}
                          className="rounded-xl bg-rose-600 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-rose-700 transition"
                        >
                          Send Warning
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Pending Approvals & Dept Notices Preview */}
            <div className="space-y-6">
              {/* Pending Department Leaves Widget */}
              <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Pending Leave Requests
                  </h3>
                  <button
                    onClick={() => setActiveSubTab('leaves')}
                    className="text-xs font-semibold text-purple-600 hover:underline dark:text-purple-400"
                  >
                    View All ({cseLeaves.length})
                  </button>
                </div>

                {cseLeaves.filter(l => l.status === 'PENDING').length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400">
                    <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500 mb-2" />
                    All department leave applications reviewed!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cseLeaves
                      .filter(l => l.status === 'PENDING')
                      .slice(0, 3)
                      .map(leave => (
                        <div
                          key={leave.id}
                          className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-800/50"
                        >
                          <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                            <span>{leave.applicantName}</span>
                            <span className="text-[10px] rounded-full bg-purple-100 text-purple-700 px-2 py-0.5 dark:bg-purple-950 dark:text-purple-300">
                              {leave.leaveType}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-slate-500 line-clamp-2">{leave.reason}</p>
                          <div className="mt-2 flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-700">
                            <span className="text-[10px] text-slate-400">{leave.startDate} to {leave.endDate}</span>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => updateLeaveStatus(leave.id, 'APPROVED', 'Approved by HOD')}
                                className="rounded-lg bg-emerald-600 px-2.5 py-1 text-[10px] font-bold text-white hover:bg-emerald-700"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => updateLeaveStatus(leave.id, 'REJECTED', 'Rejected by HOD')}
                                className="rounded-lg bg-rose-600 px-2.5 py-1 text-[10px] font-bold text-white hover:bg-rose-700"
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Department Head Announcements Feed */}
              <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Department Notices
                  </h3>
                  <button
                    onClick={() => setIsNoticeModalOpen(true)}
                    className="flex items-center gap-1 text-xs font-semibold text-purple-600 hover:underline dark:text-purple-400"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    New Notice
                  </button>
                </div>

                <div className="space-y-3">
                  {notices.slice(0, 3).map(notice => (
                    <div
                      key={notice.id}
                      className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-800/40"
                    >
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {notice.title}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{notice.content}</p>
                      <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between">
                        <span>By {notice.publishedBy}</span>
                        <span>{notice.publishDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* SUB-TAB 2: DEPARTMENT FACULTY */}
      {/* ---------------------------------------------------------------- */}
      {activeSubTab === 'faculty' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Computer Science & Engineering Faculty Roster
              </h2>
              <p className="text-xs text-slate-500">Supervise, assign course loads, and review faculty profiles</p>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={teacherSearch}
                onChange={e => setTeacherSearch(e.target.value)}
                placeholder="Search CSE teachers..."
                className="rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 py-2 text-xs text-slate-800 focus:border-purple-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cseTeachers
              .filter(t => (t.name?.toLowerCase() || '').includes(teacherSearch.toLowerCase()) || (t.subjects || []).some(s => (s?.toLowerCase() || '').includes(teacherSearch.toLowerCase())))
              .map(t => (
                <div
                  key={t.id}
                  className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:border-purple-300 dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={t.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80'}
                      alt={t.name}
                      className="h-14 w-14 rounded-2xl object-cover shrink-0"
                    />
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">{t.name}</div>
                      <div className="text-xs font-semibold text-purple-600 dark:text-purple-400">{t.designation}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{t.email}</div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Assigned Courses:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{t.subjects.length} Subjects</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {t.subjects.map((sub, idx) => (
                        <span
                          key={idx}
                          className="rounded-lg bg-purple-50 px-2 py-0.5 text-[10px] font-medium text-purple-700 dark:bg-purple-950/60 dark:text-purple-300"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedTeacherId(t.id);
                        setIsAssignCourseOpen(true);
                      }}
                      className="flex-1 rounded-xl bg-purple-600 py-2 text-center text-xs font-semibold text-white hover:bg-purple-700 transition"
                    >
                      Assign Course
                    </button>
                    <button
                      onClick={() => alert(`Contacting ${t.name}: ${t.phone || t.email}`)}
                      className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300"
                      title="Contact Teacher"
                    >
                      <MessageSquare className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* SUB-TAB 3: STUDENT AUDIT */}
      {/* ---------------------------------------------------------------- */}
      {activeSubTab === 'students' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                CSE Department Student Audit & Attendance Tracker
              </h2>
              <p className="text-xs text-slate-500">Monitor academic performance, CGPA distribution, and low attendance</p>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={semesterFilter}
                onChange={e => setSemesterFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-purple-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              >
                <option value="ALL">All Semesters</option>
                <option value="1st Semester">1st Semester</option>
                <option value="3rd Semester">3rd Semester</option>
                <option value="5th Semester">5th Semester</option>
                <option value="7th Semester">7th Semester</option>
              </select>

              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={studentSearch}
                  onChange={e => setStudentSearch(e.target.value)}
                  placeholder="Search name or roll..."
                  className="rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 py-2 text-xs text-slate-800 focus:border-purple-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-200 bg-slate-50/80 text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
                  <tr>
                    <th className="px-6 py-3.5 font-bold">Student Info</th>
                    <th className="px-6 py-3.5 font-bold">Roll / Reg No</th>
                    <th className="px-6 py-3.5 font-bold">Semester</th>
                    <th className="px-6 py-3.5 font-bold">CGPA</th>
                    <th className="px-6 py-3.5 font-bold">Attendance %</th>
                    <th className="px-6 py-3.5 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {cseStudents
                    .filter(
                      st =>
                        (semesterFilter === 'ALL' || st.semester === semesterFilter) &&
                        (st.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
                          st.rollNumber.toLowerCase().includes(studentSearch.toLowerCase()))
                    )
                    .map(st => (
                      <tr key={st.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <UserAvatar
                              src={st.avatar}
                              name={st.name}
                              size="sm"
                            />
                            <div>
                              <div className="font-bold text-slate-800 dark:text-slate-100">{st.name}</div>
                              <div className="text-[10px] text-slate-400">{st.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">
                          {st.rollNumber}
                        </td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                          {st.semester}
                        </td>
                        <td className="px-6 py-4 font-bold text-purple-600 dark:text-purple-400">
                          {st.cgpa || 3.82}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                              st.attendancePercentage >= 85
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : st.attendancePercentage >= 75
                                ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                                : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                            }`}
                          >
                            {st.attendancePercentage}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleSendAttendanceWarning(st.name)}
                            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-purple-50 hover:text-purple-600 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
                          >
                            Issue Notice
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* SUB-TAB 4: ROUTINE & SUBJECTS */}
      {/* ---------------------------------------------------------------- */}
      {activeSubTab === 'routine' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                CSE Department Class Timetable & Routine Allocation
              </h2>
              <p className="text-xs text-slate-500">Manage daily class schedules and lab room allocations</p>
            </div>

            <button
              onClick={() => setIsRoutineModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-purple-600/20 hover:bg-purple-700 transition"
            >
              <Plus className="h-4 w-4" />
              <span>Add Class Slot</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(dayName => {
              const dayItems = cseRoutines.filter(r => r.day === dayName);
              return (
                <div
                  key={dayName}
                  className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800 mb-3">
                    <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                      {dayName}
                    </span>
                    <span className="text-[10px] text-slate-400">{dayItems.length} Classes Scheduled</span>
                  </div>

                  {dayItems.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-400">No slots for {dayName}</div>
                  ) : (
                    <div className="space-y-2.5">
                      {dayItems.map(item => (
                        <div
                          key={item.id}
                          className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3 dark:border-slate-800/80 dark:bg-slate-800/40"
                        >
                          <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-100">
                            <span>{item.subjectName}</span>
                            <span className="text-[10px] font-semibold text-purple-600 dark:text-purple-300">
                              {item.timeSlot}
                            </span>
                          </div>
                          <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
                            <span>Instructor: {item.teacherName}</span>
                            <span className="rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                              {item.roomNumber}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* SUB-TAB 5: LEAVE APPROVALS */}
      {/* ---------------------------------------------------------------- */}
      {activeSubTab === 'leaves' && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              CSE Departmental Leave Applications
            </h2>
            <p className="text-xs text-slate-500">Review leave applications submitted by students and faculty</p>

            <div className="mt-6 space-y-4">
              {cseLeaves.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400">No leave applications submitted yet.</div>
              ) : (
                cseLeaves.map(leave => (
                  <div
                    key={leave.id}
                    className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-800/40"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 font-bold text-sm">
                          {leave.applicantName.charAt(0)}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white">
                            {leave.applicantName} <span className="text-slate-400 font-normal">({leave.applicantRole})</span>
                          </div>
                          <div className="text-[10px] text-slate-500">Applied on: {leave.appliedDate}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                            leave.status === 'APPROVED'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : leave.status === 'REJECTED'
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}
                        >
                          {leave.status}
                        </span>

                        {leave.status === 'PENDING' && (
                          <div className="flex items-center gap-1.5 ml-2">
                            <button
                              onClick={() => updateLeaveStatus(leave.id, 'APPROVED', 'Approved by HOD')}
                              className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => updateLeaveStatus(leave.id, 'REJECTED', 'Rejected by HOD')}
                              className="rounded-xl bg-rose-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-rose-700"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 rounded-xl bg-white p-3 text-xs text-slate-700 dark:bg-slate-900 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700">
                      <span className="font-semibold text-purple-600 dark:text-purple-400">Reason ({leave.leaveType}): </span>
                      {leave.reason}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* SUB-TAB 6: NOTICES */}
      {/* ---------------------------------------------------------------- */}
      {activeSubTab === 'notices' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                CSE Department Announcements & Circulars
              </h2>
              <p className="text-xs text-slate-500">Publish urgent circulars to CSE students & faculty</p>
            </div>

            <button
              onClick={() => setIsNoticeModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-purple-600/20 hover:bg-purple-700 transition"
            >
              <Plus className="h-4 w-4" />
              <span>Create Announcement</span>
            </button>
          </div>

          <div className="space-y-4">
            {notices.map(notice => (
              <div
                key={notice.id}
                className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                    {notice.category}
                  </span>
                  <span className="text-xs text-slate-400">{notice.publishDate}</span>
                </div>
                <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">{notice.title}</h3>
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 whitespace-pre-line">{notice.content}</p>
                <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between dark:border-slate-800">
                  <span>Published by: {notice.publishedBy}</span>
                  <span>Target Audience: {notice.targetRole}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: CREATE NOTICE */}
      {isNoticeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Issue Department Notice</h3>
              <button
                onClick={() => setIsNoticeModalOpen(false)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNotice} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Notice Title</label>
                <input
                  type="text"
                  required
                  value={newNoticeTitle}
                  onChange={e => setNewNoticeTitle(e.target.value)}
                  placeholder="e.g. Mandatory Lab Exam Schedule for 5th Semester"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-purple-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                <select
                  value={newNoticeCategory}
                  onChange={e => setNewNoticeCategory(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-purple-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                >
                  <option value="Academic">Academic</option>
                  <option value="Exam">Exam</option>
                  <option value="General">General</option>
                  <option value="Event">Event</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Content</label>
                <textarea
                  rows={4}
                  required
                  value={newNoticeContent}
                  onChange={e => setNewNoticeContent(e.target.value)}
                  placeholder="Write notice details..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-purple-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNoticeModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white hover:bg-purple-700"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD ROUTINE SLOT */}
      {isRoutineModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Add CSE Class Routine Slot</h3>
              <button
                onClick={() => setIsRoutineModalOpen(false)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddRoutine} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Day</label>
                  <select
                    value={routineDay}
                    onChange={e => setRoutineDay(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-purple-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Time Slot</label>
                  <input
                    type="text"
                    value={routineTime}
                    onChange={e => setRoutineTime(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-purple-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Subject Name</label>
                <input
                  type="text"
                  required
                  value={routineSubject}
                  onChange={e => setRoutineSubject(e.target.value)}
                  placeholder="e.g. Artificial Intelligence & Neural Networks"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-purple-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Instructor</label>
                  <select
                    value={routineTeacher}
                    onChange={e => setRoutineTeacher(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-purple-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  >
                    {cseTeachers.map(t => (
                      <option key={t.id} value={t.name}>{t.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Room / Lab No</label>
                  <input
                    type="text"
                    value={routineRoom}
                    onChange={e => setRoutineRoom(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-purple-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRoutineModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white hover:bg-purple-700"
                >
                  Save Schedule Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ASSIGN COURSE */}
      {isAssignCourseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Assign Course Subject</h3>
            <p className="text-xs text-slate-500 mt-1">Assign a new course load to selected CSE faculty</p>

            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Course Title</label>
                <input
                  type="text"
                  value={newCourseName}
                  onChange={e => setNewCourseName(e.target.value)}
                  placeholder="e.g. Distributed Computing"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-purple-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAssignCourseOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (newCourseName) {
                      alert(`Assigned course "${newCourseName}" successfully!`);
                      setIsAssignCourseOpen(false);
                      setNewCourseName('');
                    }
                  }}
                  className="rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white hover:bg-purple-700"
                >
                  Confirm Assignment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
