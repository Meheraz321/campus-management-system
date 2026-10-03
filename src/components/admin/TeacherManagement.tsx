import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TeacherProfile } from '../../types';
import { UserAvatar } from '../common/UserAvatar';
import {
  Users,
  Plus,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Award,
  BookOpen,
  X,
  Search,
  Download,
  ShieldCheck,
  Building,
  Clock,
  Eye,
  CheckCircle2,
  Sparkles,
  GraduationCap,
  Layers,
  FileSpreadsheet
} from 'lucide-react';
import { exportTeachersExcel } from '../../utils/exportUtils';

const DEPARTMENTS_LIST = [
  'প্রশাসন (Administration)',
  'কম্পিউটার সাইন্স এণ্ড টেকনোলজি',
  'কম্পিউটার সাইন্স এণ্ড টেকনোলজি (১ম শিফট)',
  'কম্পিউটার সাইন্স এণ্ড টেকনোলজি (২য় শিফট)',
  'ইলেকট্রিক্যাল টেকনোলজি',
  'ইলেকট্রিক্যাল টেকনোলজি (১ম শিফট)',
  'ইলেকট্রিক্যাল টেকনোলজি (২য় শিফট)',
  'ইলেকট্রনিক্স টেকনোলজি',
  'ইলেকট্রনিক্স টেকনোলজি (১ম শিফট)',
  'ইলেকট্রনিক্স টেকনোলজি (২য় শিফট)',
  'টেলিকমিউনিকেশন টেকনোলজি',
  'টেলিকমিউনিকেশন টেকনোলজি (১ম শিফট)',
  'টেলিকমিউনিকেশন টেকনোলজি (২য় শিফট)',
  'নন-টেক',
  'নন-টেক (১ম শিফট)',
  'নন-টেক (২য় শিফট)'
];

const FACULTY_LIST = [
  'প্রশাসন',
  'কম্পিউটার সাইন্স এণ্ড টেকনোলজি',
  'ইলেকট্রিক্যাল টেকনোলজি',
  'ইলেকট্রনিক্স টেকনোলজি',
  'টেলিকমিউনিকেশন টেকনোলজি',
  'নন-টেক'
];

const DESIGNATION_PRESETS = [
  'উপাধ্যক্ষ ও অধ্যক্ষ (অ.দা.)',
  'অধ্যক্ষ / Principal',
  'উপাধ্যক্ষ / Vice Principal',
  'চিফ ইনস্ট্রাক্টর ও বিভাগীয় প্রধান',
  'চিফ ইনস্ট্রাক্টর (নন-টেক) ও বিভাগীয় প্রধান',
  'চিফ ইনস্ট্রাক্টর ও একাডেমিক ইনচার্জ',
  'ইনস্ট্রাক্টর (টেক/কম্পিউটার)',
  'ইনস্ট্রাক্টর (টেক/ইলেকট্রিক্যাল)',
  'ইনস্ট্রাক্টর (টেক/ইলেকট্রনিক্স)',
  'ইনস্ট্রাক্টর (টেক/টেলিকমিউনিকেশন)',
  'ইনস্ট্রাক্টর (নন-টেক/ইংরেজি)',
  'ইনস্ট্রাক্টর (নন-টেক/গণিত)',
  'ইনস্ট্রাক্টর (নন-টেক/পদার্থ)',
  'ইনস্ট্রাক্টর (নন-টেক/রসায়ন)',
  'জুনিয়র ইনস্ট্রাক্টর (টেক/কম্পিউটার)',
  'জুনিয়র ইনস্ট্রাক্টর (টেক/ইলেকট্রিক্যাল)',
  'জুনিয়র ইনস্ট্রাক্টর (টেক/ইলেকট্রনিক্স)',
  'জুনিয়র ইনস্ট্রাক্টর (টেক/টেলিকমিউনিকেশন)',
  'জুনিয়র ইনস্ট্রাক্টর (নন-টেক), ইংরেজি',
  'জুনিয়র ইনস্ট্রাক্টর (নন-টেক), গণিত',
  'জুনিয়র ইনস্ট্রাক্টর (নন-টেক), পদার্থ বিজ্ঞান',
  'জুনিয়র ইনস্ট্রাক্টর (নন-টেক), রসায়ন',
  'জুনিয়র ইনস্ট্রাক্টর (নন-টেক/ম্যানেজমেন্ট)',
  'জুনিয়র ইনস্ট্রাক্টর (নন-টেক), হিসাব বিজ্ঞান',
  'ওয়ার্কশপ সুপার / ল্যাব ইনচার্জ',
  'ক্রাফট ইনস্ট্রাক্টর (টেক/ল্যাব)'
];

