import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { createServer as createViteServer } from 'vite';
import {
  getAllTeachers,
  upsertTeacher,
  deleteTeacherRecord,
  getAllStudents,
  upsertStudent,
  deleteStudentRecord,
  getAllUsers,
  upsertUser,
  deleteUserRecord,
  getAllNotices,
  upsertNotice,
  deleteNoticeRecord,
  getAllAttendance,
  saveAttendanceRecords,
  getAllRoutines,
  upsertRoutine,
  getAllStudyMaterials,
  upsertStudyMaterial,
  deleteStudyMaterialRecord,
  getAllLeaveRequests,
  upsertLeaveRequest,
  getSystemSettingsRecord,
  upsertSystemSettings
} from './src/db/queries.ts';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));

// Health / Status check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', database: 'cloudsql-postgresql', timestamp: new Date().toISOString() });
});

// Teachers API
app.get('/api/teachers', async (req, res) => {
  try {
    const list = await getAllTeachers();
    res.json(list);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch teachers' });
  }
});

app.post('/api/teachers', async (req, res) => {
  try {
    const saved = await upsertTeacher(req.body);
    res.json(saved);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to save teacher' });
  }
});

app.delete('/api/teachers/:id', async (req, res) => {
  try {
    const deleted = await deleteTeacherRecord(req.params.id);
    res.json({ success: true, deleted });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to delete teacher' });
  }
});

// Students API
app.get('/api/students', async (req, res) => {
  try {
    const list = await getAllStudents();
    res.json(list);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch students' });
  }
});

app.post('/api/students', async (req, res) => {
  try {
    const saved = await upsertStudent(req.body);
    res.json(saved);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to save student' });
  }
});

app.delete('/api/students/:id', async (req, res) => {
  try {
    const deleted = await deleteStudentRecord(req.params.id);
    res.json({ success: true, deleted });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to delete student' });
  }
});

// Registered Users API
app.get('/api/users', async (req, res) => {
  try {
    const list = await getAllUsers();
    res.json(list);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch users' });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const saved = await upsertUser(req.body);
    res.json(saved);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to save user' });
  }
});

app.delete('/api/users/:uid', async (req, res) => {
  try {
    const deleted = await deleteUserRecord(req.params.uid);
    res.json({ success: true, deleted });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to delete user' });
  }
});

// Notices API
app.get('/api/notices', async (req, res) => {
  try {
    const list = await getAllNotices();
    res.json(list);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch notices' });
  }
});

app.post('/api/notices', async (req, res) => {
  try {
    const saved = await upsertNotice(req.body);
    res.json(saved);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to save notice' });
  }
});

app.delete('/api/notices/:id', async (req, res) => {
  try {
    const deleted = await deleteNoticeRecord(req.params.id);
    res.json({ success: true, deleted });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to delete notice' });
  }
});

// Attendance API
app.get('/api/attendance', async (req, res) => {
  try {
    const list = await getAllAttendance();
    res.json(list);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch attendance' });
  }
});

app.post('/api/attendance', async (req, res) => {
  try {
    const records = Array.isArray(req.body) ? req.body : [req.body];
    const saved = await saveAttendanceRecords(records);
    res.json(saved);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to save attendance' });
  }
});

// Routine API
app.get('/api/routines', async (req, res) => {
  try {
    const list = await getAllRoutines();
    res.json(list);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch routines' });
  }
});

app.post('/api/routines', async (req, res) => {
  try {
    const saved = await upsertRoutine(req.body);
    res.json(saved);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to save routine' });
  }
});

// Study Materials API
app.get('/api/materials', async (req, res) => {
  try {
    const list = await getAllStudyMaterials();
    res.json(list);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch materials' });
  }
});

app.post('/api/materials', async (req, res) => {
  try {
    const saved = await upsertStudyMaterial(req.body);
    res.json(saved);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to save material' });
  }
});

app.delete('/api/materials/:id', async (req, res) => {
  try {
    const deleted = await deleteStudyMaterialRecord(req.params.id);
    res.json({ success: true, deleted });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to delete material' });
  }
});

// Leave Requests API
app.get('/api/leaves', async (req, res) => {
  try {
    const list = await getAllLeaveRequests();
    res.json(list);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch leaves' });
  }
});

app.post('/api/leaves', async (req, res) => {
  try {
    const saved = await upsertLeaveRequest(req.body);
    res.json(saved);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to save leave' });
  }
});

// System Settings API
app.get('/api/settings', async (req, res) => {
  try {
    const settings = await getSystemSettingsRecord();
    res.json(settings || {});
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch settings' });
  }
});

app.post('/api/settings', async (req, res) => {
  try {
    const saved = await upsertSystemSettings(req.body);
    res.json(saved);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to save settings' });
  }
});

