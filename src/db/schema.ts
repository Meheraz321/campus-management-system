import { pgTable, text, serial, integer, boolean, timestamp } from 'drizzle-orm/pg-core';

// Users table (Stores both Firebase authenticated accounts and system login profiles)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase UID or local user ID
  email: text('email').notNull(),
  name: text('name').notNull(),
  password: text('password'),
  role: text('role').notNull().default('STUDENT'),
  identifier: text('identifier'),
  department: text('department'),
  semester: text('semester'),
  designation: text('designation'),
  phone: text('phone'),
  avatar: text('avatar'),
  status: text('status').default('ACTIVE'),
  registeredAt: timestamp('registered_at').defaultNow(),
});

// Teachers / Faculty Table
export const teachers = pgTable('teachers', {
  id: text('id').primaryKey(),
  userId: text('user_id'),
  name: text('name').notNull(),
  email: text('email').notNull(),
  avatar: text('avatar'),
  designation: text('designation').notNull(),
  department: text('department').notNull(),
  faculty: text('faculty'),
  shift: text('shift'),
  bcsBatch: text('bcs_batch'),
  phone: text('phone'),
  mobilePhone: text('mobile_phone'),
  officePhone: text('office_phone'),
  officeRoom: text('office_room'),
  qualification: text('qualification'),
  experienceYears: integer('experience_years').default(0),
  biography: text('biography'),
  officeHours: text('office_hours'),
  subjects: text('subjects'), // JSON serialized array
  isPrincipal: boolean('is_principal').default(false),
  isHOD: boolean('is_hod').default(false),
  isAdmin: boolean('is_admin').default(false),
  speechText: text('speech_text'),
});

// Students Profile Table
export const students = pgTable('students', {
  id: text('id').primaryKey(),
  userId: text('user_id'),
  name: text('name').notNull(),
  email: text('email'),
  avatar: text('avatar'),
  rollNumber: text('roll_number').notNull(),
  registrationNumber: text('registration_number'),
  department: text('department').notNull(),
  semester: text('semester').notNull(),
  section: text('section'),
  session: text('session'),
  cgpa: text('cgpa'),
  phone: text('phone'),
  address: text('address'),
  guardianName: text('guardian_name'),
  guardianPhone: text('guardian_phone'),
  bloodGroup: text('blood_group'),
  attendancePercentage: text('attendance_percentage'),
  pendingFees: integer('pending_fees').default(0),
});

// Academic Departments Table
export const departments = pgTable('departments', {
  id: text('id').primaryKey(),
  code: text('code').notNull(),
  name: text('name').notNull(),
  headName: text('head_name'),
  totalStudents: integer('total_students').default(0),
  totalTeachers: integer('total_teachers').default(0),
  coursesCount: integer('courses_count').default(0),
  iconName: text('icon_name'),
});

// Subjects Table
export const subjects = pgTable('subjects', {
  id: text('id').primaryKey(),
  code: text('code').notNull(),
  name: text('name').notNull(),
  department: text('department').notNull(),
  semester: text('semester').notNull(),
  credits: integer('credits').default(3),
  teacherName: text('teacher_name'),
  teacherId: text('teacher_id'),
});

// Class Routine Table
export const routines = pgTable('routines', {
  id: text('id').primaryKey(),
  day: text('day').notNull(),
  timeSlot: text('time_slot').notNull(),
  subjectCode: text('subject_code').notNull(),
  subjectName: text('subject_name').notNull(),
  teacherName: text('teacher_name'),
  roomNumber: text('room_number'),
  department: text('department').notNull(),
  semester: text('semester').notNull(),
  section: text('section'),
});

// Institutional Notices Table
export const notices = pgTable('notices', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  category: text('category').notNull(),
  publishedBy: text('published_by'),
  publishDate: text('publish_date'),
  targetRole: text('target_role').default('ALL'),
  attachmentName: text('attachment_name'),
  attachmentUrl: text('attachment_url'),
  isImportant: boolean('is_important').default(false),
});