export const TeacherManagement: React.FC = () => {
  const { teachers, registeredUsers, addTeacher, updateTeacher, deleteTeacher, language } = useApp();
  const isBN = language === 'BN';

  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('ALL');
  const [filterRole, setFilterRole] = useState<'ALL' | 'PRINCIPAL' | 'HOD' | 'TECH' | 'NONTECH'>('ALL');
  const [filterShift, setFilterShift] = useState('ALL');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingTeacher, setViewingTeacher] = useState<TeacherProfile | null>(null);
  const [editingTeacher, setEditingTeacher] = useState<TeacherProfile | null>(null);
  const [teacherToDelete, setTeacherToDelete] = useState<TeacherProfile | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    designation: 'জুনিয়র ইনস্ট্রাক্টর (টেক/কম্পিউটার)',
    faculty: 'কম্পিউটার সাইন্স এণ্ড টেকনোলজি',
    department: 'কম্পিউটার সাইন্স এণ্ড টেকনোলজি (১ম শিফট)',
    shift: '১ম শিফট',
    bcsBatch: '',
    mobilePhone: '',
    officePhone: '',
    phone: '',
    officeRoom: 'কক্ষ নং ২০৪ (একাডেমিক ভবন)',
    qualification: 'B.Sc. in Computer Science & Engineering',
    experienceYears: 6,
    biography: 'কারিগরি শিক্ষাদানে নিবেদিত প্রাণ শিক্ষক। শিক্ষার্থীদের ব্যবহারিক ও প্রজেক্ট-ভিত্তিক জ্ঞান অর্জনে সর্বদা সচেষ্ট।',
    officeHours: 'রবিবার - বৃহস্পতিবার: ০৯:০০ AM - ০৩:০০ PM',
    subjectsStr: 'Programming in C, Python, Database Management',
    avatar: '',
    isPrincipal: false,
    isHOD: false
  });

  const handleOpenAddModal = (
    presetRole: 'TECH' | 'TEACHER' | 'HOD' | 'PRINCIPAL' | 'NONTECH' = 'TECH'
  ) => {
    setEditingTeacher(null);
    if (presetRole === 'PRINCIPAL') {
      setFormData({
        name: '',
        email: '',
        designation: 'উপাধ্যক্ষ ও অধ্যক্ষ (অ.দা.)',
        faculty: 'প্রশাসন',
        department: 'প্রশাসন (Administration)',
        shift: 'সাধারণ',
        bcsBatch: '৩৮',
        mobilePhone: '',
        officePhone: '',
        phone: '',
        officeRoom: 'অধ্যক্ষ কার্যালয় (প্রশাসন ভবন)',
        qualification: 'প্রকৌশলী (B.Sc. in Engineering), বিসিএস (কারিগরি শিক্ষা)',
        experienceYears: 20,
        biography: 'ইনস্টিটিউটের সার্বিক অ্যাকাডেমিক ও প্রশাসনিক তত্ত্বাবধায়ক।',
        officeHours: 'রবিবার - বৃহস্পতিবার: ০৯:০০ AM - ০৫:০০ PM',
        subjectsStr: 'প্রশাসনিক নেতৃত্ব ও নীতি নির্ধারণ',
        avatar: '',
        isPrincipal: true,
        isHOD: false
      });
    } else if (presetRole === 'HOD') {
      setFormData({
        name: '',
        email: '',
        designation: 'চিফ ইনস্ট্রাক্টর ও বিভাগীয় প্রধান',
        faculty: 'কম্পিউটার সাইন্স এণ্ড টেকনোলজি',
        department: 'কম্পিউটার সাইন্স এণ্ড টেকনোলজি (১ম শিফট)',
        shift: '১ম শিফট',
        bcsBatch: '',
        mobilePhone: '',
        officePhone: '',
        phone: '',
        officeRoom: 'বিভাগীয় প্রধানের কার্যালয়, কম্পিউটার বিভাগ',
        qualification: 'M.Sc. / B.Sc. in Computer Science & Engineering',
        experienceYears: 14,
        biography: 'বিভাগীয় শিক্ষা কার্যক্রম, ল্যাব ও ক্লাস রুটিনের তত্ত্বাবধায়ক।',
        officeHours: 'রবিবার - বৃহস্পতিবার: ০৯:০০ AM - ০৪:০০ PM',
        subjectsStr: 'Microprocessor & Interfacing, Software Engineering',
        avatar: '',
        isPrincipal: false,
        isHOD: true
      });
    } else if (presetRole === 'NONTECH') {
      setFormData({
        name: '',
        email: '',
        designation: 'জুনিয়র ইনস্ট্রাক্টর (নন-টেক), ইংরেজি',
        faculty: 'নন-টেক',
        department: 'নন-টেক (১ম শিফট)',
        shift: '১ম শিফট',
        bcsBatch: '',
        mobilePhone: '',
        officePhone: '',
        phone: '',
        officeRoom: 'নন-টেক অনুষদ কক্ষ',
        qualification: 'B.A. (Honours), M.A. in English',
        experienceYears: 5,
        biography: 'নন-টেক বিষয়ের পাঠদান ও শিক্ষার্থীদের যোগাযোগ দক্ষতা বৃদ্ধি।',
        officeHours: 'রবিবার - বৃহস্পতিবার: ০৯:০০ AM - ০৩:০০ PM',
        subjectsStr: 'Communicative English, Technical English',
        avatar: '',
        isPrincipal: false,
        isHOD: false
      });
    } else {
      // TECH / TEACHER
      setFormData({
        name: '',
        email: '',
        designation: 'জুনিয়র ইনস্ট্রাক্টর (টেক/কম্পিউটার)',
        faculty: 'কম্পিউটার সাইন্স এণ্ড টেকনোলজি',
        department: 'কম্পিউটার সাইন্স এণ্ড টেকনোলজি (১ম শিফট)',
        shift: '১ম শিফট',
        bcsBatch: '',
        mobilePhone: '',
        officePhone: '',
        phone: '',
        officeRoom: 'কক্ষ নং ২০৪ (একাডেমিক ভবন)',
        qualification: 'B.Sc. in Computer Science & Engineering',
        experienceYears: 4,
        biography: 'ব্যবহারিক ও প্রজেক্ট-ভিত্তিক কারিগরি শিক্ষাদানে নিবেদিত প্রাণ শিক্ষক।',
        officeHours: 'রবিবার - বৃহস্পতিবার: ০৯:০০ AM - ০৩:০০ PM',
        subjectsStr: 'Programming in C, Python, Web Development',
        avatar: '',
        isPrincipal: false,
        isHOD: false
      });
    }
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (t: TeacherProfile) => {
    setEditingTeacher(t);
    const linkedUser = registeredUsers.find(
      u => u.teacherId === t.id || (u.email && u.email.toLowerCase() === t.email.toLowerCase())
    );
    setFormData({
      name: t.name,
      email: t.email,
      password: linkedUser?.password || '',
      designation: t.designation,
      faculty: t.faculty || 'কম্পিউটার সাইন্স এণ্ড টেকনোলজি',
      department: t.department,
      shift: t.shift || '',
      bcsBatch: t.bcsBatch || '',
      mobilePhone: t.mobilePhone || t.phone || '',
      officePhone: t.officePhone || '',
      phone: t.phone || t.mobilePhone || '',
      officeRoom: t.officeRoom || '',
      qualification: t.qualification || '',
      experienceYears: t.experienceYears || 0,
      biography: t.biography || '',
      officeHours: t.officeHours || '',
      subjectsStr: (t.subjects || []).join(', '),
      avatar: t.avatar || '',
      isPrincipal: Boolean(t.isPrincipal),
      isHOD: Boolean(t.isHOD)
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subjects = formData.subjectsStr
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const mobile = formData.mobilePhone || formData.phone;

    const teacherPayload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      designation: formData.designation.trim(),
      faculty: formData.faculty.trim(),
      department: formData.department.trim(),
      shift: formData.shift.trim(),
      bcsBatch: formData.bcsBatch.trim(),
      mobilePhone: mobile,
      phone: mobile,
      officePhone: formData.officePhone.trim(),
      officeRoom: formData.officeRoom.trim(),
      qualification: formData.qualification.trim(),
      experienceYears: Number(formData.experienceYears) || 0,
      biography: formData.biography.trim(),
      officeHours: formData.officeHours.trim(),
      avatar: formData.avatar,
      subjects: subjects.length > 0 ? subjects : ['সাধারণ একাডেমিক কার্যক্রম'],
      isPrincipal: formData.isPrincipal,
      isHOD: formData.isHOD,
      password: formData.password.trim() || 'teacher123'
    };

    if (editingTeacher) {
      updateTeacher({
        ...editingTeacher,
        ...teacherPayload
      });
    } else {
      addTeacher({
        ...teacherPayload,
        userId: `u-tch-${Date.now()}`
      });
    }

    setIsModalOpen(false);
  };

  // Filtered Faculty List
  const filteredTeachers = teachers.filter(t => {
    // Search query
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      t.name.toLowerCase().includes(q) ||
      t.email.toLowerCase().includes(q) ||
      (t.phone && t.phone.includes(q)) ||
      (t.mobilePhone && t.mobilePhone.includes(q)) ||
      (t.designation && t.designation.toLowerCase().includes(q)) ||
      (t.department && t.department.toLowerCase().includes(q)) ||
      (t.bcsBatch && t.bcsBatch.includes(q)) ||
      (t.subjects && t.subjects.some(s => s.toLowerCase().includes(q)));

    // Department Filter
    const matchesDept =
      filterDepartment === 'ALL' ||
      t.department === filterDepartment ||
      t.department.includes(filterDepartment) ||
      (t.faculty && t.faculty.includes(filterDepartment));

    // Role Filter
    const matchesRole =
      filterRole === 'ALL' ||
      (filterRole === 'PRINCIPAL' && t.isPrincipal) ||
      (filterRole === 'HOD' && t.isHOD && !t.isPrincipal) ||
      (filterRole === 'NONTECH' && (t.department.includes('নন-টেক') || (t.faculty && t.faculty.includes('নন-টেক')) || t.designation.includes('নন-টেক'))) ||
      (filterRole === 'TECH' && !t.isPrincipal && !t.isHOD && !t.department.includes('নন-টেক') && (!t.faculty || !t.faculty.includes('নন-টেক')) && !t.designation.includes('নন-টেক'));

    // Shift Filter
    const matchesShift =
      filterShift === 'ALL' ||
      (t.shift && t.shift.includes(filterShift)) ||
      (t.department && t.department.includes(filterShift));

    return matchesSearch && matchesDept && matchesRole && matchesShift;
  });

  // Summary Metrics
  const totalCount = teachers.length;
  const principalCount = teachers.filter(t => t.isPrincipal).length;
  const hodCount = teachers.filter(t => t.isHOD && !t.isPrincipal).length;
  const nonTechCount = teachers.filter(t => t.department.includes('নন-টেক') || (t.faculty && t.faculty.includes('নন-টেক')) || t.designation.includes('নন-টেক')).length;
  const techCount = teachers.filter(t => !t.isPrincipal && !t.isHOD && !(t.department.includes('নন-টেক') || (t.faculty && t.faculty.includes('নন-টেক')) || t.designation.includes('নন-টেক'))).length;

  return (
    <div className="space-y-6">
      {/* Header & Actions Bar */}
      <div className="flex flex-col justify-between gap-4 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 text-white shadow-xl lg:flex-row lg:items-center">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
            <Sparkles className="h-4 w-4" />
            {isBN ? 'অনুষদ ও শিক্ষক ডিরেক্টরি কন্ট্রোল' : 'Faculty Management & Directory Control'}
          </div>
          <h1 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">
            {isBN ? 'শিক্ষক ও কর্মকর্তা ব্যবস্থাপনা' : 'Faculty & Staff Management'}
          </h1>
          <p className="mt-1 text-xs text-slate-300">
            {isBN 
              ? 'অধ্যক্ষ, বিভাগীয় প্রধান (HOD), টেকনিক্যাল (TECH) ও নন-টেক শিক্ষকগণের তথ্য সংযোজন, এডিট এবং ছবি আপডেট করুন।'
              : 'Add, update profile details, upload pictures, and manage Principal, HOD, and faculty rosters.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => exportTeachersExcel(teachers)}
            className="flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2.5 text-xs font-bold text-white backdrop-blur-md transition-all hover:bg-white/20"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
            {isBN ? 'এক্সেল এক্সপোর্ট' : 'Excel Export'}
          </button>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => handleOpenAddModal('PRINCIPAL')}
              className="flex items-center gap-1.5 rounded-2xl bg-amber-500/20 border border-amber-400/30 px-3.5 py-2.5 text-xs font-bold text-amber-300 transition-all hover:bg-amber-500/30"
              title={isBN ? "নতুন অধ্যক্ষ / উপাধ্যক্ষ যোগ করুন" : "Add Principal / VP"}
            >
              <ShieldCheck className="h-4 w-4 text-amber-400" />
              {isBN ? '+ অধ্যক্ষ যোগ' : '+ Principal'}
            </button>

            <button
              onClick={() => handleOpenAddModal('HOD')}
              className="flex items-center gap-1.5 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 px-3.5 py-2.5 text-xs font-bold text-indigo-300 transition-all hover:bg-indigo-500/30"
              title={isBN ? "নতুন বিভাগীয় প্রধান যোগ করুন" : "Add Head of Department"}
            >
              <Building className="h-4 w-4 text-indigo-400" />
              {isBN ? '+ HOD যোগ' : '+ HOD'}
            </button>

            <button
              onClick={() => handleOpenAddModal('NONTECH')}
              className="flex items-center gap-1.5 rounded-2xl bg-purple-500/20 border border-purple-400/30 px-3.5 py-2.5 text-xs font-bold text-purple-300 transition-all hover:bg-purple-500/30"
              title={isBN ? "নতুন নন-টেক শিক্ষক যোগ করুন" : "Add Non-Tech Faculty"}
            >
              <BookOpen className="h-4 w-4 text-purple-400" />
              {isBN ? '+ নন-টেক শিক্ষক' : '+ Non-Tech'}
            </button>

            <button
              onClick={() => handleOpenAddModal('TECH')}
              className="flex items-center gap-1.5 rounded-2xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/30 transition-all hover:bg-emerald-600"
              title={isBN ? "নতুন টেক শিক্ষক (TECH- Teacher) যোগ করুন" : "Add Tech Faculty"}
            >
              <Plus className="h-4 w-4" />
              {isBN ? '+ TECH- Teacher' : '+ Tech Faculty'}
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>{isBN ? 'মোট অনুষদ' : 'Total Faculty'}</span>
            <Users className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            {totalCount} {isBN ? 'জন' : ''}
          </div>
        </div>

        <div className="rounded-2xl border border-amber-200/60 bg-amber-50/50 p-4 shadow-sm dark:border-amber-900/40 dark:bg-amber-950/20">
          <div className="flex items-center justify-between text-xs font-medium text-amber-700 dark:text-amber-400">
            <span>{isBN ? 'অধ্যক্ষ ও প্রশাসন' : 'Principal & Admin'}</span>
            <ShieldCheck className="h-4 w-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-amber-900 dark:text-amber-300">
            {principalCount} {isBN ? 'জন' : ''}
          </div>
        </div>

        <div className="rounded-2xl border border-indigo-200/60 bg-indigo-50/50 p-4 shadow-sm dark:border-indigo-900/40 dark:bg-indigo-950/20">
          <div className="flex items-center justify-between text-xs font-medium text-indigo-700 dark:text-indigo-400">
            <span>{isBN ? 'বিভাগীয় প্রধান (HOD)' : 'Department Heads'}</span>
            <Building className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-indigo-900 dark:text-indigo-300">
            {hodCount} {isBN ? 'জন' : ''}
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-200/60 bg-emerald-50/50 p-4 shadow-sm dark:border-emerald-900/40 dark:bg-emerald-950/20">
          <div className="flex items-center justify-between text-xs font-medium text-emerald-700 dark:text-emerald-400">
            <span>{isBN ? 'টেক শিক্ষক (TECH)' : 'Technical Faculty'}</span>
            <Layers className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-900 dark:text-emerald-300">
            {techCount} {isBN ? 'জন' : ''}
          </div>
        </div>

        <div className="rounded-2xl border border-purple-200/60 bg-purple-50/50 p-4 shadow-sm dark:border-purple-900/40 dark:bg-purple-950/20">
          <div className="flex items-center justify-between text-xs font-medium text-purple-700 dark:text-purple-400">
            <span>{isBN ? 'নন-টেক অনুষদ' : 'Non-Tech Faculty'}</span>
            <BookOpen className="h-4 w-4 text-purple-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-purple-900 dark:text-purple-300">
            {nonTechCount} {isBN ? 'জন' : ''}
          </div>
        </div>
      </div>

      {/* Role Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'ALL', label: `সকল শিক্ষক ও কর্মকর্তা (${totalCount})`, icon: Users },
          { id: 'PRINCIPAL', label: `অধ্যক্ষ ও উপাধ্যক্ষ (${principalCount})`, icon: ShieldCheck },
          { id: 'HOD', label: `বিভাগীয় প্রধান (${hodCount})`, icon: Building },
          { id: 'TECH', label: `টেক শিক্ষক / TECH (${techCount})`, icon: Layers },
          { id: 'NONTECH', label: `নন-টেক অনুষদ (${nonTechCount})`, icon: BookOpen }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setFilterRole(tab.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                filterRole === tab.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="নাম, ইমেইল, মোবাইল, বিসিএস ব্যাচ বা বিষয় দিয়ে খুঁজুন..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-xs font-medium outline-none transition-all focus:border-indigo-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800/60 dark:text-white"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Department Filter */}
          <select
            value={filterDepartment}
            onChange={e => setFilterDepartment(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs font-semibold text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="ALL">সকল বিভাগ ও অনুষদ</option>
            <option value="প্রশাসন">প্রশাসন</option>
            <option value="কম্পিউটার">কম্পিউটার সাইন্স</option>
            <option value="ইলেকট্রিক্যাল">ইলেকট্রিক্যাল</option>
            <option value="ইলেকট্রনিক্স">ইলেকট্রনিক্স</option>
            <option value="টেলিকমিউনিকেশন">টেলিকমিউনিকেশন</option>
            <option value="নন-টেক">নন-টেক</option>
          </select>

          {/* Shift Filter */}
          <select
            value={filterShift}
            onChange={e => setFilterShift(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs font-semibold text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="ALL">সকল শিফট</option>
            <option value="১ম শিফট">১ম শিফট</option>
            <option value="২য় শিফট">২য় শিফট</option>
          </select>
        </div>
      </div>

      {/* Faculty Cards Grid */}
      {filteredTeachers.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
          <Users className="h-12 w-12 text-slate-300" />
          <h3 className="mt-3 text-base font-bold text-slate-700 dark:text-slate-200">
            কোন শিক্ষকের তথ্য পাওয়া যায়নি
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            অনুসন্ধান শর্ত পরিবর্তন করুন অথবা নতুন শিক্ষকের বিবরণ যুক্ত করুন।
          </p>
          <button
            onClick={() => handleOpenAddModal('TEACHER')}
            className="mt-4 flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4" /> নতুন শিক্ষক যোগ করুন
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTeachers.map(t => {
            const isPrincipal = Boolean(t.isPrincipal);
            const isHOD = Boolean(t.isHOD && !isPrincipal);
            const isNonTech = Boolean(t.department.includes('নন-টেক') || (t.faculty && t.faculty.includes('নন-টেক')) || t.designation.includes('নন-টেক'));

            return (
              <div
                key={t.id}
                className={`group relative flex flex-col justify-between rounded-3xl border p-5 shadow-sm transition-all hover:shadow-md ${
                  isPrincipal
                    ? 'border-amber-300/80 bg-gradient-to-b from-amber-50/40 to-white dark:border-amber-800/60 dark:from-amber-950/20 dark:to-slate-900'
                    : isHOD
                    ? 'border-indigo-200/80 bg-gradient-to-b from-indigo-50/30 to-white dark:border-indigo-800/50 dark:from-indigo-950/20 dark:to-slate-900'
                    : isNonTech
                    ? 'border-purple-200/80 bg-gradient-to-b from-purple-50/30 to-white dark:border-purple-800/50 dark:from-purple-950/20 dark:to-slate-900'
                    : 'border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900'
                }`}
              >
                <div>
                  {/* Top Badges */}
                  <div className="mb-3 flex flex-wrap items-center gap-1.5">
                    {isPrincipal && (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
                        <ShieldCheck className="h-3 w-3 text-amber-500" />
                        অধ্যক্ষ / প্রশাসন
                      </span>
                    )}
                    {isHOD && (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-indigo-500/10 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
                        <Building className="h-3 w-3 text-indigo-500" />
                        বিভাগীয় প্রধান (HOD)
                      </span>
                    )}
                    {isNonTech && !isPrincipal && !isHOD && (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-purple-500/10 px-2 py-0.5 text-[10px] font-bold text-purple-700 dark:bg-purple-500/20 dark:text-purple-300">
                        <BookOpen className="h-3 w-3 text-purple-500" />
                        নন-টেক অনুষদ
                      </span>
                    )}
                    {t.bcsBatch && (
                      <span className="inline-flex items-center gap-0.5 rounded-lg bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                        <Award className="h-3 w-3 text-emerald-500" />
                        {t.bcsBatch}তম বিসিএস
                      </span>
                    )}
                    {t.shift && (
                      <span className="inline-flex items-center gap-0.5 rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        <Clock className="h-3 w-3 text-slate-400" />
                        {t.shift}
                      </span>
                    )}
                  </div>

                  {/* Profile Header */}
                  <div className="flex items-start gap-3.5">
                    <UserAvatar
                      src={t.avatar}
                      name={t.name}
                      size="lg"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold text-slate-900 line-clamp-1 dark:text-white" title={t.name}>
                        {t.name}
                      </h3>
                      <div className="mt-0.5 text-[11px] font-semibold text-indigo-600 line-clamp-2 dark:text-indigo-400">
                        {t.designation}
                      </div>
                      <div className="mt-0.5 text-[10px] text-slate-400 line-clamp-1">
                        {t.department}
                      </div>
                    </div>
                  </div>

                  {/* Contact & Location Info */}
                  <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-3 text-xs dark:border-slate-800">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <Mail className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                      <span className="truncate text-[11px] font-mono">{t.email || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <Phone className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                      <span className="text-[11px] font-semibold">
                        {t.mobilePhone || t.phone || 'N/A'}
                        {t.officePhone ? ` (অফিস: ${t.officePhone})` : ''}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                      <span className="truncate text-[11px]">{t.officeRoom || 'অফিস কক্ষ নির্ধারিত নয়'}</span>
                    </div>
                  </div>

                  {/* Assigned Subjects */}
                  {t.subjects && t.subjects.length > 0 && (
                    <div className="mt-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        নিযুক্ত বিষয়সমূহ
                      </span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {t.subjects.slice(0, 3).map((sub, i) => (
                          <span
                            key={i}
                            className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                          >
                            {sub}
                          </span>
                        ))}
                        {t.subjects.length > 3 && (
                          <span className="rounded-md bg-indigo-50 px-1.5 py-0.5 text-[10px] font-bold text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                            +{t.subjects.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Footer Actions */}
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs dark:border-slate-800">
                  <span className="text-[10px] font-semibold text-slate-400">
                    {t.experienceYears ? `${t.experienceYears} বছরের অভিজ্ঞতা` : 'অভিজ্ঞতা আপডেট নয়'}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {/* View Full Profile */}
                    <button
                      onClick={() => setViewingTeacher(t)}
                      className="flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                      title="বিস্তারিত দেখুন"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      দেখুন
                    </button>

                    {/* Edit Profile */}
                    <button
                      onClick={() => handleOpenEditModal(t)}
                      className="flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 transition-colors hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-900/50"
                      title="সম্পাদনা করুন"
                    >
                      <Edit className="h-3.5 w-3.5" />
                      এডিট
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => setTeacherToDelete(t)}
                      className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
                      title="মুছে ফেলুন"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View Teacher Details Modal */}
      {viewingTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <button
              onClick={() => setViewingTeacher(null)}
              className="absolute right-4 top-4 rounded-full bg-slate-100 p-1.5 text-slate-400 hover:bg-slate-200 dark:bg-slate-800"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Profile Header in Modal */}
            <div className="flex items-start gap-4">
              <UserAvatar
                src={viewingTeacher.avatar}
                name={viewingTeacher.name}
                size="xl"
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap gap-1 mb-1">
                  {viewingTeacher.isPrincipal && (
                    <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                      অধ্যক্ষ / উপাধ্যক্ষ
                    </span>
                  )}
                  {viewingTeacher.isHOD && !viewingTeacher.isPrincipal && (
                    <span className="rounded bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300">
                      বিভাগীয় প্রধান (HOD)
                    </span>
                  )}
                  {viewingTeacher.bcsBatch && (
                    <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                      {viewingTeacher.bcsBatch}তম বিসিএস
                    </span>
                  )}
                </div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  {viewingTeacher.name}
                </h2>
                <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  {viewingTeacher.designation}
                </p>
                <p className="text-[11px] text-slate-400">{viewingTeacher.department}</p>
              </div>
            </div>

            {/* Details Grid */}
            <div className="mt-5 space-y-3 text-xs">
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                  <div className="flex items-center gap-1.5 font-bold text-slate-500">
                    <Mail className="h-3.5 w-3.5 text-indigo-500" /> ইমেইল ঠিকানা
                  </div>
                  <div className="mt-1 font-mono font-semibold text-slate-900 dark:text-white">
                    {viewingTeacher.email || 'N/A'}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                  <div className="flex items-center gap-1.5 font-bold text-slate-500">
                    <Phone className="h-3.5 w-3.5 text-emerald-500" /> মোবাইল ও ফোন
                  </div>
                  <div className="mt-1 font-semibold text-slate-900 dark:text-white">
                    {viewingTeacher.mobilePhone || viewingTeacher.phone || 'N/A'}
                    {viewingTeacher.officePhone && ` (অফিস: ${viewingTeacher.officePhone})`}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                  <div className="flex items-center gap-1.5 font-bold text-slate-500">
                    <MapPin className="h-3.5 w-3.5 text-rose-500" /> অফিস চেম্বার / কক্ষ
                  </div>
                  <div className="mt-1 font-semibold text-slate-900 dark:text-white">
                    {viewingTeacher.officeRoom || 'N/A'}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                  <div className="flex items-center gap-1.5 font-bold text-slate-500">
                    <Clock className="h-3.5 w-3.5 text-amber-500" /> সাক্ষাতের সময় (Office Hours)
                  </div>
                  <div className="mt-1 font-semibold text-slate-900 dark:text-white">
                    {viewingTeacher.officeHours || 'N/A'}
                  </div>
                </div>
              </div>

              {viewingTeacher.qualification && (
                <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                  <div className="flex items-center gap-1.5 font-bold text-slate-500">
                    <GraduationCap className="h-3.5 w-3.5 text-purple-500" /> শিক্ষাগত যোগ্যতা
                  </div>
                  <div className="mt-1 font-medium text-slate-900 dark:text-white">
                    {viewingTeacher.qualification}
                  </div>
                </div>
              )}

              {viewingTeacher.subjects && viewingTeacher.subjects.length > 0 && (
                <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                  <div className="flex items-center gap-1.5 font-bold text-slate-500">
                    <BookOpen className="h-3.5 w-3.5 text-blue-500" /> নিযুক্ত বিষয়সমূহ
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {viewingTeacher.subjects.map((sub, idx) => (
                      <span
                        key={idx}
                        className="rounded-lg bg-white px-2 py-1 text-xs font-semibold text-slate-700 shadow-sm border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {viewingTeacher.biography && (
                <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                  <div className="font-bold text-slate-500">জীবনবৃত্তান্ত ও দায়িত্বসমূহ</div>
                  <p className="mt-1 leading-relaxed text-slate-700 dark:text-slate-300">
                    {viewingTeacher.biography}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  const target = viewingTeacher;
                  setViewingTeacher(null);
                  handleOpenEditModal(target);
                }}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-700"
              >
                <Edit className="h-4 w-4" /> এই প্রোফাইল এডিট করুন
              </button>
              <button
                type="button"
                onClick={() => setViewingTeacher(null)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Faculty Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 rounded-full bg-slate-100 p-1.5 text-slate-400 hover:bg-slate-200 dark:bg-slate-800"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              <Sparkles className="h-4 w-4" />
              {editingTeacher ? 'শিক্ষকের তথ্য সম্পাদনা' : 'নতুন শিক্ষক / কর্মকর্তা অন্তর্ভুক্তি'}
            </div>
            <h3 className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
              {editingTeacher ? `সম্পাদনা: ${editingTeacher.name}` : 'নতুন শিক্ষক / বিভাগীয় প্রধান / অধ্যক্ষ যোগ করুন'}
            </h3>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
              {/* Role Badges / Category Switches */}
              <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-3.5 dark:border-indigo-950 dark:bg-indigo-950/20">
                <span className="font-bold text-indigo-900 dark:text-indigo-300">
                  বিশেষ পদমর্যাদা নির্ধারণ (Special Role Tagging):
                </span>
                <div className="mt-2.5 flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isPrincipal}
                      onChange={e => {
                        const checked = e.target.checked;
                        setFormData({
                          ...formData,
                          isPrincipal: checked,
                          faculty: checked ? 'প্রশাসন' : formData.faculty,
                          department: checked ? 'প্রশাসন (Administration)' : formData.department,
                          designation: checked ? 'উপাধ্যক্ষ ও অধ্যক্ষ (অ.দা.)' : formData.designation
                        });
                      }}
                      className="h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                    />
                    <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5 text-amber-500" />
                      🏛️ অধ্যক্ষ / উপাধ্যক্ষ (Principal / Vice Principal)
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isHOD}
                      onChange={e => setFormData({ ...formData, isHOD: e.target.checked })}
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                      <Building className="h-3.5 w-3.5 text-indigo-500" />
                      🏢 বিভাগীয় প্রধান (Head of Department / HOD)
                    </span>
                  </label>
                </div>
              </div>

              {/* 1. Profile Picture URL */}
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  শিক্ষকের প্রোফাইল ছবির লিংক (Photo URL)
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.avatar}
                  onChange={e => setFormData({ ...formData, avatar: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              {/* 2. Basic Info */}
              <div className="space-y-3">
                <h4 className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">
                  ১. প্রাথমিক পরিচিতি ও যোগাযোগ (Basic Identity)
                </h4>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300">
                      শিক্ষক/কর্মকর্তার পুরো নাম *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: সঞ্জিত কুমার মিস্ত্রী / বাবুল কুমার ভট্টাচার্য্য"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300">
                      ইমেইল ঠিকানা (Email Address) *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="যেমন: b.babul1984@gmail.com"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300">
                      মোবাইল নম্বর (Mobile Phone) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: ০১৯১১২৮৩৪৪৪"
                      value={formData.mobilePhone}
                      onChange={e => setFormData({ ...formData, mobilePhone: e.target.value, phone: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300">
                      লগইন পাসওয়ার্ড (Portal Password)
                    </label>
                    <input
                      type="text"
                      placeholder="পাসওয়ার্ড লিখুন (ফাঁকা রাখলে ডিফল্ট teacher123 হবে)"
                      value={formData.password}
                      onChange={e => setFormData({ ...formData, password: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    অফিস ফোন (Telephone / Office Phone)
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: ০২৪৭৯৯৫৪০৩৩"
                    value={formData.officePhone}
                    onChange={e => setFormData({ ...formData, officePhone: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              {/* 3. Designation, Department, Faculty & Shift */}
              <div className="space-y-3 pt-2">
                <h4 className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">
                  ২. পদবি, বিভাগ ও শিফট (Designation & Department)
                </h4>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">
                      পদবি (Designation) *
                    </label>
                    <span className="text-[10px] text-slate-400">নিচের পিল থেকে ক্লিক বা কাস্টম টাইপ করুন</span>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: চিফ ইনস্ট্রাক্টর ও বিভাগীয় প্রধান, নন-টেক (২য় শিফট) ও একাডেমিক ইনচার্জ"
                    value={formData.designation}
                    onChange={e => setFormData({ ...formData, designation: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                  {/* Quick Preset Pills */}
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {DESIGNATION_PRESETS.slice(0, 8).map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFormData({ ...formData, designation: preset })}
                        className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 dark:bg-slate-800 dark:text-slate-300"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300">
                      অনুষদ (Faculty)
                    </label>
                    <select
                      value={formData.faculty}
                      onChange={e => setFormData({ ...formData, faculty: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    >
                      {FACULTY_LIST.map((f, i) => (
                        <option key={i} value={f}>{f}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300">
                      বিভাগ (Department / Section) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: নন-টেক (২য় শিফট) / কম্পিউটার সাইন্স"
                      value={formData.department}
                      onChange={e => setFormData({ ...formData, department: e.target.value })}
                      list="departments-datalist"
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                    <datalist id="departments-datalist">
                      {DEPARTMENTS_LIST.map((d, i) => (
                        <option key={i} value={d} />
                      ))}
                    </datalist>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300">
                      একাডেমিক শিফট (Academic Shift)
                    </label>
                    <select
                      value={formData.shift}
                      onChange={e => setFormData({ ...formData, shift: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    >
                      <option value="">কোনটি নয় / সাধারণ</option>
                      <option value="১ম শিফট">১ম শিফট</option>
                      <option value="২য় শিফট">২য় শিফট</option>
                      <option value="উভয় শিফট">উভয় শিফট</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300">
                      বিসিএস ব্যাচ (BCS Batch - if applicable)
                    </label>
                    <input
                      type="text"
                      placeholder="যেমন: ৩৮, ৪০, ৪১, ৪৩ (যদি থাকে)"
                      value={formData.bcsBatch}
                      onChange={e => setFormData({ ...formData, bcsBatch: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Academic & Office Room Details */}
              <div className="space-y-3 pt-2">
                <h4 className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">
                  ৩. অফিস চেম্বার ও শিক্ষাগত তথ্য (Academic & Chamber)
                </h4>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300">
                      কক্ষ নম্বর / চেম্বার (Office Room)
                    </label>
                    <input
                      type="text"
                      placeholder="যেমন: কক্ষ নং ২০৪ (একাডেমিক ভবন) / বিভাগীয় প্রধান কার্যালয়"
                      value={formData.officeRoom}
                      onChange={e => setFormData({ ...formData, officeRoom: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300">
                      অফিস সময় / সাক্ষাতের সময় (Office Hours)
                    </label>
                    <input
                      type="text"
                      placeholder="রবিবার - বৃহস্পতিবার: ০৯:০০ AM - ০৩:০০ PM"
                      value={formData.officeHours}
                      onChange={e => setFormData({ ...formData, officeHours: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300">
                      শিক্ষাগত যোগ্যতা (Qualification)
                    </label>
                    <input
                      type="text"
                      placeholder="যেমন: B.Sc. in Engineering / M.Sc. / B.A. (Honours), M.A. in English"
                      value={formData.qualification}
                      onChange={e => setFormData({ ...formData, qualification: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300">
                      অভিজ্ঞতা বছর (Experience in Years)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="50"
                      value={formData.experienceYears}
                      onChange={e => setFormData({ ...formData, experienceYears: Number(e.target.value) })}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    পাঠদানকৃত বিষয়সমূহ (Assigned Courses / Subjects - কমা দিয়ে লিখুন)
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: Communicative English, Database Management, Technical English"
                    value={formData.subjectsStr}
                    onChange={e => setFormData({ ...formData, subjectsStr: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    জীবনবৃত্তান্ত ও দায়িত্বসমূহ (Biography & Remarks)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="শিক্ষকের অ্যাকাডেমিক দায়িত্ব, দায়িত্বপ্রাপ্ত শিফট ও অন্যান্য বর্ণনা..."
                    value={formData.biography}
                    onChange={e => setFormData({ ...formData, biography: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              {/* Form Submission Buttons */}
              <div className="mt-6 flex gap-2.5 border-t border-slate-100 pt-4 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/3 rounded-xl border border-slate-200 py-3 text-xs font-bold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="w-2/3 rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-600/25 hover:bg-emerald-700 transition-all flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {editingTeacher ? 'তথ্য সংরক্ষণ করুন (Save Updates)' : 'শিক্ষক সংরক্ষণ করুন (Add Faculty)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete Teacher Confirmation Dialog */}
      {teacherToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-rose-200/80 bg-white p-6 shadow-2xl dark:border-rose-900/50 dark:bg-slate-900">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 mb-4">
              <Trash2 className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              শিক্ষক প্রোফাইল মুছে ফেলতে চান?
            </h3>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              আপনি কি নিশ্চিত যে <strong>"{teacherToDelete.name}"</strong> ({teacherToDelete.designation}) এর শিক্ষক প্রোফাইল ও লগইন অ্যাক্সেস সেন্ট্রাল ডাটাবেজ থেকে মুছে ফেলতে চান?
            </p>
            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setTeacherToDelete(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                বাতিল করুন
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteTeacher(teacherToDelete.id);
                  setTeacherToDelete(null);
                }}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700 shadow-md shadow-rose-600/20"
              >
                হ্যাঁ, ডাটাবেজ থেকে মুছে ফেলুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
