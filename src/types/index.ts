export type UserRole = 'ADMIN' | 'PRINCIPAL' | 'HOD' | 'TEACHER' | 'STUDENT';

export type Language = 'EN' | 'BN';
export type ColorMode = 'light' | 'dark' | 'system';
export type AccentColor = 'indigo' | 'emerald' | 'blue' | 'purple' | 'amber';

export interface SystemSettings {
  campusName: string;
  campusTagline: string;
  collegeCode: string;
  eiinNumber: string;
  officialEmail: string;
  contactPhone: string;
  campusAddress: string;
  academicYear: string;
  allowOnlineAdmission: boolean;
  allowStudentChat: boolean;
  allowOnlineFeePayment: boolean;
  allowResultPublishing: boolean;
  allowLeaveApplications: boolean;
  maintenanceMode: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  phone?: string;
  departmentId?: string;
  designation?: string;
}

export interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  identifier: string; // Roll number, Employee ID, or Email
  department?: string;
  semester?: string;
  designation?: string;
  phone?: string;
  registeredAt: string;
  avatar?: string;
  studentId?: string;
  teacherId?: string;
  status?: 'ACTIVE' | 'SUSPENDED';
}

export interface StudentProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  avatar: string;
  rollNumber: string;
  registrationNumber: string;
  department: string;
  semester: string;
  section: string;
  session: string;
  cgpa: number;
  phone: string;
  address: string;
  guardianName: string;
  guardianPhone: string;
  bloodGroup: string;
  attendancePercentage: number;
  pendingFees?: number;
}

export interface TeacherProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  avatar: string;
  designation: string;
  department: string;
  faculty?: string;
  bcsBatch?: string;
  officePhone?: string;
  mobilePhone?: string;
  shift?: string;
  subjects: string[];
  phone: string;
  officeRoom: string;
  qualification: string;
  experienceYears: number;
  biography: string;
  officeHours: string;
  assignedClassesCount?: number;
  totalStudentsTaught?: number;
  isPrincipal?: boolean;
  isHOD?: boolean;
  isAdmin?: boolean;
  signatureUrl?: string;
  speechText?: string;
  password?: string;
}

export interface Department {
  id: string;
  code: string;
  name: string;
  headName: string;
  totalStudents: number;
  totalTeachers: number;
  coursesCount: number;
  iconName: string;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  department: string;
  semester: string;
  credits: number;
  teacherName: string;
  teacherId: string;
}

export interface RoutineItem {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  timeSlot: string;
  subjectCode: string;
  subjectName: string;
  teacherName: string;
  roomNumber: string;
  department: string;
  semester: string;
  section: string;
}

export interface ExamScheduleItem {
  id: string;
  subjectCode: string;
  subjectName: string;
  date: string;
  timeSlot: string;
  roomNumber: string;
  semester: string;
  department: string;
  invigilator: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  subjectCode: string;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE';
  markedByTeacherId: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  subjectCode: string;
  subjectName: string;
  teacherName: string;
  teacherId: string;
  department: string;
  semester: string;
  dueDate: string;
  maxMarks: number;
  attachmentName?: string;
  attachmentType?: 'pdf' | 'docx' | 'image';
  attachmentUrl?: string;
  createdAt: string;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  submittedAt: string;
  fileName: string;
  fileSize: string;
  fileUrl: string;
  status: 'SUBMITTED' | 'GRADED' | 'LATE';
  marksObtained?: number;
  teacherFeedback?: string;
}

export interface StudyMaterial {
  id: string;
  title: string;
  description: string;
  subjectCode: string;
  subjectName: string;
  teacherName: string;
  department: string;
  semester: string;
  fileType: 'pdf' | 'docx' | 'video' | 'image';
  fileUrl: string;
  fileSize?: string;
  uploadedAt: string;
  videoDuration?: string;
  category?: 'Lecture Notes' | 'Video Class' | 'Lab Manual' | 'Question Bank' | 'Hand Notes' | 'Cheat Sheet';
  pages?: number;
  tags?: string[];
  isFeatured?: boolean;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  category: 'General' | 'Academic' | 'Exam' | 'Event' | 'Emergency' | 'Holiday';
  publishedBy: string;
  publishDate: string;
  targetRole: 'ALL' | 'STUDENT' | 'TEACHER';
  attachmentName?: string;
  attachmentUrl?: string;
  isImportant?: boolean;
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  bannerImage: string;
  category: 'Sports' | 'Cultural' | 'Seminar' | 'Workshop' | 'Tech Fest';
}

export interface ResultRecord {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  department: string;
  semester: string;
  subjectResults: {
    subjectCode: string;
    subjectName: string;
    credits: number;
    marksObtained: number;
    grade: string;
    gradePoint: number;
  }[];
  gpa: number;
  publishedDate: string;
}

export interface FeeRecord {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  department: string;
  semester: string;
  title: string;
  amount: number;
  dueDate: string;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
  paidDate?: string;
  receiptNo?: string;
}

export interface LeaveRequest {
  id: string;
  applicantId: string;
  applicantName: string;
  applicantRole: 'STUDENT' | 'TEACHER';
  department: string;
  leaveType: 'Sick Leave' | 'Casual Leave' | 'Academic Leave' | 'Personal';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  appliedDate: string;
  adminRemark?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderRole: UserRole;
  receiverId: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'notice' | 'assignment' | 'attendance' | 'result' | 'general' | 'leave';
  timestamp: string;
  read: boolean;
  linkTab?: string;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
  ipAddress: string;
  status: 'SUCCESS' | 'WARNING' | 'ERROR';
}
