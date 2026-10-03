import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  Language,
  ColorMode,
  AccentColor,
  RegisteredUser,
  StudentProfile,
  TeacherProfile,
  Department,
  Subject,
  RoutineItem,
  ExamScheduleItem,
  AttendanceRecord,
  Assignment,
  AssignmentSubmission,
  StudyMaterial,
  Notice,
  EventItem,
  ResultRecord,
  FeeRecord,
  LeaveRequest,
  ChatMessage,
  NotificationItem,
  SystemLog
} from '../types';
import { getTranslation } from '../utils/translations';

import {
  INITIAL_DEPARTMENTS,
  INITIAL_TEACHERS,
  INITIAL_STUDENTS,
  INITIAL_SUBJECTS,
  INITIAL_ROUTINE,
  INITIAL_EXAM_SCHEDULE,
  INITIAL_NOTICES,
  INITIAL_ASSIGNMENTS,
  INITIAL_SUBMISSIONS,
  INITIAL_STUDY_MATERIALS,
  INITIAL_ATTENDANCE,
  INITIAL_RESULTS,
  INITIAL_FEES,
  INITIAL_LEAVE_REQUESTS,
  INITIAL_EVENTS,
  INITIAL_CHAT,
  INITIAL_NOTIFICATIONS,
  INITIAL_SYSTEM_LOGS
} from '../mockData';

import {
  exportRegisteredUsersExcel,
  exportRegisteredUsersPDF,
  downloadRegistrationSlipPDF
} from '../utils/exportUtils';

const DEFAULT_EMPTY_STUDENT: StudentProfile = {
  id: 'std-empty',
  userId: 'u-std-empty',
  name: '',
  rollNumber: '',
  registrationNumber: '',
  department: 'Computer Science & Engineering',
  semester: '1st Semester',
  section: 'A',
  session: '2025-2026',
  email: '',
  phone: '',
  address: '',
  bloodGroup: '',
  avatar: '',
  cgpa: 0,
  attendancePercentage: 0,
  pendingFees: 0,
  guardianName: '',
  guardianPhone: ''
};

const DEFAULT_EMPTY_TEACHER: TeacherProfile = {
  id: 'tch-empty',
  userId: '',
  name: '',
  designation: 'Teacher / শিক্ষক',
  department: '',
  email: '',
  phone: '',
  avatar: '',
  qualification: '',
  subjects: [],
  officeRoom: '',
  experienceYears: 0,
  biography: '',
  officeHours: ''
};

const DEFAULT_EMPTY_ADMIN: TeacherProfile = {
  id: 'adm-empty',
  userId: '',
  name: '',
  designation: 'Master System Administrator & Controller',
  department: 'সিস্টেম প্রশাসন (IT & Control)',
  email: '',
  phone: '',
  avatar: '',
  qualification: '',
  subjects: [],
  officeRoom: '',
  experienceYears: 0,
  biography: '',
  officeHours: '',
  isAdmin: true
};

const DEFAULT_EMPTY_PRINCIPAL: TeacherProfile = {
  id: 'pri-empty',
  userId: '',
  name: '',
  designation: 'অধ্যক্ষ ও প্রধান নির্বাহী (Principal)',
  department: 'প্রশাসন (Administration)',
  email: '',
  phone: '',
  avatar: '',
  qualification: '',
  subjects: [],
  officeRoom: '',
  experienceYears: 0,
  biography: '',
  officeHours: '',
  isPrincipal: true,
  speechText: ''
};

const DEFAULT_EMPTY_HOD: TeacherProfile = {
  id: 'hod-empty',
  userId: '',
  name: '',
  designation: 'বিভাগীয় প্রধান (Head of Department)',
  department: '',
  email: '',
  phone: '',
  avatar: '',
  qualification: '',
  subjects: [],
  officeRoom: '',
  experienceYears: 0,
  biography: '',
  officeHours: '',
  isHOD: true
};