// Database Auto-seeder
async function seedDatabaseIfEmpty() {
  try {
    const existingUsers = await getAllUsers();
    if (existingUsers.length === 0) {
      console.log('Seeding initial data into Cloud SQL PostgreSQL database...');

      // Seed Users
      const initialUsers = [
        {
          uid: 'u-adm-demo',
          name: 'সুপার অ্যাডমিনিস্ট্রেটর (Master Admin)',
          email: 'admin@campus.edu',
          password: 'admin',
          role: 'ADMIN',
          identifier: 'admin@campus.edu',
          department: 'সিস্টেম প্রশাসন (IT & Control)',
          designation: 'Master System Administrator & Controller',
          phone: '+880 1711-000000',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&fit=crop&q=80',
          status: 'ACTIVE',
        },
        {
          uid: 'u-pri-demo',
          name: 'প্রফেসর ড. মুহাম্মদ নুরুল ইসলাম',
          email: 'principal@campus.edu',
          password: 'principal',
          role: 'PRINCIPAL',
          identifier: 'principal@campus.edu',
          department: 'প্রশাসন (Administration)',
          designation: 'অধ্যক্ষ ও প্রধান নির্বাহী (Principal)',
          phone: '+880 1712-345678',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&fit=crop&q=80',
          status: 'ACTIVE',
        },
        {
          uid: 'u-hod-demo',
          name: 'ড. মোশাররফ হোসেন',
          email: 'hod@campus.edu',
          password: 'hod',
          role: 'HOD',
          identifier: 'hod@campus.edu',
          department: 'কম্পিউটার সাইন্স এণ্ড টেকনোলজি',
          designation: 'বিভাগীয় প্রধান (HOD - CST)',
          phone: '+880 1713-987654',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&fit=crop&q=80',
          status: 'ACTIVE',
        },
        {
          uid: 'u-tch-demo',
          name: 'মোঃ রফিকুল ইসলাম',
          email: 'teacher@campus.edu',
          password: 'teacher',
          role: 'TEACHER',
          identifier: 'teacher@campus.edu',
          department: 'কম্পিউটার সাইন্স এণ্ড টেকনোলজি (১ম শিফট)',
          designation: 'সহকারী অধ্যাপক (Senior Lecturer)',
          phone: '+880 1714-556677',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&fit=crop&q=80',
          status: 'ACTIVE',
        },
        {
          uid: 'u-std-demo',
          name: 'তানভীর আহমেদ',
          email: 'student@campus.edu',
          password: 'student',
          role: 'STUDENT',
          identifier: 'CST-2026-01',
          department: 'কম্পিউটার সাইন্স এণ্ড টেকনোলজি',
          semester: '৪র্থ সেমিস্টার',
          phone: '+880 1819-112233',
          avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&fit=crop&q=80',
          status: 'ACTIVE',
        },
      ];

      for (const u of initialUsers) {
        await upsertUser(u);
      }
    }

    const existingTeachers = await getAllTeachers();
    if (existingTeachers.length === 0) {
      const initialTeachers = [
        {
          id: 'tch-pri-main',
          userId: 'u-pri-demo',
          name: 'প্রফেসর ড. মুহাম্মদ নুরুল ইসলাম',
          email: 'principal@campus.edu',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&fit=crop&q=80',
          designation: 'উপাধ্যক্ষ ও অধ্যক্ষ (অ.দা.)',
          department: 'প্রশাসন (Administration)',
          faculty: 'প্রশাসন',
          shift: 'সাধারণ',
          bcsBatch: '৩৮',
          phone: '+880 1712-345678',
          mobilePhone: '+880 1712-345678',
          officePhone: '+880 2-987654',
          officeRoom: 'অধ্যক্ষ কার্যালয় (প্রশাসনিক ভবন - ১০১)',
          qualification: 'Ph.D in Engineering, M.Sc (First Class), বিসিএস (কারিগরি শিক্ষা)',
          experienceYears: 24,
          biography: 'অধ্যক্ষ ও প্রধান নির্বাহী কর্মকর্তা। প্রাতিষ্ঠানিক নীতি, একাডেমিক উৎকর্ষ, সার্বিক শৃঙ্খলা ও পরীক্ষার ফলাফল অনুমোদন করেন।',
          officeHours: 'রবিবার - বৃহস্পতিবার: ০৯:০০ AM - ০৫:০০ PM',
          subjects: JSON.stringify(['Engineering Ethics', 'Research Methodology']),
          isPrincipal: true,
          isHOD: false,
          isAdmin: false,
          speechText: 'আমাদের লক্ষ্য প্রতিটি শিক্ষার্থীকে সৎ, নিষ্ঠাবান এবং আধুনিক প্রযুক্তি জ্ঞানসম্পন্ন দক্ষ মানবসম্পদে রূপান্তরিত করা।',
        },
        {
          id: 'tch-hod-main',
          userId: 'u-hod-demo',
          name: 'ড. মোশাররফ হোসেন',
          email: 'hod@campus.edu',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&fit=crop&q=80',
          designation: 'চিফ ইনস্ট্রাক্টর ও বিভাগীয় প্রধান (CST)',
          department: 'কম্পিউটার সাইন্স এণ্ড টেকনোলজি (১ম শিফট)',
          faculty: 'কম্পিউটার সাইন্স এণ্ড টেকনোলজি',
          shift: '১ম শিফট',
          bcsBatch: '৪২',
          phone: '+880 1713-987654',
          mobilePhone: '+880 1713-987654',
          officePhone: '+880 2-987655',
          officeRoom: 'বিভাগীয় প্রধান কার্যালয় (কম্পিউটার ভবন)',
          qualification: 'Ph.D & M.Sc in Computer Science & Engineering',
          experienceYears: 16,
          biography: 'বিভাগীয় শিক্ষা কার্যক্রম, ল্যাব ও ক্লাস রুটিনের তত্ত্বাবধায়ক ও কারিগরি শিক্ষা বিশেষজ্ঞ।',
          officeHours: 'রবিবার - বৃহস্পতিবার: ০৯:০০ AM - ০৪:০০ PM',
          subjects: JSON.stringify(['Microprocessor & Interfacing', 'Data Structures', 'Database Systems']),
          isPrincipal: false,
          isHOD: true,
          isAdmin: false,
        },
        {
          id: 'tch-001',
          userId: 'u-tch-demo',
          name: 'মোঃ রফিকুল ইসলাম',
          email: 'teacher@campus.edu',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&fit=crop&q=80',
          designation: 'সহকারী অধ্যাপক ও সিনিয়র লেকচারার',
          department: 'কম্পিউটার সাইন্স এণ্ড টেকনোলজি (১ম শিফট)',
          faculty: 'কম্পিউটার সাইন্স এণ্ড টেকনোলজি',
          shift: '১ম শিফট',
          bcsBatch: '৪৩',
          phone: '+880 1714-556677',
          mobilePhone: '+880 1714-556677',
          officeRoom: 'কক্ষ নং ২০৪ (একাডেমিক ভবন)',
          qualification: 'M.Sc. in Computer Science, B.Sc. in CSE',
          experienceYears: 9,
          biography: 'ব্যবহারিক ও প্রজেক্ট-ভিত্তিক কারিগরি শিক্ষাদানে নিবেদিত প্রাণ শিক্ষক। পাইথন ও ডেটাস্ট্রাকচার বিশেষজ্ঞ।',
          officeHours: 'রবিবার - বৃহস্পতিবার: ০৯:০০ AM - ০৩:০০ PM',
          subjects: JSON.stringify(['Python Programming', 'Algorithms', 'Web Development']),
          isPrincipal: false,
          isHOD: false,
          isAdmin: false,
        },
        {
          id: 'tch-002',
          userId: 'u-tch-002',
          name: 'মোছাঃ ফারহানা আহমেদ',
          email: 'farhana.cse@campus.edu',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
          designation: 'জুনিয়র ইনস্ট্রাক্টর (টেক/কম্পিউটার)',
          department: 'কম্পিউটার সাইন্স এণ্ড টেকনোলজি (২য় শিফট)',
          faculty: 'কম্পিউটার সাইন্স এণ্ড টেকনোলজি',
          shift: '২য় শিফট',
          phone: '+880 1715-667788',
          mobilePhone: '+880 1715-667788',
          officeRoom: 'কক্ষ নং ২০৫ (সফটওয়্যার ল্যাব)',
          qualification: 'B.Sc. in Computer Science & Engineering',
          experienceYears: 5,
          biography: 'সফটওয়্যার ইঞ্জিনিয়ারিং, ক্লাউড ও ডেটাবেজ ম্যানেজমেন্ট বিষয়ে শিক্ষকতা ও প্রজেক্ট গাইড।',
          officeHours: 'রবিবার - বৃহস্পতিবার: ০১:০০ PM - ০৬:০০ PM',
          subjects: JSON.stringify(['Database Management Systems', 'Software Engineering']),
          isPrincipal: false,
          isHOD: false,
          isAdmin: false,
        }
      ];

      for (const t of initialTeachers) {
        await upsertTeacher(t);
      }
    }

    const existingStudents = await getAllStudents();
    if (existingStudents.length === 0) {
      const initialStudent = {
        id: 'std-demo-1',
        userId: 'u-std-demo',
        name: 'তানভীর আহমেদ',
        email: 'student@campus.edu',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&fit=crop&q=80',
        rollNumber: 'CST-2026-01',
        registrationNumber: 'REG-2026-8842',
        department: 'কম্পিউটার সাইন্স এণ্ড টেকনোলজি',
        semester: '৪র্থ সেমিস্টার',
        section: 'A',
        session: '2024-2025',
        cgpa: '3.85',
        phone: '+880 1819-112233',
        address: 'কলেজ হোস্টেল, কক্ষ ২০২',
        guardianName: 'মোঃ রফিক আহমেদ',
        guardianPhone: '+880 1811-998877',
        bloodGroup: 'B+',
        attendancePercentage: '94%',
        pendingFees: 0,
      };
      await upsertStudent(initialStudent);
    }

    console.log('Cloud SQL Database initialization checked and ready.');
  } catch (err) {
    console.error('Error during auto-seed:', err);
  }
}

async function startServer() {
  await seedDatabaseIfEmpty();

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('dist'));
    app.get('*', (req, res) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
