import {
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
} from './types';

export const INITIAL_DEPARTMENTS: Department[] = [
  {
    id: 'dept-cst',
    code: 'CST',
    name: 'কম্পিউটার সাইন্স এণ্ড টেকনোলজি',
    headName: 'বিভাগীয় প্রধান',
    totalStudents: 0,
    totalTeachers: 0,
    coursesCount: 0,
    iconName: 'Laptop'
  },
  {
    id: 'dept-eee',
    code: 'EEE',
    name: 'ইলেকট্রিক্যাল টেকনোলজি',
    headName: 'বিভাগীয় প্রধান',
    totalStudents: 0,
    totalTeachers: 0,
    coursesCount: 0,
    iconName: 'Zap'
  },
  {
    id: 'dept-electronics',
    code: 'ENT',
    name: 'ইলেকট্রনিক্স টেকনোলজি',
    headName: 'বিভাগীয় প্রধান',
    totalStudents: 0,
    totalTeachers: 0,
    coursesCount: 0,
    iconName: 'Cpu'
  },
  {
    id: 'dept-telecom',
    code: 'TCT',
    name: 'টেলিকমিউনিকেশন টেকনোলজি',
    headName: 'বিভাগীয় প্রধান',
    totalStudents: 0,
    totalTeachers: 0,
    coursesCount: 0,
    iconName: 'Radio'
  },
  {
    id: 'dept-non-tech',
    code: 'NON-TECH',
    name: 'নন-টেক ডিপার্টমেন্ট',
    headName: 'বিভাগীয় প্রধান',
    totalStudents: 0,
    totalTeachers: 0,
    coursesCount: 0,
    iconName: 'BookOpen'
  },
  {
    id: 'dept-admin',
    code: 'ADMIN',
    name: 'প্রশাসন (Administration)',
    headName: 'অধ্যক্ষ',
    totalStudents: 0,
    totalTeachers: 0,
    coursesCount: 0,
    iconName: 'Building'
  }
];

export const INITIAL_TEACHERS: TeacherProfile[] = [];
export const INITIAL_STUDENTS: StudentProfile[] = [];
export const INITIAL_SUBJECTS: Subject[] = [];
export const INITIAL_ROUTINE: RoutineItem[] = [];
export const INITIAL_EXAM_SCHEDULE: ExamScheduleItem[] = [];
export const INITIAL_NOTICES: Notice[] = [];
export const INITIAL_ASSIGNMENTS: Assignment[] = [];
export const INITIAL_SUBMISSIONS: AssignmentSubmission[] = [];
export const INITIAL_STUDY_MATERIALS: StudyMaterial[] = [];
export const INITIAL_ATTENDANCE: AttendanceRecord[] = [];
export const INITIAL_RESULTS: ResultRecord[] = [];
export const INITIAL_FEES: FeeRecord[] = [];
export const INITIAL_LEAVE_REQUESTS: LeaveRequest[] = [];
export const INITIAL_EVENTS: EventItem[] = [];
export const INITIAL_CHAT: ChatMessage[] = [];
export const INITIAL_NOTIFICATIONS: NotificationItem[] = [];
export const INITIAL_SYSTEM_LOGS: SystemLog[] = [];

export const CAMPUS_FACILITIES: any[] = [];
export const CAMPUS_GALLERY: any[] = [];