const DEFAULT_SYSTEM_SETTINGS = {
  campusName: 'সরকারি পলিটেকনিক ইনস্টিটিউট ও টেকনিক্যাল কলেজ',
  campusTagline: 'আধুনিক প্রযুক্তি ও উদ্ভাবনী শিক্ষার ডিজিটাল ক্যাম্পাস',
  collegeCode: 'GPI-54012',
  eiinNumber: '133452',
  officialEmail: 'info@campus.edu.bd',
  contactPhone: '+880 1712-345678',
  campusAddress: 'কলেজ রোড, প্রধান প্রশাসনিক ভবন, ঢাকা',
  academicYear: '2025-2026',
  allowOnlineAdmission: true,
  allowStudentChat: true,
  allowOnlineFeePayment: true,
  allowResultPublishing: true,
  allowLeaveApplications: true,
  maintenanceMode: false
};

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  isAuthenticated: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  theme: 'light' | 'dark';
  colorMode: ColorMode;
  setColorMode: (mode: ColorMode) => void;
  toggleTheme: () => void;
  accentColor: AccentColor;
  setAccentColor: (accent: AccentColor) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  isBN: boolean;
  l: (bn: string, en: string) => string;
  t: (key: string) => string;
  
  // Dynamic Registered Users Database
  registeredUsers: RegisteredUser[];

  // Auth actions
  login: (selectedRole: UserRole, identifier: string, pass: string) => { success: boolean; message: string };
  loginWithGoogle: (googleUser: { uid: string; email: string | null; displayName: string | null; photoURL: string | null }) => void;
  registerStudent: (data: { name: string; rollNumber: string; email: string; department: string; semester: string; password: string; avatar?: string }) => { success: boolean; message: string };
  registerTeacher: (data: { name: string; email: string; designation: string; department: string; phone: string; password: string; avatar?: string }) => { success: boolean; message: string };
  registerAdmin: (data: { name: string; email: string; adminKey: string; password: string; avatar?: string }) => { success: boolean; message: string };
  registerPrincipal: (data: { name: string; email: string; phone: string; password: string; avatar?: string }) => { success: boolean; message: string };
  registerHOD: (data: { name: string; email: string; department: string; password: string; avatar?: string }) => { success: boolean; message: string };
  deleteRegisteredUser: (id: string) => void;
  updateUserRole: (userId: string, newRole: UserRole) => void;
  toggleUserStatus: (userId: string) => void;
  resetUserPassword: (userId: string, newPass: string) => void;
  exportUsersExcel: () => void;
  exportUsersPDF: () => void;
  downloadSlipPDF: (user: any) => void;
  logout: () => void;
  
  // System Master Settings & Toggles
  systemSettings: typeof DEFAULT_SYSTEM_SETTINGS;
  updateSystemSettings: (newSettings: Partial<typeof DEFAULT_SYSTEM_SETTINGS>) => void;
  toggleFeature: (featureKey: keyof typeof DEFAULT_SYSTEM_SETTINGS) => void;
  resetToDemoData: () => void;

  // Entities
  departments: Department[];
  teachers: TeacherProfile[];
  students: StudentProfile[];
  subjects: Subject[];
  routines: RoutineItem[];
  examSchedules: ExamScheduleItem[];
  notices: Notice[];
  assignments: Assignment[];
  submissions: AssignmentSubmission[];
  materials: StudyMaterial[];
  attendanceRecords: AttendanceRecord[];
  results: ResultRecord[];
  fees: FeeRecord[];
  leaveRequests: LeaveRequest[];
  events: EventItem[];
  messages: ChatMessage[];
  notifications: NotificationItem[];
  systemLogs: SystemLog[];
  
  // Active Profiles
  currentStudent: StudentProfile;
  currentTeacher: TeacherProfile;
  principalUser: TeacherProfile;
  adminUser: TeacherProfile;
  hodUser: TeacherProfile;

  // Actions
  addStudent: (student: Omit<StudentProfile, 'id'>) => void;
  updateStudent: (student: StudentProfile) => void;
  deleteStudent: (id: string) => void;
  
  addTeacher: (teacher: Omit<TeacherProfile, 'id'>) => void;
  updateTeacher: (teacher: TeacherProfile) => void;
  deleteTeacher: (id: string) => void;
  
  addNotice: (notice: Omit<Notice, 'id' | 'publishDate'>) => void;
  deleteNotice: (id: string) => void;
  
  addAssignment: (assignment: Omit<Assignment, 'id' | 'createdAt'>) => void;
  submitAssignment: (assignmentId: string, fileName: string) => void;
  gradeSubmission: (submissionId: string, marks: number, feedback: string) => void;
  
  addMaterial: (material: Omit<StudyMaterial, 'id' | 'uploadedAt'>) => void;
  deleteMaterial: (id: string) => void;
  
  addAttendance: (records: Omit<AttendanceRecord, 'id'>[]) => void;
  addLeaveRequest: (request: Omit<LeaveRequest, 'id' | 'status' | 'appliedDate'>) => void;
  updateLeaveStatus: (id: string, status: 'APPROVED' | 'REJECTED', remark?: string) => void;
  
  sendChatMessage: (receiverId: string, messageText: string) => void;
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  sendPushNotification: (title: string, message: string, targetRole: 'ALL' | 'STUDENT' | 'TEACHER') => void;
  
  payFee: (feeId: string) => void;
  addRoutineItem: (item: Omit<RoutineItem, 'id'>) => void;
  updateUserProfile: (data: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    department?: string;
    semester?: string;
    designation?: string;
    qualification?: string;
    officeRoom?: string;
    officeHours?: string;
    biography?: string;
    avatar?: string;
    guardianName?: string;
    guardianPhone?: string;
    rollNumber?: string;
  }) => void;
  
  // UI Controls
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isQRModalOpen: boolean;
  setIsQRModalOpen: (open: boolean) => void;
  isNotifOpen: boolean;
  setIsNotifOpen: (open: boolean) => void;
  
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper to filter out stale demo accounts
const filterStaleDemo = (u: RegisteredUser) => {
  if (!u || !u.id) return false;
  const id = u.id.toLowerCase();
  const email = (u.email || '').toLowerCase();
  if (id.includes('demo') || id.includes('test-seed') || ['std-1', 'std-2', 'std-3', 'std-4', 'tch-1', 'tch-2', 'tch-3', 'tch-4', 'tch-5'].includes(id)) {
    return false;
  }
  if (['admin@campus.edu', 'principal@campus.edu', 'hod@campus.edu', 'teacher@campus.edu', 'student@campus.edu'].includes(email)) {
    return false;
  }
  return true;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Read active authentication session from localStorage
  const [role, setRole] = useState<UserRole>(() => {
    try {
      const savedAuth = localStorage.getItem('academia_auth_session');
      if (savedAuth) {
        const parsed = JSON.parse(savedAuth);
        if (parsed.role) return parsed.role;
      }
    } catch {}
    return 'STUDENT';
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const savedAuth = localStorage.getItem('academia_auth_session');
      if (savedAuth) {
        const parsed = JSON.parse(savedAuth);
        return Boolean(parsed.isAuthenticated);
      }
    } catch {}
    return false;
  });

  const [activeTab, setActiveTab] = useState<string>(() => {
    try {
      const savedAuth = localStorage.getItem('academia_auth_session');
      if (savedAuth) {
        const parsed = JSON.parse(savedAuth);
        if (parsed.activeTab) return parsed.activeTab;
      }
    } catch {}
    return 'dashboard_student';
  });
  
  // Persistent language (defaults to BN since user asked in Bengali)
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('academia_language');
      if (saved === 'BN' || saved === 'EN') return saved;
      return 'BN';
    } catch {
      return 'BN';
    }
  });

  // Persistent color mode ('light' | 'dark' | 'system')
  const [colorMode, setColorMode] = useState<ColorMode>(() => {
    try {
      const saved = localStorage.getItem('academia_color_mode');
      if (saved === 'light' || saved === 'dark' || saved === 'system') return saved;
      return 'light';
    } catch {
      return 'light';
    }
  });

  // Persistent accent color theme
  const [accentColor, setAccentColor] = useState<AccentColor>(() => {
    try {
      const saved = localStorage.getItem('academia_accent_color');
      if (saved && ['indigo', 'emerald', 'blue', 'purple', 'amber'].includes(saved)) {
        return saved as AccentColor;
      }
      return 'indigo';
    } catch {
      return 'indigo';
    }
  });

  // Effective theme computed from colorMode
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const savedMode = localStorage.getItem('academia_color_mode');
      if (savedMode === 'dark') return 'dark';
      if (savedMode === 'system') {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      return 'light';
    } catch {
      return 'light';
    }
  });
  
  // Registered users persistent database - strictly user-added and preserved in storage
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>(() => {
    try {
      const userMap = new Map<string, RegisteredUser>();
      const saved = localStorage.getItem('academia_registered_users');
      if (saved) {
        const parsed: RegisteredUser[] = JSON.parse(saved);
        parsed.filter(filterStaleDemo).forEach(u => {
          const key = `${u.role}_${(u.identifier || u.email || u.id).toLowerCase()}`;
          userMap.set(key, u);
          userMap.set(u.id, u);
        });
      }
      return Array.from(new Set(userMap.values()));
    } catch {
      return [];
    }
  });

  const [departments, setDepartments] = useState<Department[]>(() => {
    try {
      const saved = localStorage.getItem('academia_departments');
      return saved ? JSON.parse(saved) : INITIAL_DEPARTMENTS;
    } catch {
      return INITIAL_DEPARTMENTS;
    }
  });
  
  const [teachers, setTeachers] = useState<TeacherProfile[]>(() => {
    try {
      const saved = localStorage.getItem('academia_teachers');
      if (saved) {
        const parsed: TeacherProfile[] = JSON.parse(saved);
        return parsed.filter(t => t && t.id && !t.id.includes('demo') && !['tch-1', 'tch-2', 'tch-3', 'tch-4', 'tch-5'].includes(t.id));
      }
      return [];
    } catch {
      return [];
    }
  });

  const [students, setStudents] = useState<StudentProfile[]>(() => {
    try {
      const saved = localStorage.getItem('academia_students');
      if (saved) {
        const parsed: StudentProfile[] = JSON.parse(saved);
        return parsed.filter(s => s && s.id && !s.id.includes('demo') && !['std-1', 'std-2', 'std-3', 'std-4', 'std-empty'].includes(s.id));
      }
      return [];
    } catch {
      return [];
    }
  });

  const [subjects, setSubjects] = useState<Subject[]>(() => {
    try {
      const saved = localStorage.getItem('academia_subjects');
      return saved ? JSON.parse(saved) : INITIAL_SUBJECTS;
    } catch {
      return INITIAL_SUBJECTS;
    }
  });

  const [routines, setRoutines] = useState<RoutineItem[]>(() => {
    try {
      const saved = localStorage.getItem('academia_routines');
      return saved ? JSON.parse(saved) : INITIAL_ROUTINE;
    } catch {
      return INITIAL_ROUTINE;
    }
  });

  const [examSchedules, setExamSchedules] = useState<ExamScheduleItem[]>(() => {
    try {
      const saved = localStorage.getItem('academia_exam_schedules');
      return saved ? JSON.parse(saved) : INITIAL_EXAM_SCHEDULE;
    } catch {
      return INITIAL_EXAM_SCHEDULE;
    }
  });

  const [notices, setNotices] = useState<Notice[]>(() => {
    try {
      const saved = localStorage.getItem('academia_notices');
      return saved ? JSON.parse(saved) : INITIAL_NOTICES;
    } catch {
      return INITIAL_NOTICES;
    }
  });

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    try {
      const saved = localStorage.getItem('academia_assignments');
      return saved ? JSON.parse(saved) : INITIAL_ASSIGNMENTS;
    } catch {
      return INITIAL_ASSIGNMENTS;
    }
  });

  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>(() => {
    try {
      const saved = localStorage.getItem('academia_submissions');
      return saved ? JSON.parse(saved) : INITIAL_SUBMISSIONS;
    } catch {
      return INITIAL_SUBMISSIONS;
    }
  });

  const [materials, setMaterials] = useState<StudyMaterial[]>(() => {
    try {
      const saved = localStorage.getItem('academia_materials');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_STUDY_MATERIALS;
    } catch {
      return INITIAL_STUDY_MATERIALS;
    }
  });

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    try {
      const saved = localStorage.getItem('academia_attendance');
      return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
    } catch {
      return INITIAL_ATTENDANCE;
    }
  });

  const [results, setResults] = useState<ResultRecord[]>(() => {
    try {
      const saved = localStorage.getItem('academia_results');
      return saved ? JSON.parse(saved) : INITIAL_RESULTS;
    } catch {
      return INITIAL_RESULTS;
    }
  });

  const [fees, setFees] = useState<FeeRecord[]>(() => {
    try {
      const saved = localStorage.getItem('academia_fees');
      return saved ? JSON.parse(saved) : INITIAL_FEES;
    } catch {
      return INITIAL_FEES;
    }
  });

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => {
    try {
      const saved = localStorage.getItem('academia_leave_requests');
      return saved ? JSON.parse(saved) : INITIAL_LEAVE_REQUESTS;
    } catch {
      return INITIAL_LEAVE_REQUESTS;
    }
  });

  const [events, setEvents] = useState<EventItem[]>(() => {
    try {
      const saved = localStorage.getItem('academia_events');
      return saved ? JSON.parse(saved) : INITIAL_EVENTS;
    } catch {
      return INITIAL_EVENTS;
    }
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('academia_messages');
      return saved ? JSON.parse(saved) : INITIAL_CHAT;
    } catch {
      return INITIAL_CHAT;
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem('academia_notifications');
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [systemLogs, setSystemLogs] = useState<SystemLog[]>(() => {
    try {
      const saved = localStorage.getItem('academia_system_logs');
      return saved ? JSON.parse(saved) : INITIAL_SYSTEM_LOGS;
    } catch {
      return INITIAL_SYSTEM_LOGS;
    }
  });

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Persist entities to localStorage whenever changed
  useEffect(() => {
    try { localStorage.setItem('academia_registered_users', JSON.stringify(registeredUsers)); } catch (e) { console.error(e); }
  }, [registeredUsers]);

  useEffect(() => {
    try { localStorage.setItem('academia_students', JSON.stringify(students)); } catch (e) { console.error(e); }
  }, [students]);

  useEffect(() => {
    try { localStorage.setItem('academia_teachers', JSON.stringify(teachers)); } catch (e) { console.error(e); }
  }, [teachers]);

  useEffect(() => {
    try { localStorage.setItem('academia_departments', JSON.stringify(departments)); } catch (e) { console.error(e); }
  }, [departments]);

  useEffect(() => {
    try { localStorage.setItem('academia_subjects', JSON.stringify(subjects)); } catch (e) { console.error(e); }
  }, [subjects]);

  useEffect(() => {
    try { localStorage.setItem('academia_routines', JSON.stringify(routines)); } catch (e) { console.error(e); }
  }, [routines]);

  useEffect(() => {
    try { localStorage.setItem('academia_exam_schedules', JSON.stringify(examSchedules)); } catch (e) { console.error(e); }
  }, [examSchedules]);

  useEffect(() => {
    try { localStorage.setItem('academia_notices', JSON.stringify(notices)); } catch (e) { console.error(e); }
  }, [notices]);

  useEffect(() => {
    try { localStorage.setItem('academia_assignments', JSON.stringify(assignments)); } catch (e) { console.error(e); }
  }, [assignments]);

  useEffect(() => {
    try { localStorage.setItem('academia_submissions', JSON.stringify(submissions)); } catch (e) { console.error(e); }
  }, [submissions]);

  useEffect(() => {
    try { localStorage.setItem('academia_materials', JSON.stringify(materials)); } catch (e) { console.error(e); }
  }, [materials]);

  useEffect(() => {
    try { localStorage.setItem('academia_attendance', JSON.stringify(attendanceRecords)); } catch (e) { console.error(e); }
  }, [attendanceRecords]);

  useEffect(() => {
    try { localStorage.setItem('academia_results', JSON.stringify(results)); } catch (e) { console.error(e); }
  }, [results]);

  useEffect(() => {
    try { localStorage.setItem('academia_fees', JSON.stringify(fees)); } catch (e) { console.error(e); }
  }, [fees]);

  useEffect(() => {
    try { localStorage.setItem('academia_leave_requests', JSON.stringify(leaveRequests)); } catch (e) { console.error(e); }
  }, [leaveRequests]);

  useEffect(() => {
    try { localStorage.setItem('academia_events', JSON.stringify(events)); } catch (e) { console.error(e); }
  }, [events]);

  useEffect(() => {
    try { localStorage.setItem('academia_messages', JSON.stringify(messages)); } catch (e) { console.error(e); }
  }, [messages]);

  useEffect(() => {
    try { localStorage.setItem('academia_notifications', JSON.stringify(notifications)); } catch (e) { console.error(e); }
  }, [notifications]);

  useEffect(() => {
    try { localStorage.setItem('academia_system_logs', JSON.stringify(systemLogs)); } catch (e) { console.error(e); }
  }, [systemLogs]);

  // Sync dark theme & color mode to HTML root and localStorage
  useEffect(() => {
    const applyTheme = () => {
      let resolvedTheme: 'light' | 'dark' = 'light';
      if (colorMode === 'dark') {
        resolvedTheme = 'dark';
      } else if (colorMode === 'light') {
        resolvedTheme = 'light';
      } else {
        // System preference
        resolvedTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }

      setTheme(resolvedTheme);
      if (resolvedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    applyTheme();

    try {
      localStorage.setItem('academia_color_mode', colorMode);
    } catch (e) {
      console.error(e);
    }

    if (colorMode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme();
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [colorMode]);

  // Sync language to localStorage & document lang
  useEffect(() => {
    try {
      localStorage.setItem('academia_language', language);
      document.documentElement.lang = language === 'BN' ? 'bn' : 'en';
    } catch (e) {
      console.error(e);
    }
  }, [language]);

  // Sync accent color to HTML root attribute & localStorage
  useEffect(() => {
    try {
      localStorage.setItem('academia_accent_color', accentColor);
      document.documentElement.setAttribute('data-accent', accentColor);
    } catch (e) {
      console.error(e);
    }
  }, [accentColor]);

  const toggleTheme = () => {
    setColorMode(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Translation helper function
  const isBN = language === 'BN';
  const l = (bn: string, en: string) => (language === 'BN' ? bn : en);
  const t = (key: string) => getTranslation(key, language);

  const [currentStudent, setCurrentStudent] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem('academia_current_student');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && (parsed.rollNumber || (parsed.id && parsed.id !== 'std-empty' && !parsed.id.includes('demo')))) {
          return parsed;
        }
      }
      return DEFAULT_EMPTY_STUDENT;
    } catch {
      return DEFAULT_EMPTY_STUDENT;
    }
  });

  const [currentTeacher, setCurrentTeacher] = useState<TeacherProfile>(() => {
    try {
      const saved = localStorage.getItem('academia_current_teacher');
      return saved ? JSON.parse(saved) : DEFAULT_EMPTY_TEACHER;
    } catch {
      return DEFAULT_EMPTY_TEACHER;
    }
  });

  const [principalUser, setPrincipalUser] = useState<TeacherProfile>(() => {
    try {
      const saved = localStorage.getItem('academia_principal_user');
      return saved ? JSON.parse(saved) : DEFAULT_EMPTY_PRINCIPAL;
    } catch {
      return DEFAULT_EMPTY_PRINCIPAL;
    }
  });

  const [adminUser, setAdminUser] = useState<TeacherProfile>(() => {
    try {
      const saved = localStorage.getItem('academia_admin_user');
      return saved ? JSON.parse(saved) : DEFAULT_EMPTY_ADMIN;
    } catch {
      return DEFAULT_EMPTY_ADMIN;
    }
  });

  const [hodUser, setHodUser] = useState<TeacherProfile>(() => {
    try {
      const saved = localStorage.getItem('academia_hod_user');
      return saved ? JSON.parse(saved) : DEFAULT_EMPTY_HOD;
    } catch {
      return DEFAULT_EMPTY_HOD;
    }
  });

  const [systemSettings, setSystemSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('academia_system_settings');
      return saved ? { ...DEFAULT_SYSTEM_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SYSTEM_SETTINGS;
    } catch {
      return DEFAULT_SYSTEM_SETTINGS;
    }
  });

  useEffect(() => {
    try { localStorage.setItem('academia_current_student', JSON.stringify(currentStudent)); } catch (e) { console.error(e); }
  }, [currentStudent]);

  useEffect(() => {
    try { localStorage.setItem('academia_current_teacher', JSON.stringify(currentTeacher)); } catch (e) { console.error(e); }
  }, [currentTeacher]);

  useEffect(() => {
    try { localStorage.setItem('academia_principal_user', JSON.stringify(principalUser)); } catch (e) { console.error(e); }
  }, [principalUser]);

  useEffect(() => {
    try { localStorage.setItem('academia_admin_user', JSON.stringify(adminUser)); } catch (e) { console.error(e); }
  }, [adminUser]);

  useEffect(() => {
    try { localStorage.setItem('academia_hod_user', JSON.stringify(hodUser)); } catch (e) { console.error(e); }
  }, [hodUser]);

  useEffect(() => {
    try { localStorage.setItem('academia_system_settings', JSON.stringify(systemSettings)); } catch (e) { console.error(e); }
  }, [systemSettings]);

  // Keep authentication session synced to localStorage
  useEffect(() => {
    try {
      if (isAuthenticated) {
        localStorage.setItem('academia_auth_session', JSON.stringify({
          isAuthenticated: true,
          role,
          activeTab
        }));
      } else {
        localStorage.removeItem('academia_auth_session');
      }
    } catch (e) {
      console.error(e);
    }
  }, [isAuthenticated, role, activeTab]);

  // Sync state with Cloud SQL database on mount
  useEffect(() => {
    // 1. Fetch teachers from Cloud SQL
    fetch('/api/teachers')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const parsed: TeacherProfile[] = data.map((t: any) => ({
            ...t,
            subjects: typeof t.subjects === 'string' ? JSON.parse(t.subjects || '[]') : (t.subjects || [])
          }));
          setTeachers(prev => {
            const map = new Map<string, TeacherProfile>();
            parsed.forEach((t: TeacherProfile) => map.set(t.id, t));
            prev.forEach((t: TeacherProfile) => map.set(t.id, t));
            return Array.from(map.values());
          });
          const pri = parsed.find(t => t.isPrincipal);
          if (pri) setPrincipalUser(prev => (prev.id === 'pri-empty' || !prev.name ? pri : prev));
          const hod = parsed.find(t => t.isHOD);
          if (hod) setHodUser(prev => (prev.id === 'hod-empty' || !prev.name ? hod : prev));
        }
      })
      .catch(e => console.warn('Could not fetch teachers from Cloud SQL:', e));

    // 2. Fetch registered users from Cloud SQL and MERGE with local users (never wipe locally registered accounts)
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const formattedUsers: RegisteredUser[] = data.map((u: any) => ({
            id: u.uid || `u-${u.id}`,
            name: u.name,
            email: u.email,
            password: u.password,
            role: u.role,
            identifier: u.identifier || u.email,
            department: u.department,
            semester: u.semester,
            designation: u.designation,
            phone: u.phone,
            registeredAt: u.registeredAt ? new Date(u.registeredAt).toISOString().replace('T', ' ').substring(0, 19) : '',
            avatar: u.avatar,
            status: u.status || 'ACTIVE'
          }));

          setRegisteredUsers(prev => {
            const map = new Map<string, RegisteredUser>();
            // Add server users first
            formattedUsers.forEach(u => {
              const key = `${u.role}_${(u.identifier || u.email || u.id).toLowerCase()}`;
              map.set(key, u);
              map.set(u.id, u);
            });
            // Merge local state users so they are never lost
            prev.forEach(u => {
              const key = `${u.role}_${(u.identifier || u.email || u.id).toLowerCase()}`;
              map.set(key, u);
              map.set(u.id, u);
            });
            // Also merge from localStorage to be 100% fail-safe
            try {
              const saved = localStorage.getItem('academia_registered_users');
              if (saved) {
                const parsed: RegisteredUser[] = JSON.parse(saved);
                parsed.filter(filterStaleDemo).forEach(u => {
                  const key = `${u.role}_${(u.identifier || u.email || u.id).toLowerCase()}`;
                  map.set(key, u);
                  map.set(u.id, u);
                });
              }
            } catch (err) {}

            const merged = Array.from(new Set(map.values())).filter(filterStaleDemo);
            return merged;
          });
        }
      })
      .catch(e => console.warn('Could not fetch users from Cloud SQL:', e));

    // 3. Fetch students from Cloud SQL and merge without overwriting current student
    fetch('/api/students')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setStudents(prev => {
            const map = new Map<string, StudentProfile>();
            data.forEach((s: StudentProfile) => map.set(s.id, s));
            prev.forEach((s: StudentProfile) => map.set(s.id, s));
            return Array.from(map.values()).filter(s => s && s.id && !s.id.includes('demo') && s.id !== 'std-empty');
          });
          // Set current student if student is logged in and not yet loaded
          setCurrentStudent(prev => {
            if (prev && prev.id && prev.id !== 'std-empty') {
              return prev;
            }
            return data[0] || prev;
          });
        }
      })
      .catch(e => console.warn('Could not fetch students from Cloud SQL:', e));

    // 4. Fetch notices from Cloud SQL
    fetch('/api/notices')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setNotices(data);
        }
      })
      .catch(e => console.warn('Could not fetch notices from Cloud SQL:', e));

    // 5. Fetch routines from Cloud SQL
    fetch('/api/routines')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setRoutines(data);
        }
      })
      .catch(e => console.warn('Could not fetch routines from Cloud SQL:', e));

    // 6. Fetch materials from Cloud SQL
    fetch('/api/materials')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setMaterials(data);
        }
      })
      .catch(e => console.warn('Could not fetch materials from Cloud SQL:', e));

    // 7. Fetch system settings from Cloud SQL
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data && data.campusName) {
          setSystemSettings(prev => ({ ...prev, ...data }));
        }
      })
      .catch(e => console.warn('Could not fetch settings from Cloud SQL:', e));

    // 8. One-time clean-up of any old demo items from localStorage
    try {
      const rawUsers = localStorage.getItem('academia_registered_users');
      if (rawUsers) {
        const parsed: RegisteredUser[] = JSON.parse(rawUsers);
        const cleaned = parsed.filter(filterStaleDemo);
        localStorage.setItem('academia_registered_users', JSON.stringify(cleaned));
      }

      const rawStudents = localStorage.getItem('academia_students');
      if (rawStudents) {
        const parsed: StudentProfile[] = JSON.parse(rawStudents);
        const cleaned = parsed.filter(s => s && s.id && !s.id.includes('demo') && !['std-1', 'std-2', 'std-3', 'std-4', 'std-empty'].includes(s.id));
        localStorage.setItem('academia_students', JSON.stringify(cleaned));
      }

      const rawTeachers = localStorage.getItem('academia_teachers');
      if (rawTeachers) {
        const parsed: TeacherProfile[] = JSON.parse(rawTeachers);
        const cleaned = parsed.filter(t => t && t.id && !t.id.includes('demo') && !['tch-1', 'tch-2', 'tch-3', 'tch-4', 'tch-5'].includes(t.id));
        localStorage.setItem('academia_teachers', JSON.stringify(cleaned));
      }
    } catch (e) {}
  }, []);

  const updateSystemSettings = (newSettings: Partial<typeof DEFAULT_SYSTEM_SETTINGS>) => {
    setSystemSettings(prev => ({ ...prev, ...newSettings }));
    addLog('SETTINGS_UPDATE', 'System configuration modified by Administrator');
    fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSettings)
    }).catch(e => console.warn('Cloud SQL settings sync error:', e));
  };

  const toggleFeature = (featureKey: keyof typeof DEFAULT_SYSTEM_SETTINGS) => {
    setSystemSettings(prev => ({
      ...prev,
      [featureKey]: !prev[featureKey]
    }));
    addLog('FEATURE_TOGGLE', `Feature switch '${String(featureKey)}' toggled by Administrator`);
  };

  const updateUserRole = (userId: string, newRole: UserRole) => {
    setRegisteredUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, role: newRole };
      }
      return u;
    }));
    addLog('ROLE_CHANGE', `User ${userId} role changed to ${newRole} by Master Admin`);
  };

  const toggleUserStatus = (userId: string) => {
    setRegisteredUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const nextStatus = u.status === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED';
        return { ...u, status: nextStatus };
      }
      return u;
    }));
    addLog('STATUS_CHANGE', `User account status changed for ${userId}`);
  };

  const resetUserPassword = (userId: string, newPass: string) => {
    setRegisteredUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, password: newPass };
      }
      return u;
    }));
    addLog('PASSWORD_RESET', `User password updated for ${userId} by Master Admin`);
  };

  const resetToDemoData = () => {
    localStorage.clear();
    setRegisteredUsers([]);
    setStudents([]);
    setTeachers([]);
    setNotices([]);
    setRoutines([]);
    setAssignments([]);
    setMaterials([]);
    setAttendanceRecords([]);
    setResults([]);
    setFees([]);
    setLeaveRequests([]);
    setAdminUser(DEFAULT_EMPTY_ADMIN);
    setPrincipalUser(DEFAULT_EMPTY_PRINCIPAL);
    setHodUser(DEFAULT_EMPTY_HOD);
    setCurrentStudent(DEFAULT_EMPTY_STUDENT);
    setCurrentTeacher(DEFAULT_EMPTY_TEACHER);
    setIsAuthenticated(false);
    setSystemSettings(DEFAULT_SYSTEM_SETTINGS);
    window.location.reload();
  };

  const addLog = (action: string, details: string) => {
    const userDisplay =
      role === 'ADMIN'
        ? `${adminUser.name} (Master Admin)`
        : role === 'PRINCIPAL'
        ? `${principalUser.name} (Principal)`
        : role === 'HOD'
        ? `${hodUser.name} (HOD)`
        : role === 'TEACHER'
        ? currentTeacher.name
        : `${currentStudent.name} (${currentStudent.rollNumber || 'Student'})`;

    const newLog: SystemLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: userDisplay,
      action,
      details,
      ipAddress: '192.168.1.1',
      status: 'SUCCESS'
    };
    setSystemLogs(prev => [newLog, ...prev]);
  };

  // Export functions
  const exportUsersExcel = () => {
    exportRegisteredUsersExcel(registeredUsers);
  };

  const exportUsersPDF = () => {
    exportRegisteredUsersPDF(registeredUsers);
  };

  const downloadSlipPDF = (userObj: any) => {
    downloadRegistrationSlipPDF(userObj);
  };

  const deleteRegisteredUser = (id: string) => {
    const target = registeredUsers.find(u => u.id === id);
    setRegisteredUsers(prev => prev.filter(u => u.id !== id));
    addLog('DELETE_USER', `Removed registered user account ID ${id}`);

    // Sync with Cloud SQL database
    fetch(`/api/users/${id}`, { method: 'DELETE' }).catch(e => console.warn(e));

    if (target) {
      if (target.role === 'TEACHER' || target.teacherId) {
        setTeachers(prev => prev.filter(t => t.userId !== id && t.email.toLowerCase() !== target.email.toLowerCase()));
        if (target.teacherId) {
          fetch(`/api/teachers/${target.teacherId}`, { method: 'DELETE' }).catch(e => console.warn(e));
        }
      }
      if (target.role === 'STUDENT' || target.studentId) {
        setStudents(prev => prev.filter(s => s.userId !== id && s.email.toLowerCase() !== target.email.toLowerCase()));
        if (target.studentId) {
          fetch(`/api/students/${target.studentId}`, { method: 'DELETE' }).catch(e => console.warn(e));
        }
      }
    }
  };

  // Authentication Handlers
  const login = (selectedRole: UserRole, identifier: string, pass: string) => {
    if (!identifier || !identifier.trim()) {
      return { 
        success: false, 
        message: language === 'BN' 
          ? 'অনুগ্রহ করে আপনার রোল নম্বর অথবা ইমেইল এড্রেস লিখুন।' 
          : 'Please enter your Roll Number or Email address.' 
      };
    }
    if (!pass || !pass.trim()) {
      return { 
        success: false, 
        message: language === 'BN' 
          ? 'অনুগ্রহ করে পাসওয়ার্ড প্রদান করুন।' 
          : 'Please enter your password.' 
      };
    }

    // Convert any Bengali numerals (০-৯) to English digits (0-9)
    const bnToEnMap: Record<string, string> = { '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4', '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9' };
    const normalizedRaw = identifier.trim().replace(/[০-৯]/g, d => bnToEnMap[d] || d);
    const cleanIdent = normalizedRaw.toLowerCase();
    const cleanPass = pass.trim();

    // 1. Primary match: Match against in-memory registeredUsers for current selectedRole
    let matchedUser = registeredUsers.find(u => {
      const isRoleMatch = u.role === selectedRole;
      const isIdentMatch =
        (u.email && u.email.toLowerCase() === cleanIdent) ||
        (u.identifier && u.identifier.toLowerCase() === cleanIdent) ||
        (u.id && u.id.toLowerCase() === cleanIdent);
      return isRoleMatch && isIdentMatch;
    });

    // 2. Direct localStorage match (failsafe if state hasn't flushed yet)
    if (!matchedUser) {
      try {
        const savedUsersRaw = localStorage.getItem('academia_registered_users');
        if (savedUsersRaw) {
          const parsedSaved: RegisteredUser[] = JSON.parse(savedUsersRaw);
          matchedUser = parsedSaved.find(u => {
            const isRoleMatch = u.role === selectedRole;
            const isIdentMatch =
              (u.email && u.email.toLowerCase() === cleanIdent) ||
              (u.identifier && u.identifier.toLowerCase() === cleanIdent) ||
              (u.id && u.id.toLowerCase() === cleanIdent);
            return isRoleMatch && isIdentMatch;
          });
        }
      } catch (err) {}
    }

    // 3. Cross-role match: Check if an account exists under ANY role (e.g., student selected Teacher tab accidentally)
    if (!matchedUser) {
      matchedUser = registeredUsers.find(u =>
        (u.email && u.email.toLowerCase() === cleanIdent) ||
        (u.identifier && u.identifier.toLowerCase() === cleanIdent) ||
        (u.id && u.id.toLowerCase() === cleanIdent)
      );

      if (!matchedUser) {
        try {
          const savedUsersRaw = localStorage.getItem('academia_registered_users');
          if (savedUsersRaw) {
            const parsedSaved: RegisteredUser[] = JSON.parse(savedUsersRaw);
            matchedUser = parsedSaved.find(u =>
              (u.email && u.email.toLowerCase() === cleanIdent) ||
              (u.identifier && u.identifier.toLowerCase() === cleanIdent) ||
              (u.id && u.id.toLowerCase() === cleanIdent)
            );
          }
        } catch (err) {}
      }
    }

    // 5. Direct Students table match (for roll numbers or student email)
    if (!matchedUser) {
      const st = students.find(s => 
        (s.rollNumber && s.rollNumber.toLowerCase() === cleanIdent) ||
        (s.email && s.email.toLowerCase() === cleanIdent)
      );
      if (st) {
        matchedUser = {
          id: st.userId || `u-${st.id}`,
          name: st.name,
          email: st.email || `${st.rollNumber}@campus.edu`,
          password: cleanPass, // accept credential for valid student
          role: 'STUDENT',
          identifier: st.rollNumber,
          department: st.department,
          semester: st.semester,
          registeredAt: new Date().toISOString(),
          studentId: st.id,
          avatar: st.avatar,
          status: 'ACTIVE'
        };
      }
    }

    if (matchedUser) {
      if (matchedUser.status === 'SUSPENDED') {
        return {
          success: false,
          message: language === 'BN'
            ? 'আপনার অ্যাকাউন্টটি সাময়িকভাবে স্থগিত করা হয়েছে। প্রশাসনের সাথে যোগাযোগ করুন।'
            : 'Your account has been suspended. Please contact the administrator.'
        };
      }

      if (matchedUser.password && matchedUser.password !== cleanPass) {
        return { 
          success: false, 
          message: language === 'BN'
            ? 'ভুল পাসওয়ার্ড! সঠিক পাসওয়ার্ড দিয়ে আবার চেষ্টা করুন।'
            : 'Invalid password! Please check your credentials and try again.'
        };
      }

      // Ensure user is in registeredUsers state and localStorage
      setRegisteredUsers(prev => {
        if (!prev.some(u => u.id === matchedUser!.id)) {
          const updated = [matchedUser!, ...prev];
          try { localStorage.setItem('academia_registered_users', JSON.stringify(updated)); } catch (e) {}
          return updated;
        }
        return prev;
      });

      const userRole = matchedUser.role;
      setRole(userRole);
      setIsAuthenticated(true);

      let targetTab = 'dashboard_student';

      if (userRole === 'STUDENT') {
        targetTab = 'dashboard_student';
        const st = students.find(s => 
          (s.email && s.email.toLowerCase() === matchedUser!.email.toLowerCase()) || 
          (s.rollNumber && s.rollNumber.toLowerCase() === matchedUser!.identifier.toLowerCase())
        );
        if (st) {
          setCurrentStudent(st);
          try { localStorage.setItem('academia_current_student', JSON.stringify(st)); } catch (e) {}
        } else {
          const newStudent: StudentProfile = {
            id: matchedUser.studentId || `std-${Date.now()}`,
            userId: matchedUser.id,
            name: matchedUser.name,
            rollNumber: matchedUser.identifier,
            registrationNumber: `REG-2026-${Math.floor(1000 + Math.random() * 9000)}`,
            department: matchedUser.department || 'কম্পিউটার সাইন্স এণ্ড টেকনোলজি',
            semester: matchedUser.semester || '১ম সেমিস্টার',
            section: 'A',
            session: '2025-2026',
            email: matchedUser.email,
            phone: matchedUser.phone || '',
            address: 'Campus Housing',
            bloodGroup: 'O+',
            avatar: matchedUser.avatar || '',
            cgpa: 0,
            attendancePercentage: 100,
            pendingFees: 0,
            guardianName: '',
            guardianPhone: ''
          };
          setCurrentStudent(newStudent);
          setStudents(prev => [newStudent, ...prev.filter(s => s.id !== newStudent.id)]);
          try {
            localStorage.setItem('academia_current_student', JSON.stringify(newStudent));
            localStorage.setItem('academia_students', JSON.stringify([newStudent, ...students]));
          } catch (e) {}
        }
        setActiveTab('dashboard_student');
      } else if (userRole === 'TEACHER') {
        targetTab = 'dashboard_teacher';
        const tc = teachers.find(t => t.email && t.email.toLowerCase() === matchedUser!.email.toLowerCase());
        if (tc) {
          setCurrentTeacher(tc);
          try { localStorage.setItem('academia_current_teacher', JSON.stringify(tc)); } catch (e) {}
        } else {
          const newTeacher: TeacherProfile = {
            id: matchedUser.teacherId || `tch-${Date.now()}`,
            userId: matchedUser.id,
            name: matchedUser.name,
            designation: matchedUser.designation || 'Lecturer / শিক্ষক',
            department: matchedUser.department || 'কম্পিউটার সাইন্স এণ্ড টেকনোলজি',
            email: matchedUser.email,
            phone: matchedUser.phone || '',
            avatar: matchedUser.avatar || '',
            qualification: 'B.Sc / M.Sc in Engineering',
            subjects: [],
            officeRoom: 'শিক্ষক মিলনায়তন',
            experienceYears: 1,
            biography: 'Faculty Member',
            officeHours: '10:00 AM - 4:00 PM'
          };
          setCurrentTeacher(newTeacher);
          setTeachers(prev => [newTeacher, ...prev.filter(t => t.id !== newTeacher.id)]);
          try {
            localStorage.setItem('academia_current_teacher', JSON.stringify(newTeacher));
            localStorage.setItem('academia_teachers', JSON.stringify([newTeacher, ...teachers]));
          } catch (e) {}
        }
        setActiveTab('dashboard_teacher');
      } else if (userRole === 'HOD') {
        targetTab = 'dashboard_hod';
        const newHod: TeacherProfile = {
          id: `tch-hod-${Date.now()}`,
          userId: matchedUser.id,
          name: matchedUser.name,
          email: matchedUser.email,
          avatar: matchedUser.avatar || '',
          designation: `বিভাগীয় প্রধান (HOD - ${matchedUser.department || 'Engineering'})`,
          department: matchedUser.department || 'কম্পিউটার সাইন্স এণ্ড টেকনোলজি',
          subjects: [],
          phone: matchedUser.phone || '',
          officeRoom: 'HOD Office Suite',
          qualification: 'M.Sc / Ph.D in Engineering',
          experienceYears: 10,
          biography: `Head of ${matchedUser.department || 'Department'}.`,
          officeHours: '10:00 AM - 2:00 PM',
          isHOD: true
        };
        setHodUser(newHod);
        try { localStorage.setItem('academia_hod_user', JSON.stringify(newHod)); } catch (e) {}
        setActiveTab('dashboard_hod');
      } else if (userRole === 'PRINCIPAL') {
        targetTab = 'dashboard_principal';
        const newPrincipal: TeacherProfile = {
          id: `tch-pri-${Date.now()}`,
          userId: matchedUser.id,
          name: matchedUser.name,
          email: matchedUser.email,
          avatar: matchedUser.avatar || DEFAULT_EMPTY_PRINCIPAL.avatar,
          designation: 'অধ্যক্ষ ও প্রধান নির্বাহী (Principal)',
          department: 'প্রশাসন (Administration)',
          subjects: ['Institutional Ethics', 'Academic Leadership'],
          phone: matchedUser.phone || '',
          officeRoom: 'অধ্যক্ষ কার্যালয় (কক্ষ ১০১)',
          qualification: 'Ph.D in Engineering, M.Sc (First Class)',
          experienceYears: 24,
          biography: 'অধ্যক্ষ ও প্রধান নির্বাহী কর্মকর্তা। প্রাতিষ্ঠানিক নীতি, একাডেমিক উৎকর্ষ ও সার্বিক ফলাফল তদারক করেন।',
          officeHours: 'সকাল ৯:০০ - বিকাল ৪:৩০',
          isPrincipal: true,
          speechText: DEFAULT_EMPTY_PRINCIPAL.speechText
        };
        setPrincipalUser(newPrincipal);
        try { localStorage.setItem('academia_principal_user', JSON.stringify(newPrincipal)); } catch (e) {}
        setActiveTab('dashboard_principal');
      } else if (userRole === 'ADMIN') {
        targetTab = 'dashboard_admin';
        const newAdmin: TeacherProfile = {
          id: `tch-adm-${Date.now()}`,
          userId: matchedUser.id,
          name: matchedUser.name,
          email: matchedUser.email,
          avatar: matchedUser.avatar || DEFAULT_EMPTY_ADMIN.avatar,
          designation: 'Master System Administrator & Controller',
          department: 'সিস্টেম প্রশাসন (IT & Control)',
          subjects: [],
          phone: matchedUser.phone || '',
          officeRoom: 'সেন্ট্রাল আইটি ও কন্ট্রোল রুম',
          qualification: 'M.Sc in Computer Science & Network Architecture',
          experienceYears: 12,
          biography: 'Master System Administrator with complete institutional and technical control.',
          officeHours: '24/7 Monitoring & System Maintenance',
          isAdmin: true
        };
        setAdminUser(newAdmin);
        try { localStorage.setItem('academia_admin_user', JSON.stringify(newAdmin)); } catch (e) {}
        setActiveTab('dashboard_admin');
      }

      // Persist auth session to localStorage immediately so refresh preserves session
      try {
        localStorage.setItem('academia_auth_session', JSON.stringify({
          isAuthenticated: true,
          role: userRole,
          activeTab: targetTab
        }));
      } catch (err) {}

      addLog('USER_LOGIN', `${userRole} logged in: ${matchedUser.name} (${matchedUser.email || matchedUser.identifier})`);
      return { 
        success: true, 
        message: language === 'BN' 
          ? `স্বাগতম ${matchedUser.name}! লগইন সফল হয়েছে।` 
          : `Welcome ${matchedUser.name}! Login successful.` 
      };
    }

    return {
      success: false,
      message: language === 'BN'
        ? `"${identifier}" নামে কোনো নিবন্ধিত অ্যাকাউন্ট অথবা সঠিক পাসওয়ার্ড পাওয়া যায়নি। অনুগ্রহ করে রোল নম্বর ও পাসওয়ার্ড যাচাই করুন অথবা "Register" বাটনে ক্লিক করে অ্যাকাউন্ট খুলুন।`
        : `No registered account found for "${identifier}". Please check credentials or register a new account.`
    };
  };

  const loginWithGoogle = (googleUser: { uid: string; email: string | null; displayName: string | null; photoURL: string | null }) => {
    const email = (googleUser.email || '').toLowerCase();
    const matched = registeredUsers.find(u => u.email && u.email.toLowerCase() === email);
    if (matched) {
      setRole(matched.role);
      setIsAuthenticated(true);
      if (matched.role === 'ADMIN') setActiveTab('dashboard_admin');
      else if (matched.role === 'PRINCIPAL') setActiveTab('dashboard_principal');
      else if (matched.role === 'HOD') setActiveTab('dashboard_hod');
      else if (matched.role === 'TEACHER') setActiveTab('dashboard_teacher');
      else setActiveTab('dashboard_student');
      addLog('GOOGLE_LOGIN', `User signed in with Google: ${matched.name} (${email})`);
    } else {
      const defaultRole: UserRole = email.includes('admin') ? 'ADMIN' : email.includes('teacher') ? 'TEACHER' : 'STUDENT';
      const newRegUser: RegisteredUser = {
        id: googleUser.uid,
        name: googleUser.displayName || email.split('@')[0],
        email: email,
        password: '',
        role: defaultRole,
        identifier: email,
        department: 'কম্পিউটার সাইন্স এণ্ড টেকনোলজি',
        semester: '১ম সেমিস্টার',
        registeredAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        avatar: googleUser.photoURL || '',
        status: 'ACTIVE'
      };
      setRegisteredUsers(prev => [newRegUser, ...prev]);
      setRole(defaultRole);
      setIsAuthenticated(true);
      setActiveTab(defaultRole === 'ADMIN' ? 'dashboard_admin' : defaultRole === 'TEACHER' ? 'dashboard_teacher' : 'dashboard_student');
      addLog('GOOGLE_SIGNUP', `New user registered with Google: ${newRegUser.name} (${email})`);

      fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: googleUser.uid,
          name: newRegUser.name,
          email: email,
          role: defaultRole,
          identifier: email,
          department: newRegUser.department,
          avatar: newRegUser.avatar,
          status: 'ACTIVE'
        })
      }).catch(e => console.warn(e));
    }
  };

  const registerStudent = (data: { name: string; rollNumber: string; email: string; department: string; semester: string; password: string; avatar?: string }) => {
    if (!data.name || !data.rollNumber || !data.email || !data.password) {
      return { success: false, message: 'অনুগ্রহ করে সকল প্রয়োজনীয় তথ্য পূরণ করুন।' };
    }

    const cleanEmail = data.email.trim().toLowerCase();
    const cleanRoll = data.rollNumber.trim();

    const existing = registeredUsers.find(
      u => (u.email && u.email.toLowerCase() === cleanEmail) || 
           (u.identifier && u.identifier.toLowerCase() === cleanRoll.toLowerCase())
    );
    if (existing) {
      return { success: false, message: 'এই ইমেইল বা রোল নম্বর দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট তৈরি করা আছে!' };
    }

    const studentId = `std-${Date.now()}`;
    const userId = `u-std-${Date.now()}`;
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const userAvatar = data.avatar || '';

    const newStudentProfile: StudentProfile = {
      id: studentId,
      userId: userId,
      name: data.name.trim(),
      rollNumber: cleanRoll,
      registrationNumber: `REG-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      department: data.department || 'কম্পিউটার সাইন্স এণ্ড টেকনোলজি',
      semester: data.semester || '১ম সেমিস্টার',
      section: 'A',
      session: '2025-2026',
      email: cleanEmail,
      phone: '',
      address: '',
      bloodGroup: '',
      avatar: userAvatar,
      cgpa: 0,
      attendancePercentage: 100,
      pendingFees: 0,
      guardianName: '',
      guardianPhone: ''
    };

    const newRegUser: RegisteredUser = {
      id: userId,
      name: data.name.trim(),
      email: cleanEmail,
      password: data.password.trim(),
      role: 'STUDENT',
      identifier: cleanRoll,
      department: data.department,
      semester: data.semester,
      registeredAt: nowStr,
      studentId: studentId,
      avatar: userAvatar,
      status: 'ACTIVE'
    };

    // Synchronously update registered users state and localStorage
    setRegisteredUsers(prev => {
      const updated = [newRegUser, ...prev.filter(u => u.id !== userId && u.identifier !== cleanRoll && u.email !== cleanEmail)];
      try {
        localStorage.setItem('academia_registered_users', JSON.stringify(updated));
      } catch (err) {}
      return updated;
    });

    setStudents(prev => {
      const updated = [newStudentProfile, ...prev.filter(s => s.id !== studentId && s.rollNumber !== cleanRoll)];
      try {
        localStorage.setItem('academia_students', JSON.stringify(updated));
      } catch (err) {}
      return updated;
    });

    setCurrentStudent(newStudentProfile);
    setRole('STUDENT');
    setActiveTab('dashboard_student');
    setIsAuthenticated(true);

    try {
      localStorage.setItem('academia_current_student', JSON.stringify(newStudentProfile));
      localStorage.setItem('academia_auth_session', JSON.stringify({
        isAuthenticated: true,
        role: 'STUDENT',
        activeTab: 'dashboard_student'
      }));
    } catch (err) {}

    addLog('USER_REGISTER', `New Student registered: ${data.name} (${cleanRoll})`);

    // Sync to Cloud SQL in background
    fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        uid: userId,
        name: data.name.trim(),
        email: cleanEmail,
        password: data.password.trim(),
        role: 'STUDENT',
        identifier: cleanRoll,
        department: data.department,
        semester: data.semester,
        avatar: userAvatar,
        status: 'ACTIVE'
      })
    }).catch(e => console.warn('User sync to Cloud SQL:', e));

    fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newStudentProfile)
    }).catch(e => console.warn('Student sync to Cloud SQL:', e));

    return { success: true, message: `শিক্ষার্থী অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে! স্বাগতম ${data.name}।` };
  };

  const registerTeacher = (data: { name: string; email: string; designation: string; department: string; phone: string; password: string; avatar?: string }) => {
    if (!data.name || !data.email || !data.password) {
      return { success: false, message: 'অনুগ্রহ করে সকল প্রয়োজনীয় তথ্য পূরণ করুন।' };
    }

    const cleanEmail = data.email.trim().toLowerCase();

    const existing = registeredUsers.find(
      u => u.email && u.email.toLowerCase() === cleanEmail
    );
    if (existing) {
      return { success: false, message: 'এই ইমেইল দিয়ে ইতিমধ্যে শিক্ষক অ্যাকাউন্ট রয়েছে!' };
    }

    const teacherId = `tch-${Date.now()}`;
    const userId = `u-tch-${Date.now()}`;
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const userAvatar = data.avatar || '';

    const newTeacherProfile: TeacherProfile = {
      id: teacherId,
      userId: userId,
      name: data.name.trim(),
      designation: data.designation || 'Lecturer / শিক্ষক',
      department: data.department || 'কম্পিউটার সাইন্স এণ্ড টেকনোলজি',
      email: cleanEmail,
      phone: data.phone || '',
      avatar: userAvatar,
      qualification: 'B.Sc / M.Sc in Engineering',
      subjects: [],
      officeRoom: 'শিক্ষক মিলনায়তন',
      experienceYears: 1,
      biography: 'Faculty member',
      officeHours: '10:00 AM - 4:00 PM',
      assignedClassesCount: 0,
      totalStudentsTaught: 0
    };

    const newRegUser: RegisteredUser = {
      id: userId,
      name: data.name.trim(),
      email: cleanEmail,
      password: data.password.trim(),
      role: 'TEACHER',
      identifier: cleanEmail,
      department: data.department,
      designation: data.designation,
      phone: data.phone,
      registeredAt: nowStr,
      teacherId: teacherId,
      avatar: userAvatar,
      status: 'ACTIVE'
    };

    setRegisteredUsers(prev => {
      const updated = [newRegUser, ...prev.filter(u => u.id !== userId && u.email !== cleanEmail)];
      try {
        localStorage.setItem('academia_registered_users', JSON.stringify(updated));
      } catch (err) {}
      return updated;
    });

    setTeachers(prev => {
      const updated = [newTeacherProfile, ...prev.filter(t => t.id !== teacherId && t.email !== cleanEmail)];
      try {
        localStorage.setItem('academia_teachers', JSON.stringify(updated));
      } catch (err) {}
      return updated;
    });

    setCurrentTeacher(newTeacherProfile);
    setRole('TEACHER');
    setActiveTab('dashboard_teacher');
    setIsAuthenticated(true);

    try {
      localStorage.setItem('academia_current_teacher', JSON.stringify(newTeacherProfile));
      localStorage.setItem('academia_auth_session', JSON.stringify({
        isAuthenticated: true,
        role: 'TEACHER',
        activeTab: 'dashboard_teacher'
      }));
    } catch (err) {}

    addLog('USER_REGISTER', `New Teacher registered: ${data.name}`);

    fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        uid: userId,
        name: data.name.trim(),
        email: cleanEmail,
        password: data.password.trim(),
        role: 'TEACHER',
        identifier: cleanEmail,
        department: data.department,
        designation: data.designation,
        phone: data.phone,
        avatar: userAvatar,
        status: 'ACTIVE'
      })
    }).catch(e => console.warn('Teacher user sync to Cloud SQL:', e));

    fetch('/api/teachers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTeacherProfile)
    }).catch(e => console.warn('Teacher sync to Cloud SQL:', e));

    return { success: true, message: `শিক্ষক অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে! স্বাগতম ${data.name}।` };
  };

  const registerAdmin = (data: { name: string; email: string; adminKey: string; password: string; avatar?: string }) => {
    if (!data.name || !data.email || !data.password) {
      return { success: false, message: 'অনুগ্রহ করে নাম, ইমেইল ও পাসওয়ার্ড প্রদান করুন।' };
    }

    const cleanEmail = data.email.trim().toLowerCase();

    const existing = registeredUsers.find(
      u => u.email && u.email.toLowerCase() === cleanEmail
    );
    if (existing) {
      return { success: false, message: 'এই ইমেইল দিয়ে ইতিমধ্যে অ্যাডমিন অ্যাকাউন্ট রয়েছে!' };
    }

    const userId = `u-adm-${Date.now()}`;
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const userAvatar = data.avatar || DEFAULT_EMPTY_ADMIN.avatar;

    const newRegUser: RegisteredUser = {
      id: userId,
      name: data.name.trim(),
      email: cleanEmail,
      password: data.password.trim(),
      role: 'ADMIN',
      identifier: cleanEmail,
      department: 'সিস্টেম প্রশাসন (IT & Control)',
      designation: 'Master System Administrator & Controller',
      registeredAt: nowStr,
      avatar: userAvatar,
      status: 'ACTIVE'
    };

    const newAdminProfile: TeacherProfile = {
      id: `tch-adm-${Date.now()}`,
      userId: userId,
      name: data.name.trim(),
      email: cleanEmail,
      avatar: userAvatar,
      designation: 'Master System Administrator & Controller',
      department: 'সিস্টেম প্রশাসন (IT & Control)',
      subjects: [],
      phone: '',
      officeRoom: 'সেন্ট্রাল আইটি ও কন্ট্রোল রুম',
      qualification: 'M.Sc in Computer Science',
      experienceYears: 12,
      biography: 'Master System Administrator with complete institutional and technical control.',
      officeHours: '24/7 Monitoring & System Maintenance',
      isAdmin: true
    };

    setRegisteredUsers(prev => {
      const updated = [newRegUser, ...prev.filter(u => u.id !== userId && u.email !== cleanEmail)];
      try {
        localStorage.setItem('academia_registered_users', JSON.stringify(updated));
      } catch (err) {}
      return updated;
    });

    setAdminUser(newAdminProfile);
    setRole('ADMIN');
    setActiveTab('dashboard_admin');
    setIsAuthenticated(true);

    try {
      localStorage.setItem('academia_admin_user', JSON.stringify(newAdminProfile));
      localStorage.setItem('academia_auth_session', JSON.stringify({
        isAuthenticated: true,
        role: 'ADMIN',
        activeTab: 'dashboard_admin'
      }));
    } catch (err) {}

    addLog('USER_REGISTER', `New Master Admin registered: ${data.name}`);

    fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        uid: userId,
        name: data.name.trim(),
        email: cleanEmail,
        password: data.password.trim(),
        role: 'ADMIN',
        identifier: cleanEmail,
        department: 'সিস্টেম প্রশাসন (IT & Control)',
        avatar: userAvatar,
        status: 'ACTIVE'
      })
    }).catch(e => console.warn('Admin user sync to Cloud SQL:', e));

    return { success: true, message: `মাস্টার অ্যাডমিন অ্যাকাউন্ট তৈরি সম্পন্ন হয়েছে!` };
  };

  const registerPrincipal = (data: { name: string; email: string; phone: string; password: string; avatar?: string }) => {
    if (!data.name || !data.email || !data.password) {
      return { success: false, message: 'অনুগ্রহ করে নাম, ইমেইল ও পাসওয়ার্ড প্রদান করুন।' };
    }

    const cleanEmail = data.email.trim().toLowerCase();

    const existing = registeredUsers.find(
      u => u.email && u.email.toLowerCase() === cleanEmail
    );
    if (existing) {
      return { success: false, message: 'এই ইমেইল দিয়ে ইতিমধ্যে অ্যাকাউন্ট রয়েছে!' };
    }

    const userId = `u-pri-${Date.now()}`;
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const userAvatar = data.avatar || DEFAULT_EMPTY_PRINCIPAL.avatar;

    const newRegUser: RegisteredUser = {
      id: userId,
      name: data.name.trim(),
      email: cleanEmail,
      password: data.password.trim(),
      role: 'PRINCIPAL',
      identifier: cleanEmail,
      department: 'প্রশাসন (Administration)',
      designation: 'অধ্যক্ষ ও প্রধান নির্বাহী (Principal)',
      phone: data.phone,
      registeredAt: nowStr,
      avatar: userAvatar,
      status: 'ACTIVE'
    };

    const newPrincipalProfile: TeacherProfile = {
      id: `tch-pri-${Date.now()}`,
      userId: userId,
      name: data.name.trim(),
      email: cleanEmail,
      avatar: userAvatar,
      designation: 'অধ্যক্ষ ও প্রধান নির্বাহী (Principal)',
      department: 'প্রশাসন (Administration)',
      subjects: ['Institutional Ethics', 'Academic Leadership'],
      phone: data.phone,
      officeRoom: 'অধ্যক্ষ কার্যালয় (কক্ষ ১০১)',
      qualification: 'Ph.D in Engineering, M.Sc',
      experienceYears: 24,
      biography: 'অধ্যক্ষ ও প্রধান নির্বাহী কর্মকর্তা। প্রাতিষ্ঠানিক নীতি, একাডেমিক উৎকর্ষ ও সার্বিক ফলাফল তদারক করেন।',
      officeHours: 'সকাল ৯:০০ - বিকাল ৪:৩০',
      isPrincipal: true,
      speechText: DEFAULT_EMPTY_PRINCIPAL.speechText
    };

    setRegisteredUsers(prev => {
      const updated = [newRegUser, ...prev.filter(u => u.id !== userId && u.email !== cleanEmail)];
      try {
        localStorage.setItem('academia_registered_users', JSON.stringify(updated));
      } catch (err) {}
      return updated;
    });

    setTeachers(prev => {
      const updated = [newPrincipalProfile, ...prev.filter(t => t.id !== newPrincipalProfile.id && t.email !== cleanEmail)];
      try {
        localStorage.setItem('academia_teachers', JSON.stringify(updated));
      } catch (err) {}
      return updated;
    });

    setPrincipalUser(newPrincipalProfile);
    setRole('PRINCIPAL');
    setActiveTab('dashboard_principal');
    setIsAuthenticated(true);

    try {
      localStorage.setItem('academia_principal_user', JSON.stringify(newPrincipalProfile));
      localStorage.setItem('academia_auth_session', JSON.stringify({
        isAuthenticated: true,
        role: 'PRINCIPAL',
        activeTab: 'dashboard_principal'
      }));
    } catch (err) {}

    addLog('USER_REGISTER', `New Principal registered: ${data.name}`);

    fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        uid: userId,
        name: data.name.trim(),
        email: cleanEmail,
        password: data.password.trim(),
        role: 'PRINCIPAL',
        identifier: cleanEmail,
        department: 'প্রশাসন (Administration)',
        phone: data.phone,
        avatar: userAvatar,
        status: 'ACTIVE'
      })
    }).catch(e => console.warn('Principal user sync to Cloud SQL:', e));

    fetch('/api/teachers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...newPrincipalProfile,
        subjects: JSON.stringify(newPrincipalProfile.subjects)
      })
    }).catch(e => console.warn('Principal teacher sync to Cloud SQL:', e));

    return { success: true, message: 'অধ্যক্ষ অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!' };
  };

  const registerHOD = (data: { name: string; email: string; department: string; password: string; avatar?: string }) => {
    if (!data.name || !data.email || !data.password) {
      return { success: false, message: 'অনুগ্রহ করে সকল তথ্য পূরণ করুন।' };
    }

    const cleanEmail = data.email.trim().toLowerCase();

    const existing = registeredUsers.find(
      u => u.email && u.email.toLowerCase() === cleanEmail
    );
    if (existing) {
      return { success: false, message: 'এই ইমেইল দিয়ে ইতিমধ্যে বিভাগীয় প্রধান অ্যাকাউন্ট রয়েছে!' };
    }

    const userId = `u-hod-${Date.now()}`;
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const userAvatar = data.avatar || '';

    const newRegUser: RegisteredUser = {
      id: userId,
      name: data.name.trim(),
      email: cleanEmail,
      password: data.password.trim(),
      role: 'HOD',
      identifier: cleanEmail,
      department: data.department || 'কম্পিউটার সাইন্স এণ্ড টেকনোলজি',
      designation: 'বিভাগীয় প্রধান',
      registeredAt: nowStr,
      avatar: userAvatar,
      status: 'ACTIVE'
    };

    const newHodProfile: TeacherProfile = {
      id: `tch-hod-${Date.now()}`,
      userId: userId,
      name: data.name.trim(),
      email: cleanEmail,
      avatar: userAvatar,
      designation: `বিভাগীয় প্রধান (${data.department || 'Department'})`,
      department: data.department || 'কম্পিউটার সাইন্স এণ্ড টেকনোলজি',
      subjects: [],
      phone: '',
      officeRoom: 'বিভাগীয় প্রধানের কক্ষ',
      qualification: '',
      experienceYears: 8,
      biography: `Head of ${data.department || 'Department'}.`,
      officeHours: '10:00 AM - 2:00 PM',
      isHOD: true
    };

    setRegisteredUsers(prev => {
      const updated = [newRegUser, ...prev.filter(u => u.id !== userId && u.email !== cleanEmail)];
      try {
        localStorage.setItem('academia_registered_users', JSON.stringify(updated));
      } catch (err) {}
      return updated;
    });

    setTeachers(prev => {
      const updated = [newHodProfile, ...prev.filter(t => t.id !== newHodProfile.id && t.email !== cleanEmail)];
      try {
        localStorage.setItem('academia_teachers', JSON.stringify(updated));
      } catch (err) {}
      return updated;
    });

    setHodUser(newHodProfile);
    setRole('HOD');
    setActiveTab('dashboard_hod');
    setIsAuthenticated(true);

    try {
      localStorage.setItem('academia_hod_user', JSON.stringify(newHodProfile));
      localStorage.setItem('academia_auth_session', JSON.stringify({
        isAuthenticated: true,
        role: 'HOD',
        activeTab: 'dashboard_hod'
      }));
    } catch (err) {}

    addLog('USER_REGISTER', `New HOD registered: ${data.name}`);

    fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        uid: userId,
        name: data.name.trim(),
        email: cleanEmail,
        password: data.password.trim(),
        role: 'HOD',
        identifier: cleanEmail,
        department: data.department,
        avatar: userAvatar,
        status: 'ACTIVE'
      })
    }).catch(e => console.warn('HOD user sync to Cloud SQL:', e));

    fetch('/api/teachers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...newHodProfile,
        subjects: JSON.stringify(newHodProfile.subjects)
      })
    }).catch(e => console.warn('HOD teacher sync to Cloud SQL:', e));

    return { success: true, message: `বিভাগীয় প্রধান (HOD) অ্যাকাউন্ট তৈরি হয়েছে! স্বাগতম ${data.name}।` };
  };

  const logout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem('academia_auth_session');
    } catch (e) {}
    addLog('USER_LOGOUT', `User logged out`);
  };

  // Student CRUD
  const addStudent = (stData: Omit<StudentProfile, 'id'>) => {
    const newId = `std-${Date.now()}`;
    const newUserId = stData.userId || `u-std-${Date.now()}`;
    const newStudent: StudentProfile = {
      ...stData,
      id: newId,
      userId: newUserId
    };
    setStudents(prev => [newStudent, ...prev]);

    // Also register user so student can log in
    const newRegUser: RegisteredUser = {
      id: newUserId,
      name: newStudent.name,
      email: newStudent.email || `${newStudent.rollNumber.toLowerCase()}@campus.edu`,
      password: 'student',
      role: 'STUDENT',
      identifier: newStudent.rollNumber,
      department: newStudent.department,
      semester: newStudent.semester,
      phone: newStudent.phone,
      registeredAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      studentId: newId,
      avatar: newStudent.avatar,
      status: 'ACTIVE'
    };
    setRegisteredUsers(prev => [newRegUser, ...prev]);
    addLog('CREATE_STUDENT', `Added student ${newStudent.name} (${newStudent.rollNumber})`);

    // Cloud SQL database persistence
    fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newStudent)
    }).catch(e => console.warn('Cloud SQL student save error:', e));

    fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        uid: newUserId,
        name: newRegUser.name,
        email: newRegUser.email,
        password: newRegUser.password,
        role: newRegUser.role,
        identifier: newRegUser.identifier,
        department: newRegUser.department,
        semester: newRegUser.semester,
        phone: newRegUser.phone,
        avatar: newRegUser.avatar,
        status: newRegUser.status
      })
    }).catch(e => console.warn('Cloud SQL user save error:', e));
  };

  const updateStudent = (updated: StudentProfile) => {
    setStudents(prev => prev.map(s => (s.id === updated.id ? updated : s)));
    setRegisteredUsers(prev => prev.map(u => {
      if (u.studentId === updated.id || u.id === updated.userId || u.identifier === updated.rollNumber) {
        return {
          ...u,
          name: updated.name,
          email: updated.email || u.email,
          identifier: updated.rollNumber,
          department: updated.department,
          semester: updated.semester,
          phone: updated.phone || u.phone,
          avatar: updated.avatar || u.avatar
        };
      }
      return u;
    }));
    addLog('UPDATE_STUDENT', `Updated profile for ${updated.name}`);

    fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    }).catch(e => console.warn('Cloud SQL student update error:', e));
  };

  const deleteStudent = (id: string) => {
    const target = students.find(s => s.id === id);
    setStudents(prev => prev.filter(s => s.id !== id));
    if (target) {
      setRegisteredUsers(prev => prev.filter(u => u.studentId !== id && u.identifier !== target.rollNumber));
      addLog('DELETE_STUDENT', `Removed student record for ${target.name}`);

      fetch(`/api/students/${id}`, { method: 'DELETE' }).catch(e => console.warn(e));
      if (target.userId) {
        fetch(`/api/users/${target.userId}`, { method: 'DELETE' }).catch(e => console.warn(e));
      }
    }
  };

  // Teacher CRUD
  const addTeacher = (tchData: Omit<TeacherProfile, 'id'> & { password?: string }) => {
    const newId = `tch-${Date.now()}`;
    const newUserId = tchData.userId || `u-tch-${Date.now()}`;
    const newTeacher: TeacherProfile = {
      ...tchData,
      id: newId,
      userId: newUserId
    };
    setTeachers(prev => [newTeacher, ...prev]);

    // Role assignment
    const role: UserRole = newTeacher.isPrincipal ? 'PRINCIPAL' : newTeacher.isHOD ? 'HOD' : 'TEACHER';
    const newRegUser: RegisteredUser = {
      id: newUserId,
      name: newTeacher.name,
      email: newTeacher.email,
      password: (tchData as any).password || 'teacher123',
      role: role,
      identifier: newTeacher.email,
      department: newTeacher.department,
      designation: newTeacher.designation,
      phone: newTeacher.phone || newTeacher.mobilePhone,
      registeredAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      teacherId: newId,
      avatar: newTeacher.avatar,
      status: 'ACTIVE'
    };
    setRegisteredUsers(prev => [newRegUser, ...prev]);

    if (newTeacher.isPrincipal) {
      setPrincipalUser(newTeacher);
    }
    if (newTeacher.isHOD) {
      setHodUser(newTeacher);
    }
    addLog('CREATE_TEACHER', `Added faculty member ${newTeacher.name}`);

    // Cloud SQL database persistence
    fetch('/api/teachers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...newTeacher,
        subjects: Array.isArray(newTeacher.subjects) ? JSON.stringify(newTeacher.subjects) : newTeacher.subjects
      })
    }).catch(e => console.warn('Cloud SQL teacher save error:', e));

    fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        uid: newUserId,
        name: newRegUser.name,
        email: newRegUser.email,
        password: newRegUser.password,
        role: newRegUser.role,
        identifier: newRegUser.identifier,
        department: newRegUser.department,
        designation: newRegUser.designation,
        phone: newRegUser.phone,
        avatar: newRegUser.avatar,
        status: newRegUser.status
      })
    }).catch(e => console.warn('Cloud SQL user save error:', e));
  };

  const updateTeacher = (updated: TeacherProfile & { password?: string }) => {
    setTeachers(prev => prev.map(t => (t.id === updated.id ? updated : t)));
    setRegisteredUsers(prev => prev.map(u => {
      if (u.teacherId === updated.id || (u.email && u.email.toLowerCase() === updated.email.toLowerCase())) {
        return {
          ...u,
          name: updated.name,
          email: updated.email,
          identifier: updated.email,
          department: updated.department,
          designation: updated.designation,
          phone: updated.phone || updated.mobilePhone,
          avatar: updated.avatar || u.avatar,
          ...((updated as any).password ? { password: (updated as any).password } : {})
        };
      }
      return u;
    }));

    if (updated.isPrincipal || updated.id === principalUser.id) {
      setPrincipalUser(prev => ({ ...prev, ...updated }));
    }
    if (updated.isHOD || updated.id === hodUser.id) {
      setHodUser(prev => ({ ...prev, ...updated }));
    }
    addLog('UPDATE_TEACHER', `Updated faculty profile for ${updated.name}`);

    fetch('/api/teachers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...updated,
        subjects: Array.isArray(updated.subjects) ? JSON.stringify(updated.subjects) : updated.subjects
      })
    }).catch(e => console.warn('Cloud SQL teacher update error:', e));

    if ((updated as any).password) {
      const regUser = registeredUsers.find(u => u.teacherId === updated.id || (u.email && u.email.toLowerCase() === updated.email.toLowerCase()));
      if (regUser) {
        fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            uid: regUser.id,
            name: updated.name,
            email: updated.email,
            password: (updated as any).password,
            role: regUser.role,
            identifier: updated.email,
            department: updated.department,
            designation: updated.designation,
            phone: updated.phone || updated.mobilePhone
          })
        }).catch(e => console.warn('Cloud SQL user password sync error:', e));
      }
    }
  };

  const deleteTeacher = (id: string) => {
    const target = teachers.find(t => t.id === id);
    setTeachers(prev => prev.filter(t => t.id !== id));
    if (target) {
      setRegisteredUsers(prev => prev.filter(u => u.teacherId !== id && u.email.toLowerCase() !== target.email.toLowerCase()));
      addLog('DELETE_TEACHER', `Removed faculty record for ${target.name}`);

      fetch(`/api/teachers/${id}`, { method: 'DELETE' }).catch(e => console.warn(e));
      if (target.userId) {
        fetch(`/api/users/${target.userId}`, { method: 'DELETE' }).catch(e => console.warn(e));
      }
    }
  };

  // Notice Management
  const addNotice = (ntc: Omit<Notice, 'id' | 'publishDate'>) => {
    const newNotice: Notice = {
      ...ntc,
      id: `ntc-${Date.now()}`,
      publishDate: new Date().toISOString().split('T')[0]
    };
    setNotices(prev => [newNotice, ...prev]);
    
    // Add Notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: newNotice.title,
      message: `New notice published by ${newNotice.publishedBy}`,
      type: 'notice',
      timestamp: 'Just now',
      read: false,
      linkTab: 'notices'
    };
    setNotifications(prev => [newNotif, ...prev]);
    addLog('PUBLISH_NOTICE', `Published notice: ${newNotice.title}`);

    fetch('/api/notices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newNotice)
    }).catch(e => console.warn('Cloud SQL notice save error:', e));
  };

  const deleteNotice = (id: string) => {
    setNotices(prev => prev.filter(n => n.id !== id));
    addLog('DELETE_NOTICE', `Deleted notice ID ${id}`);
    fetch(`/api/notices/${id}`, { method: 'DELETE' }).catch(e => console.warn(e));
  };

  // Assignment Management
  const addAssignment = (asg: Omit<Assignment, 'id' | 'createdAt'>) => {
    const newAsg: Assignment = {
      ...asg,
      id: `asg-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setAssignments(prev => [newAsg, ...prev]);
    
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `New Assignment: ${newAsg.title}`,
      message: `Due on ${newAsg.dueDate} for ${newAsg.subjectName}`,
      type: 'assignment',
      timestamp: 'Just now',
      read: false,
      linkTab: 'assignments'
    };
    setNotifications(prev => [newNotif, ...prev]);
    addLog('CREATE_ASSIGNMENT', `Created assignment ${newAsg.title}`);
  };

  const submitAssignment = (assignmentId: string, fileName: string) => {
    const newSubmission: AssignmentSubmission = {
      id: `subm-${Date.now()}`,
      assignmentId,
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      rollNumber: currentStudent.rollNumber,
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      fileName,
      fileSize: '1.5 MB',
      fileUrl: '#',
      status: 'SUBMITTED'
    };
    setSubmissions(prev => [newSubmission, ...prev]);
    addLog('SUBMIT_ASSIGNMENT', `Submitted file for assignment ID ${assignmentId}`);
  };

  const gradeSubmission = (submissionId: string, marks: number, feedback: string) => {
    setSubmissions(prev =>
      prev.map(sub =>
        sub.id === submissionId
          ? {
              ...sub,
              marksObtained: marks,
              teacherFeedback: feedback,
              status: 'GRADED'
            }
          : sub
      )
    );
    addLog('GRADE_SUBMISSION', `Graded submission ${submissionId} with score ${marks}`);
  };

  // Study Materials / Portal CRUD
  const addMaterial = (matData: Omit<StudyMaterial, 'id' | 'uploadedAt'>) => {
    const newMat: StudyMaterial = {
      ...matData,
      id: `mat-${Date.now()}`,
      uploadedAt: new Date().toISOString().split('T')[0]
    };
    setMaterials(prev => [newMat, ...prev]);
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `নতুন স্টাডি ম্যাটেরিয়াল: ${newMat.title}`,
      message: `${newMat.subjectCode} • ${newMat.category || 'Study Material'} আপলোড করা হয়েছে`,
      type: 'general',
      timestamp: 'Just now',
      read: false,
      linkTab: 'materials_student'
    };
    setNotifications(prev => [newNotif, ...prev]);
    addLog('CREATE_MATERIAL', `Uploaded study material: ${newMat.title}`);

    fetch('/api/materials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMat)
    }).catch(e => console.warn(e));
  };

  const deleteMaterial = (id: string) => {
    const target = materials.find(m => m.id === id);
    setMaterials(prev => prev.filter(m => m.id !== id));
    if (target) addLog('DELETE_MATERIAL', `Deleted study material: ${target.title}`);
    fetch(`/api/materials/${id}`, { method: 'DELETE' }).catch(e => console.warn(e));
  };

  // Attendance
  const addAttendance = (records: Omit<AttendanceRecord, 'id'>[]) => {
    const newRecords: AttendanceRecord[] = records.map((r, idx) => ({
      ...r,
      id: `att-${Date.now()}-${idx}`
    }));
    setAttendanceRecords(prev => [...newRecords, ...prev]);
    addLog('MARK_ATTENDANCE', `Marked attendance for ${records.length} students on ${records[0]?.date}`);
  };

  // Leave Management
  const addLeaveRequest = (req: Omit<LeaveRequest, 'id' | 'status' | 'appliedDate'>) => {
    const newReq: LeaveRequest = {
      ...req,
      id: `lv-${Date.now()}`,
      status: 'PENDING',
      appliedDate: new Date().toISOString().split('T')[0]
    };
    setLeaveRequests(prev => [newReq, ...prev]);
    addLog('SUBMIT_LEAVE', `Leave application submitted by ${req.applicantName}`);
  };

  const updateLeaveStatus = (id: string, status: 'APPROVED' | 'REJECTED', remark?: string) => {
    setLeaveRequests(prev =>
      prev.map(l => (l.id === id ? { ...l, status, adminRemark: remark } : l))
    );
    addLog('REVIEW_LEAVE', `Leave request ${id} set to ${status}`);
  };

  // Chat
  const sendChatMessage = (receiverId: string, messageText: string) => {
    const sender =
      role === 'ADMIN' ? principalUser : role === 'TEACHER' ? currentTeacher : currentStudent;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: sender.id,
      senderName: sender.name,
      senderAvatar: sender.avatar,
      senderRole: role,
      receiverId,
      message: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: true
    };
    setMessages(prev => [...prev, newMsg]);
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const sendPushNotification = (title: string, message: string, targetRole: 'ALL' | 'STUDENT' | 'TEACHER') => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title,
      message: `[Broadcast - ${targetRole}] ${message}`,
      type: 'general',
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
    addLog('PUSH_NOTIFICATION', `Broadcasted notification: "${title}" to ${targetRole}`);
  };

  // Fee Payment
  const payFee = (feeId: string) => {
    setFees(prev =>
      prev.map(f =>
        f.id === feeId
          ? {
              ...f,
              status: 'PAID',
              paidDate: new Date().toISOString().split('T')[0],
              receiptNo: `RCP-2026-${Math.floor(1000 + Math.random() * 9000)}`
            }
          : f
      )
    );
    addLog('FEE_PAYMENT', `Fee payment processed for receipt ID ${feeId}`);
  };

  const addRoutineItem = (item: Omit<RoutineItem, 'id'>) => {
    const newItem: RoutineItem = {
      ...item,
      id: `rt-${Date.now()}`
    };
    setRoutines(prev => [...prev, newItem]);
    addLog('ADD_ROUTINE', `Added routine class: ${item.subjectName}`);
    fetch('/api/routines', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem)
    }).catch(e => console.warn('Cloud SQL routine save error:', e));
  };

  const updateUserProfile = (data: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    department?: string;
    semester?: string;
    designation?: string;
    qualification?: string;
    officeRoom?: string;
    officeHours?: string;
    biography?: string;
    avatar?: string;
    guardianName?: string;
    guardianPhone?: string;
    rollNumber?: string;
  }) => {
    if (role === 'STUDENT') {
      const updatedStudent: StudentProfile = {
        ...currentStudent,
        ...data
      };
      setCurrentStudent(updatedStudent);
      setStudents(prev => prev.map(s => (s.id === updatedStudent.id ? updatedStudent : s)));
      setRegisteredUsers(prev =>
        prev.map(u => {
          if (
            u.role === 'STUDENT' &&
            (u.studentId === currentStudent.id ||
              (u.email && currentStudent.email && u.email.toLowerCase() === currentStudent.email.toLowerCase()) ||
              (u.identifier && currentStudent.rollNumber && u.identifier.toLowerCase() === currentStudent.rollNumber.toLowerCase()))
          ) {
            return {
              ...u,
              name: data.name ?? u.name,
              email: data.email ?? u.email,
              phone: data.phone ?? u.phone,
              department: data.department ?? u.department,
              semester: data.semester ?? u.semester,
              identifier: data.rollNumber ?? u.identifier,
              avatar: data.avatar ?? u.avatar
            };
          }
          return u;
        })
      );
      addLog('UPDATE_PROFILE', `Student profile updated for ${updatedStudent.name}`);
    } else if (role === 'TEACHER') {
      const updatedTeacher: TeacherProfile = {
        ...currentTeacher,
        ...data
      };
      setCurrentTeacher(updatedTeacher);
      setTeachers(prev => prev.map(t => (t.id === updatedTeacher.id ? updatedTeacher : t)));
      setRegisteredUsers(prev =>
        prev.map(u => {
          if (
            u.role === 'TEACHER' &&
            (u.teacherId === currentTeacher.id || (u.email && currentTeacher.email && u.email.toLowerCase() === currentTeacher.email.toLowerCase()))
          ) {
            return {
              ...u,
              name: data.name ?? u.name,
              email: data.email ?? u.email,
              phone: data.phone ?? u.phone,
              department: data.department ?? u.department,
              designation: data.designation ?? u.designation,
              avatar: data.avatar ?? u.avatar
            };
          }
          return u;
        })
      );
      addLog('UPDATE_PROFILE', `Faculty profile updated for ${updatedTeacher.name}`);
    } else if (role === 'HOD') {
      const updatedHOD: TeacherProfile = {
        ...hodUser,
        ...data
      };
      setHodUser(updatedHOD);
      setRegisteredUsers(prev =>
        prev.map(u => {
          if (u.role === 'HOD' && u.email && hodUser.email && u.email.toLowerCase() === hodUser.email.toLowerCase()) {
            return {
              ...u,
              name: data.name ?? u.name,
              email: data.email ?? u.email,
              phone: data.phone ?? u.phone,
              department: data.department ?? u.department,
              designation: data.designation ?? u.designation,
              avatar: data.avatar ?? u.avatar
            };
          }
          return u;
        })
      );
      addLog('UPDATE_PROFILE', `HOD profile updated for ${updatedHOD.name}`);
    } else if (role === 'PRINCIPAL') {
      const updatedPrincipal: TeacherProfile = {
        ...principalUser,
        ...data
      };
      setPrincipalUser(updatedPrincipal);
      setRegisteredUsers(prev =>
        prev.map(u => {
          if (u.role === 'PRINCIPAL' && u.email && principalUser.email && u.email.toLowerCase() === principalUser.email.toLowerCase()) {
            return {
              ...u,
              name: data.name ?? u.name,
              email: data.email ?? u.email,
              phone: data.phone ?? u.phone,
              avatar: data.avatar ?? u.avatar
            };
          }
          return u;
        })
      );
      addLog('UPDATE_PROFILE', `Principal profile updated for ${updatedPrincipal.name}`);
    } else if (role === 'ADMIN') {
      const updatedAdmin: TeacherProfile = {
        ...adminUser,
        ...data
      };
      setAdminUser(updatedAdmin);
      setRegisteredUsers(prev =>
        prev.map(u => {
          if (u.role === 'ADMIN' && u.email && adminUser.email && u.email.toLowerCase() === adminUser.email.toLowerCase()) {
            return {
              ...u,
              name: data.name ?? u.name,
              email: data.email ?? u.email,
              phone: data.phone ?? u.phone,
              avatar: data.avatar ?? u.avatar
            };
          }
          return u;
        })
      );
      addLog('UPDATE_PROFILE', `Master Admin profile updated for ${updatedAdmin.name}`);
    }
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        isAuthenticated,
        activeTab,
        setActiveTab,
        theme,
        toggleTheme,
        language,
        setLanguage,
        registeredUsers,
        login,
        loginWithGoogle,
        registerStudent,
        registerTeacher,
        registerAdmin,
        registerPrincipal,
        registerHOD,
        deleteRegisteredUser,
        updateUserRole,
        toggleUserStatus,
        resetUserPassword,
        exportUsersExcel,
        exportUsersPDF,
        downloadSlipPDF,
        logout,
        systemSettings,
        updateSystemSettings,
        toggleFeature,
        resetToDemoData,
        departments,
        teachers,
        students,
        subjects,
        routines,
        examSchedules,
        notices,
        assignments,
        submissions,
        materials,
        attendanceRecords,
        results,
        fees,
        leaveRequests,
        events,
        messages,
        notifications,
        systemLogs,
        currentStudent,
        currentTeacher,
        principalUser,
        adminUser,
        hodUser,
        addStudent,
        updateStudent,
        deleteStudent,
        addTeacher,
        updateTeacher,
        deleteTeacher,
        addNotice,
        deleteNotice,
        addAssignment,
        submitAssignment,
        gradeSubmission,
        addMaterial,
        deleteMaterial,
        addAttendance,
        addLeaveRequest,
        updateLeaveStatus,
        sendChatMessage,
        markNotificationRead,
        clearAllNotifications,
        sendPushNotification,
        payFee,
        addRoutineItem,
        updateUserProfile,
        isSearchOpen,
        setIsSearchOpen,
        isQRModalOpen,
        setIsQRModalOpen,
        isNotifOpen,
        setIsNotifOpen,
        colorMode,
        setColorMode,
        accentColor,
        setAccentColor,
        isBN,
        l,
        t,
        searchQuery,
        setSearchQuery
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