// Assignments Table
export const assignments = pgTable('assignments', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  subjectCode: text('subject_code').notNull(),
  subjectName: text('subject_name').notNull(),
  teacherName: text('teacher_name'),
  teacherId: text('teacher_id'),
  department: text('department').notNull(),
  semester: text('semester').notNull(),
  dueDate: text('due_date').notNull(),
  maxMarks: integer('max_marks').default(100),
  attachmentName: text('attachment_name'),
  attachmentUrl: text('attachment_url'),
  createdAt: text('created_at'),
});

// Study Materials & Digital Class Notes Table
export const studyMaterials = pgTable('study_materials', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  subjectCode: text('subject_code').notNull(),
  subjectName: text('subject_name').notNull(),
  teacherName: text('teacher_name'),
  department: text('department').notNull(),
  semester: text('semester').notNull(),
  fileType: text('file_type').notNull(),
  fileUrl: text('file_url').notNull(),
  fileSize: text('file_size'),
  uploadedAt: text('uploaded_at'),
  videoDuration: text('video_duration'),
  category: text('category'),
  pages: integer('pages'),
});

// Attendance Records Table
export const attendanceRecords = pgTable('attendance_records', {
  id: text('id').primaryKey(),
  studentId: text('student_id').notNull(),
  studentName: text('student_name').notNull(),
  rollNumber: text('roll_number').notNull(),
  subjectCode: text('subject_code').notNull(),
  date: text('date').notNull(),
  status: text('status').notNull(),
  markedByTeacherId: text('marked_by_teacher_id'),
});

// Student Results Table
export const results = pgTable('results', {
  id: text('id').primaryKey(),
  studentId: text('student_id').notNull(),
  studentName: text('student_name').notNull(),
  rollNumber: text('roll_number').notNull(),
  department: text('department').notNull(),
  semester: text('semester').notNull(),
  subjectResults: text('subject_results'), // JSON string of results
  gpa: text('gpa'),
  publishedDate: text('published_date'),
});

// Fee Records Table
export const fees = pgTable('fees', {
  id: text('id').primaryKey(),
  studentId: text('student_id').notNull(),
  studentName: text('student_name').notNull(),
  rollNumber: text('roll_number').notNull(),
  department: text('department').notNull(),
  semester: text('semester').notNull(),
  title: text('title').notNull(),
  amount: integer('amount').notNull(),
  dueDate: text('due_date').notNull(),
  status: text('status').notNull(),
  paidDate: text('paid_date'),
  receiptNo: text('receipt_no'),
});

// Leave Requests Table
export const leaveRequests = pgTable('leave_requests', {
  id: text('id').primaryKey(),
  applicantId: text('applicant_id').notNull(),
  applicantName: text('applicant_name').notNull(),
  applicantRole: text('applicant_role').notNull(),
  department: text('department').notNull(),
  leaveType: text('leave_type').notNull(),
  startDate: text('start_date').notNull(),
  endDate: text('end_date').notNull(),
  reason: text('reason').notNull(),
  status: text('status').notNull(),
  appliedDate: text('applied_date').notNull(),
  adminRemark: text('admin_remark'),
});

// Chat Messages Table
export const chatMessages = pgTable('chat_messages', {
  id: text('id').primaryKey(),
  senderId: text('sender_id').notNull(),
  senderName: text('sender_name').notNull(),
  senderAvatar: text('sender_avatar'),
  senderRole: text('sender_role').notNull(),
  receiverId: text('receiver_id').notNull(),
  message: text('message').notNull(),
  timestamp: text('timestamp').notNull(),
  read: boolean('read').default(false),
});

// System Settings Table
export const systemSettings = pgTable('system_settings', {
  id: text('id').primaryKey(),
  campusName: text('campus_name'),
  campusTagline: text('campus_tagline'),
  collegeCode: text('college_code'),
  eiinNumber: text('eiin_number'),
  officialEmail: text('official_email'),
  contactPhone: text('contact_phone'),
  campusAddress: text('campus_address'),
  academicYear: text('academic_year'),
  allowOnlineAdmission: boolean('allow_online_admission'),
  allowStudentChat: boolean('allow_student_chat'),
  allowOnlineFeePayment: boolean('allow_online_fee_payment'),
  allowResultPublishing: boolean('allow_result_publishing'),
  allowLeaveApplications: boolean('allow_leave_applications'),
  maintenanceMode: boolean('maintenance_mode'),
});
