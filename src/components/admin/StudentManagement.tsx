import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StudentProfile } from '../../types';
import { UserAvatar } from '../common/UserAvatar';
import {
  GraduationCap,
  Search,
  Plus,
  Trash2,
  Edit,
  Eye,
  Filter,
  X,
  QrCode,
  Award,
  BookOpen
} from 'lucide-react';

export const StudentManagement: React.FC = () => {
  const { students, addStudent, updateStudent, deleteStudent, setIsQRModalOpen, language } = useApp();
  const isBN = language === 'BN';

  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentProfile | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<StudentProfile | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rollNumber: '',
    registrationNumber: '',
    department: 'Computer Science & Engineering',
    semester: 'Semester 1',
    section: 'A',
    session: '2026 - 2030',
    cgpa: 3.5,
    phone: '',
    address: '',
    guardianName: '',
    guardianPhone: '',
    bloodGroup: 'O+',
    attendancePercentage: 90
  });

  const filteredStudents = students.filter(s => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(search.toLowerCase()) ||
      s.department.toLowerCase().includes(search.toLowerCase());
    const matchesDept = deptFilter === 'ALL' || s.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  const handleOpenAddModal = () => {
    setEditingStudent(null);
    setFormData({
      name: '',
      email: '',
      rollNumber: `CSE-2026-${Math.floor(100 + Math.random() * 900)}`,
      registrationNumber: `REG-${Math.floor(100000 + Math.random() * 900000)}`,
      department: 'Computer Science & Engineering',
      semester: 'Semester 1',
      section: 'A',
      session: '2026 - 2030',
      cgpa: 3.8,
      phone: '+1 (555) 019-921',
      address: 'North Residence Hall',
      guardianName: 'Guardian Name',
      guardianPhone: '+1 (555) 998-112',
      bloodGroup: 'O+',
      attendancePercentage: 95
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (st: StudentProfile) => {
    setEditingStudent(st);
    setFormData({
      name: st.name,
      email: st.email,
      rollNumber: st.rollNumber,
      registrationNumber: st.registrationNumber,
      department: st.department,
      semester: st.semester,
      section: st.section,
      session: st.session,
      cgpa: st.cgpa,
      phone: st.phone,
      address: st.address,
      guardianName: st.guardianName,
      guardianPhone: st.guardianPhone,
      bloodGroup: st.bloodGroup,
      attendancePercentage: st.attendancePercentage
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStudent) {
      updateStudent({
        ...editingStudent,
        ...formData
      });
    } else {
      addStudent({
        ...formData,
        userId: `u-${Date.now()}`,
        avatar: ''
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
            {isBN ? 'শিক্ষার্থী ব্যবস্থাপনা ডিরেক্টরি' : 'Student Management Directory'}
          </h1>
          <p className="text-xs text-slate-500">
            {isBN 
              ? 'শিক্ষার্থী তালিকা, নতুন ভর্তি, একাডেমিক প্রোফাইল ও ক্লাসের উপস্থিতি পর্যবেক্ষণ।'
              : 'View, enroll, edit academic profiles, and monitor attendance ratios.'}
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          {isBN ? 'নতুন শিক্ষার্থী ভর্তি করুন' : 'Enroll New Student'}
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={isBN ? "শিক্ষার্থীর নাম, রোল নম্বর বা আইডি দিয়ে খুঁজুন..." : "Search student by name, roll number, or ID..."}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-xs font-medium text-slate-800 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <select
            value={deptFilter}
            onChange={e => setDeptFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs font-medium text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="ALL">{isBN ? 'সকল ডিপার্টমেন্ট' : 'All Departments'}</option>
            <option value="Computer Science & Engineering">{isBN ? 'কম্পিউটার সায়েন্স (CSE)' : 'Computer Science (CSE)'}</option>
            <option value="Electrical & Electronic Engineering">{isBN ? 'ইলেকট্রিক্যাল ইঞ্জিনিয়ারিং (EEE)' : 'Electrical Eng. (EEE)'}</option>
            <option value="Business Administration">{isBN ? 'বিজনেস অ্যাডমিনিস্ট্রেশন (BBA)' : 'Business (BBA)'}</option>
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-800/60">
              <tr>
                <th className="p-4 font-semibold">{isBN ? 'শিক্ষার্থীর নাম ও রোল' : 'Student Name & Roll'}</th>
                <th className="p-4 font-semibold">{isBN ? 'ডিপার্টমেন্ট ও সেমিস্টার' : 'Department & Semester'}</th>
                <th className="p-4 font-semibold">{isBN ? 'সিজিপিএ (CGPA)' : 'CGPA'}</th>
                <th className="p-4 font-semibold">{isBN ? 'উপস্থিতি' : 'Attendance'}</th>
                <th className="p-4 font-semibold">{isBN ? 'যোগাযোগের তথ্য' : 'Contact Info'}</th>
                <th className="p-4 font-semibold text-right">{isBN ? 'পদক্ষেপ' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredStudents.map(st => (
                <tr key={st.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <UserAvatar
                        src={st.avatar}
                        name={st.name}
                        size="sm"
                      />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{st.name}</div>
                        <div className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400">
                          {st.rollNumber}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-slate-800 dark:text-slate-200">{st.department}</div>
                    <div className="text-[10px] text-slate-400">{st.semester} • Sec {st.section}</div>
                  </td>
                  <td className="p-4 font-bold text-slate-900 dark:text-white">
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {st.cgpa.toFixed(2)}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">
                      {st.attendancePercentage}%
                    </div>
                    <div className="h-1.5 w-20 rounded-full bg-slate-200 dark:bg-slate-700 mt-1">
                      <div
                        className="h-full rounded-full bg-indigo-600"
                        style={{ width: `${st.attendancePercentage}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="p-4 text-slate-500 font-mono text-[11px]">
                    <div>{st.email}</div>
                    <div>{st.phone}</div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedStudent(st)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-800"
                        title="View Full Profile"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEditModal(st)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-emerald-600 dark:hover:bg-slate-800"
                        title="Edit Student"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setStudentToDelete(st)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-slate-800"
                        title="Delete Record"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    <GraduationCap className="h-10 w-10 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                    <p className="font-medium text-slate-700 dark:text-slate-200">
                      {isBN ? 'কোনো শিক্ষার্থী পাওয়া যায়নি' : 'No students found'}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {isBN 
                        ? 'নতুন শিক্ষার্থী যোগ করতে উপরের "নতুন শিক্ষার্থী ভর্তি করুন" বাটনে ক্লিক করুন।' 
                        : 'Click "Enroll New Student" above to add new student records.'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student View Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setSelectedStudent(null)}
              className="absolute right-4 top-4 rounded-full bg-slate-100 p-1.5 text-slate-400 hover:bg-slate-200 dark:bg-slate-800"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-4 border-b border-slate-100 pb-4 dark:border-slate-800">
              <UserAvatar
                src={selectedStudent.avatar}
                name={selectedStudent.name}
                size="xl"
              />
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {selectedStudent.name}
                </h3>
                <div className="text-xs font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                  {selectedStudent.rollNumber}
                </div>
                <div className="text-[11px] text-slate-400">{selectedStudent.department}</div>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-100 py-1.5 dark:border-slate-800">
                <span className="text-slate-400">Registration Number</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {selectedStudent.registrationNumber}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-100 py-1.5 dark:border-slate-800">
                <span className="text-slate-400">Semester & Section</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {selectedStudent.semester} ({selectedStudent.section})
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-100 py-1.5 dark:border-slate-800">
                <span className="text-slate-400">Academic Session</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {selectedStudent.session}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-100 py-1.5 dark:border-slate-800">
                <span className="text-slate-400">Guardian Contact</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {selectedStudent.guardianName} ({selectedStudent.guardianPhone})
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-100 py-1.5 dark:border-slate-800">
                <span className="text-slate-400">Blood Group & Address</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {selectedStudent.bloodGroup} • {selectedStudent.address}
                </span>
              </div>
            </div>

            <div className="mt-5 flex gap-2">
              <button
                onClick={() => {
                  setSelectedStudent(null);
                  setIsQRModalOpen(true);
                }}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2 text-xs font-semibold text-white shadow-md hover:bg-indigo-700"
              >
                <QrCode className="h-4 w-4" /> View Digital ID
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Student Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 rounded-full bg-slate-100 p-1.5 text-slate-400 hover:bg-slate-200 dark:bg-slate-800"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {editingStudent ? 'Edit Student Record' : 'Enroll New Student'}
            </h3>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Roll Number</label>
                  <input
                    type="text"
                    required
                    value={formData.rollNumber}
                    onChange={e => setFormData({ ...formData, rollNumber: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Department</label>
                  <select
                    value={formData.department}
                    onChange={e => setFormData({ ...formData, department: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                    <option value="Electrical & Electronic Engineering">Electrical & Electronic Engineering</option>
                    <option value="Business Administration">Business Administration</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Semester</label>
                  <select
                    value={formData.semester}
                    onChange={e => setFormData({ ...formData, semester: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="Semester 1">Semester 1</option>
                    <option value="Semester 3">Semester 3</option>
                    <option value="Semester 5">Semester 5</option>
                    <option value="Semester 7">Semester 7</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Guardian Name</label>
                  <input
                    type="text"
                    value={formData.guardianName}
                    onChange={e => setFormData({ ...formData, guardianName: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="mt-4 flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/2 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 rounded-xl bg-indigo-600 py-2.5 text-xs font-semibold text-white hover:bg-indigo-700"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete Student Confirmation Dialog */}
      {studentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-rose-200/80 bg-white p-6 shadow-2xl dark:border-rose-900/50 dark:bg-slate-900">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 mb-4">
              <Trash2 className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              শিক্ষার্থী রেকর্ড মুছে ফেলতে চান?
            </h3>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              আপনি কি নিশ্চিত যে শিক্ষার্থী <strong>"{studentToDelete.name}"</strong> (রোল: {studentToDelete.rollNumber}) এর প্রোফাইল ও লগইন ডাটাবেজ থেকে মুছে ফেলতে চান?
            </p>
            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setStudentToDelete(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                বাতিল করুন
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteStudent(studentToDelete.id);
                  setStudentToDelete(null);
                }}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700 shadow-md shadow-rose-600/20"
              >
                হ্যাঁ, ডাটাবেজ থেকে মুছুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
