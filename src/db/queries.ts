import { db } from './index.ts';
import {
  teachers,
  students,
  departments,
  subjects,
  routines,
  notices,
  assignments,
  studyMaterials,
  attendanceRecords,
  results,
  fees,
  leaveRequests,
  chatMessages,
  systemSettings,
  users
} from './schema.ts';
import { eq, desc } from 'drizzle-orm';

function isTransientError(error: any): boolean {
  if (!error) return false;
  const msg = `${error.message || ''} ${error.cause?.message || ''} ${error.stack || ''}`;
  return (
    msg.includes('Connection terminated unexpectedly') ||
    msg.includes('ECONNRESET') ||
    msg.includes('ETIMEDOUT') ||
    msg.includes('connection timeout') ||
    msg.includes('57P01') ||
    msg.includes('terminating connection') ||
    msg.includes('closed the connection unexpectedly')
  );
}

export async function withTransientRetry<T>(fn: () => Promise<T>, attempts = 3): Promise<T> {
  let lastError: any;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err: any) {
      lastError = err;
      if (i < attempts - 1 && isTransientError(err)) {
        const delay = 500 * Math.pow(2, i) + Math.random() * 200;
        console.warn(`Transient DB connection drop (attempt ${i + 1}/${attempts}), retrying after ${Math.round(delay)}ms...`);
        await new Promise(res => setTimeout(res, delay));
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}

// Teachers Queries
export async function getAllTeachers() {
  return withTransientRetry(async () => {
    try {
      return await db.select().from(teachers);
    } catch (error) {
      console.error('Failed to get teachers:', error);
      throw new Error('Could not fetch teachers', { cause: error });
    }
  });
}

export async function upsertTeacher(data: typeof teachers.$inferInsert) {
  return withTransientRetry(async () => {
    try {
      const inserted = await db
        .insert(teachers)
        .values(data)
        .onConflictDoUpdate({
          target: teachers.id,
          set: {
            name: data.name,
            email: data.email,
            avatar: data.avatar,
            designation: data.designation,
            department: data.department,
            faculty: data.faculty,
            shift: data.shift,
            bcsBatch: data.bcsBatch,
            phone: data.phone,
            mobilePhone: data.mobilePhone,
            officePhone: data.officePhone,
            officeRoom: data.officeRoom,
            qualification: data.qualification,
            experienceYears: data.experienceYears,
            biography: data.biography,
            officeHours: data.officeHours,
            subjects: data.subjects,
            isPrincipal: data.isPrincipal,
            isHOD: data.isHOD,
            isAdmin: data.isAdmin,
            speechText: data.speechText
          }
        })
        .returning();
      return inserted[0];
    } catch (error) {
      console.error('Failed to upsert teacher:', error);
      throw new Error('Could not save teacher', { cause: error });
    }
  });
}

export async function deleteTeacherRecord(id: string) {
  return withTransientRetry(async () => {
    try {
      return await db.delete(teachers).where(eq(teachers.id, id)).returning();
    } catch (error) {
      console.error('Failed to delete teacher:', error);
      throw new Error('Could not delete teacher', { cause: error });
    }
  });
}

// Students Queries
export async function getAllStudents() {
  return withTransientRetry(async () => {
    try {
      return await db.select().from(students);
    } catch (error) {
      console.error('Failed to get students:', error);
      throw new Error('Could not fetch students', { cause: error });
    }
  });
}

export async function upsertStudent(data: typeof students.$inferInsert) {
  return withTransientRetry(async () => {
    try {
      const inserted = await db
        .insert(students)
        .values(data)
        .onConflictDoUpdate({
          target: students.id,
          set: {
            name: data.name,
            email: data.email,
            avatar: data.avatar,
            rollNumber: data.rollNumber,
            registrationNumber: data.registrationNumber,
            department: data.department,
            semester: data.semester,
            section: data.section,
            session: data.session,
            phone: data.phone,
            address: data.address,
            bloodGroup: data.bloodGroup,
            cgpa: data.cgpa,
            attendancePercentage: data.attendancePercentage,
            pendingFees: data.pendingFees,
            guardianName: data.guardianName,
            guardianPhone: data.guardianPhone
          }
        })
        .returning();
      return inserted[0];
    } catch (error) {
      console.error('Failed to upsert student:', error);
      throw new Error('Could not save student', { cause: error });
    }
  });
}

export async function deleteStudentRecord(id: string) {
  return withTransientRetry(async () => {
    try {
      return await db.delete(students).where(eq(students.id, id)).returning();
    } catch (error) {
      console.error('Failed to delete student:', error);
      throw new Error('Could not delete student', { cause: error });
    }
  });
}

// Registered Users Queries
export async function getAllUsers() {
  return withTransientRetry(async () => {
    try {
      return await db.select().from(users).orderBy(desc(users.registeredAt));
    } catch (error) {
      console.error('Failed to get users:', error);
      throw new Error('Could not fetch users', { cause: error });
    }
  });
}

export async function upsertUser(data: typeof users.$inferInsert) {
  return withTransientRetry(async () => {
    try {
      const inserted = await db
        .insert(users)
        .values(data)
        .onConflictDoUpdate({
          target: users.uid,
          set: {
            name: data.name,
            email: data.email,
            password: data.password,
            role: data.role,
            identifier: data.identifier,
            department: data.department,
            semester: data.semester,
            designation: data.designation,
            phone: data.phone,
            avatar: data.avatar,
            status: data.status,
          }
        })
        .returning();
      return inserted[0];
    } catch (error) {
      console.error('Failed to upsert user:', error);
      throw new Error('Could not save user', { cause: error });
    }
  });
}

export async function deleteUserRecord(uid: string) {
  return withTransientRetry(async () => {
    try {
      return await db.delete(users).where(eq(users.uid, uid)).returning();
    } catch (error) {
      console.error('Failed to delete user:', error);
      throw new Error('Could not delete user', { cause: error });
    }
  });
}

// Notices Queries
export async function getAllNotices() {
  return withTransientRetry(async () => {
    try {
      return await db.select().from(notices);
    } catch (error) {
      console.error('Failed to get notices:', error);
      throw new Error('Could not fetch notices', { cause: error });
    }
  });
}

export async function upsertNotice(data: typeof notices.$inferInsert) {
  return withTransientRetry(async () => {
    try {
      const inserted = await db
        .insert(notices)
        .values(data)
        .onConflictDoUpdate({
          target: notices.id,
          set: {
            title: data.title,
            content: data.content,
            category: data.category,
            publishedBy: data.publishedBy,
            publishDate: data.publishDate,
            targetRole: data.targetRole,
            attachmentName: data.attachmentName,
            attachmentUrl: data.attachmentUrl,
            isImportant: data.isImportant
          }
        })
        .returning();
      return inserted[0];
    } catch (error) {
      console.error('Failed to upsert notice:', error);
      throw new Error('Could not save notice', { cause: error });
    }
  });
}

export async function deleteNoticeRecord(id: string) {
  return withTransientRetry(async () => {
    try {
      return await db.delete(notices).where(eq(notices.id, id)).returning();
    } catch (error) {
      console.error('Failed to delete notice:', error);
      throw new Error('Could not delete notice', { cause: error });
    }
  });
}

// Attendance Queries
export async function getAllAttendance() {
  return withTransientRetry(async () => {
    try {
      return await db.select().from(attendanceRecords);
    } catch (error) {
      console.error('Failed to get attendance:', error);
      throw new Error('Could not fetch attendance', { cause: error });
    }
  });
}

export async function saveAttendanceRecords(records: (typeof attendanceRecords.$inferInsert)[]) {
  return withTransientRetry(async () => {
    try {
      if (records.length === 0) return [];
      return await db.insert(attendanceRecords).values(records).returning();
    } catch (error) {
      console.error('Failed to save attendance records:', error);
      throw new Error('Could not save attendance', { cause: error });
    }
  });
}

// Routine Queries
export async function getAllRoutines() {
  return withTransientRetry(async () => {
    try {
      return await db.select().from(routines);
    } catch (error) {
      console.error('Failed to get routines:', error);
      throw new Error('Could not fetch routines', { cause: error });
    }
  });
}

export async function upsertRoutine(data: typeof routines.$inferInsert) {
  return withTransientRetry(async () => {
    try {
      const inserted = await db
        .insert(routines)
        .values(data)
        .onConflictDoUpdate({
          target: routines.id,
          set: {
            day: data.day,
            timeSlot: data.timeSlot,
            subjectCode: data.subjectCode,
            subjectName: data.subjectName,
            teacherName: data.teacherName,
            roomNumber: data.roomNumber,
            department: data.department,
            semester: data.semester,
            section: data.section
          }
        })
        .returning();
      return inserted[0];
    } catch (error) {
      console.error('Failed to upsert routine:', error);
      throw new Error('Could not save routine', { cause: error });
    }
  });
}

// Study Materials Queries
export async function getAllStudyMaterials() {
  return withTransientRetry(async () => {
    try {
      return await db.select().from(studyMaterials);
    } catch (error) {
      console.error('Failed to get study materials:', error);
      throw new Error('Could not fetch study materials', { cause: error });
    }
  });
}

export async function upsertStudyMaterial(data: typeof studyMaterials.$inferInsert) {
  return withTransientRetry(async () => {
    try {
      const inserted = await db
        .insert(studyMaterials)
        .values(data)
        .onConflictDoUpdate({
          target: studyMaterials.id,
          set: {
            title: data.title,
            description: data.description,
            subjectCode: data.subjectCode,
            subjectName: data.subjectName,
            teacherName: data.teacherName,
            department: data.department,
            semester: data.semester,
            fileType: data.fileType,
            fileUrl: data.fileUrl,
            fileSize: data.fileSize,
            uploadedAt: data.uploadedAt,
            videoDuration: data.videoDuration,
            category: data.category,
            pages: data.pages
          }
        })
        .returning();
      return inserted[0];
    } catch (error) {
      console.error('Failed to upsert study material:', error);
      throw new Error('Could not save study material', { cause: error });
    }
  });
}

export async function deleteStudyMaterialRecord(id: string) {
  return withTransientRetry(async () => {
    try {
      return await db.delete(studyMaterials).where(eq(studyMaterials.id, id)).returning();
    } catch (error) {
      console.error('Failed to delete study material:', error);
      throw new Error('Could not delete study material', { cause: error });
    }
  });
}

// Leave Requests Queries
export async function getAllLeaveRequests() {
  return withTransientRetry(async () => {
    try {
      return await db.select().from(leaveRequests);
    } catch (error) {
      console.error('Failed to get leave requests:', error);
      throw new Error('Could not fetch leave requests', { cause: error });
    }
  });
}

export async function upsertLeaveRequest(data: typeof leaveRequests.$inferInsert) {
  return withTransientRetry(async () => {
    try {
      const inserted = await db
        .insert(leaveRequests)
        .values(data)
        .onConflictDoUpdate({
          target: leaveRequests.id,
          set: {
            applicantId: data.applicantId,
            applicantName: data.applicantName,
            applicantRole: data.applicantRole,
            department: data.department,
            leaveType: data.leaveType,
            startDate: data.startDate,
            endDate: data.endDate,
            reason: data.reason,
            status: data.status,
            appliedDate: data.appliedDate,
            adminRemark: data.adminRemark
          }
        })
        .returning();
      return inserted[0];
    } catch (error) {
      console.error('Failed to upsert leave request:', error);
      throw new Error('Could not save leave request', { cause: error });
    }
  });
}

// System Settings Queries
export async function getSystemSettingsRecord() {
  return withTransientRetry(async () => {
    try {
      const rows = await db.select().from(systemSettings).where(eq(systemSettings.id, 'current')).limit(1);
      return rows[0] || null;
    } catch (error) {
      console.error('Failed to get system settings:', error);
      throw new Error('Could not fetch settings', { cause: error });
    }
  });
}

export async function upsertSystemSettings(data: Partial<typeof systemSettings.$inferInsert>) {
  return withTransientRetry(async () => {
    try {
      const inserted = await db
        .insert(systemSettings)
        .values({ id: 'current', ...data })
        .onConflictDoUpdate({
          target: systemSettings.id,
          set: data
        })
        .returning();
      return inserted[0];
    } catch (error) {
      console.error('Failed to update system settings:', error);
      throw new Error('Could not save settings', { cause: error });
    }
  });
}
