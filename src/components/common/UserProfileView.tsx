import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { UserAvatar } from './UserAvatar';
import {
  UserCheck,
  GraduationCap,
  Shield,
  Award,
  Save,
  Sparkles,
  Mail,
  Phone,
  MapPin,
  Building2,
  BookOpen,
  CheckCircle2,
  Download,
  Camera,
  Upload,
  Trash2,
  Image as ImageIcon
} from 'lucide-react';

export const UserProfileView: React.FC = () => {
  const {
    role,
    currentStudent,
    currentTeacher,
    principalUser,
    hodUser,
    updateUserProfile,
    downloadSlipPDF,
    departments,
    language
  } = useApp();

  const isBN = language === 'BN';

  // Determine current active user data based on role
  const getUserData = () => {
    if (role === 'STUDENT') {
      return {
        name: currentStudent.name || '',
        email: currentStudent.email || '',
        phone: currentStudent.phone || '',
        address: currentStudent.address || '',
        department: currentStudent.department || '',
        semester: currentStudent.semester || '',
        designation: 'Student',
        rollNumber: currentStudent.rollNumber || '',
        registrationNumber: currentStudent.registrationNumber || '',
        guardianName: currentStudent.guardianName || '',
        guardianPhone: currentStudent.guardianPhone || '',
        bloodGroup: currentStudent.bloodGroup || 'O+',
        avatar: currentStudent.avatar || '',
        cgpa: currentStudent.cgpa,
        attendance: currentStudent.attendancePercentage
      };
    } else if (role === 'TEACHER') {
      return {
        name: currentTeacher.name || '',
        email: currentTeacher.email || '',
        phone: currentTeacher.phone || '',
        address: currentTeacher.officeRoom || '',
        department: currentTeacher.department || '',
        semester: '',
        designation: currentTeacher.designation || 'Assistant Professor',
        officeRoom: currentTeacher.officeRoom || '',
        officeHours: currentTeacher.officeHours || '',
        qualification: currentTeacher.qualification || '',
        biography: currentTeacher.biography || '',
        avatar: currentTeacher.avatar || ''
      };
    } else if (role === 'HOD') {
      return {
        name: hodUser.name || '',
        email: hodUser.email || '',
        phone: hodUser.phone || '',
        address: hodUser.officeRoom || '',
        department: hodUser.department || '',
        semester: '',
        designation: hodUser.designation || 'Head of Department',
        officeRoom: hodUser.officeRoom || '',
        officeHours: hodUser.officeHours || '',
        qualification: hodUser.qualification || '',
        biography: hodUser.biography || '',
        avatar: hodUser.avatar || ''
      };
    } else {
      // ADMIN
      return {
        name: principalUser.name || '',
        email: principalUser.email || '',
        phone: principalUser.phone || '',
        address: principalUser.officeRoom || '',
        department: principalUser.department || 'Administration',
        semester: '',
        designation: principalUser.designation || 'Principal & Administrator',
        officeRoom: principalUser.officeRoom || '',
        officeHours: principalUser.officeHours || '',
        qualification: principalUser.qualification || '',
        biography: principalUser.biography || '',
        avatar: principalUser.avatar || ''
      };
    }
  };

  const initialData = getUserData();

  const [form, setForm] = useState(initialData);
  const [isEditing, setIsEditing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const bannerFileInputRef = useRef<HTMLInputElement>(null);
  const formFileInputRef = useRef<HTMLInputElement>(null);

  // Sync form when user data changes
  useEffect(() => {
    setForm(getUserData());
  }, [role, currentStudent, currentTeacher, principalUser, hodUser]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(form);
    setSuccessMsg(isBN ? 'প্রোফাইল তথ্য সফলভাবে সংরক্ষিত হয়েছে!' : 'Profile updated successfully!');
    setIsEditing(false);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleBannerFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert(isBN ? 'অনুগ্রহ করে শুধুমাত্র ছবি ফাইল (JPG, PNG, WebP) নির্বাচন করুন।' : 'Please select an image file (JPG, PNG, WebP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setForm(prev => ({ ...prev, avatar: dataUrl }));
      updateUserProfile({ ...form, avatar: dataUrl });
      setSuccessMsg(isBN ? 'প্রোফাইল ছবি সফলভাবে যুক্ত হয়েছে!' : 'Profile photo added successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRemovePhoto = () => {
    setForm(prev => ({ ...prev, avatar: '' }));
    updateUserProfile({ ...form, avatar: '' });
    setSuccessMsg(isBN ? 'প্রোফাইল ছবি মুছে ফেলা হয়েছে!' : 'Profile photo removed!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-indigo-950">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <UserAvatar
                src={form.avatar}
                name={form.name}
                role={role}
                size="2xl"
                editable={true}
                onPhotoChange={(newPhoto) => {
                  setForm(prev => ({ ...prev, avatar: newPhoto }));
                  updateUserProfile({ ...form, avatar: newPhoto });
                  setSuccessMsg(isBN ? 'প্রোফাইল ছবি সফলভাবে আপডেট হয়েছে!' : 'Photo updated successfully!');
                  setTimeout(() => setSuccessMsg(''), 4000);
                }}
                onPhotoRemove={handleRemovePhoto}
              />
              <span className="absolute -bottom-1 -right-1 p-1.5 rounded-xl bg-indigo-600 text-white shadow">
                {role === 'STUDENT' ? <GraduationCap className="h-4 w-4" /> : role === 'ADMIN' ? <Shield className="h-4 w-4" /> : role === 'HOD' ? <Award className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
              </span>
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-semibold backdrop-blur-md border border-white/10 mb-1">
                <span>{role} {isBN ? 'অ্যাকাউন্ট' : 'ACCOUNT'}</span>
                <span>•</span>
                <span>{form.department}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">{form.name}</h1>
              <p className="text-xs text-indigo-200/80 mt-1 flex items-center gap-3">
                <span>{form.email}</span>
                {form.rollNumber && <span>• {isBN ? 'রোল' : 'Roll'}: {form.rollNumber}</span>}
              </p>
              {!form.avatar && (
                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="file"
                    ref={bannerFileInputRef}
                    onChange={handleBannerFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => bannerFileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow transition"
                  >
                    <Camera className="h-3.5 w-3.5" />
                    <span>{isBN ? 'ছবি যোগ করুন' : 'Add Profile Photo'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {role === 'STUDENT' && (
              <button
                type="button"
                onClick={() => downloadSlipPDF({ name: form.name, email: form.email, role: 'STUDENT', identifier: form.rollNumber, department: form.department, semester: form.semester, registeredAt: 'Active' })}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs transition border border-white/20 shadow-md"
              >
                <Download className="h-4 w-4" />
                <span>{isBN ? 'রেজিস্ট্রেশন স্লিপ ডাউনলোড' : 'Download Reg Slip'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs shadow-lg shadow-indigo-500/30 transition"
            >
              {isEditing 
                ? (isBN ? 'সম্পাদনা বাতিল' : 'Cancel Editing') 
                : (isBN ? 'প্রোফাইল তথ্য সম্পাদনা' : 'Edit Profile Details')}
            </button>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 dark:bg-emerald-950/60 dark:border-emerald-800 dark:text-emerald-300 text-xs font-bold shadow-sm">
          <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Profile Details vs Editing Form */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {!isEditing ? (
          /* DISPLAY VIEW */
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <span>{isBN ? 'অ্যাকাউন্ট প্রোফাইল বিবরণ' : 'Account Information'}</span>
              </h2>
              <span className="text-xs font-medium text-slate-400">
                {isBN ? 'ব্যক্তিগত ও প্রাতিষ্ঠানিক তথ্য রেকর্ড' : 'Personal & Academic Record'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  {isBN ? 'পূর্ণ নাম' : 'Full Name'}
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">{form.name}</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Mail className="h-3 w-3" /> {isBN ? 'ইমেইল অ্যাড্রেস' : 'Email Address'}
                </div>
                <div className="text-xs font-semibold text-slate-900 dark:text-white">{form.email}</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Phone className="h-3 w-3" /> {isBN ? 'মোবাইল নম্বর' : 'Phone Number'}
                </div>
                <div className="text-xs font-semibold text-slate-900 dark:text-white">{form.phone || (isBN ? 'প্রদান করা হয়নি' : 'Not Provided')}</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Building2 className="h-3 w-3" /> {isBN ? 'বিভাগ / ডিপার্টমেন্ট' : 'Department'}
                </div>
                <div className="text-xs font-semibold text-slate-900 dark:text-white">{form.department}</div>
              </div>

              {role === 'STUDENT' ? (
                <>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <BookOpen className="h-3 w-3" /> {isBN ? 'সেমিস্টার' : 'Semester'}
                    </div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-white">{form.semester}</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      {isBN ? 'রোল / আইডি নম্বর' : 'Roll / ID Number'}
                    </div>
                    <div className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">{form.rollNumber}</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      {isBN ? 'অভিভাবকের নাম ও ফোন' : 'Guardian Name & Contact'}
                    </div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-white">{form.guardianName} ({form.guardianPhone})</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      {isBN ? 'রক্তের গ্রুপ' : 'Blood Group'}
                    </div>
                    <div className="text-xs font-bold text-rose-600 dark:text-rose-400">{form.bloodGroup}</div>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      {isBN ? 'পদবী / ডেসিগনেশন' : 'Designation'}
                    </div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-white">{form.designation}</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      {isBN ? 'অফিস রুম নং' : 'Office Room'}
                    </div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-white">{form.officeRoom || (isBN ? 'ফ্যাকাল্টি স্যুট' : 'Faculty Suite')}</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      {isBN ? 'শিক্ষাগত যোগ্যতা' : 'Qualification'}
                    </div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-white">{form.qualification || 'M.Sc / Ph.D'}</div>
                  </div>
                </>
              )}
            </div>

            {form.biography && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  {isBN ? 'সংক্ষিপ্ত পরিচিতি ও বায়োগ্রাফি' : 'Biography / Info'}
                </div>
                <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{form.biography}</div>
              </div>
            )}
          </div>
        ) : (
          /* EDITING FORM */
          <form onSubmit={handleSave} className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <span>{isBN ? 'অ্যাকাউন্ট প্রোফাইল তথ্য পরিবর্তন' : 'Edit Account Profile Details'}</span>
              </h2>
              <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                {isBN ? 'আপনার প্রোফাইল ছবি ও যোগাযোগের তথ্য হালনাগাদ করুন' : 'Update your profile photo and contact details'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Dedicated Profile Picture Upload & Control Section */}
            <div className="col-span-full rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 p-4 border border-indigo-100 dark:border-indigo-900/50">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <UserAvatar
                  src={form.avatar}
                  name={form.name}
                  size="xl"
                  editable={false}
                />
                <div className="flex-1 space-y-2 text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                      {isBN ? 'প্রোফাইল ছবি' : 'Profile Picture'}
                    </span>
                    {form.avatar ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                        {isBN ? 'যুক্ত করা হয়েছে' : 'Active Photo'}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300">
                        {isBN ? 'এখনও ছবি যোগ করা হয়নি' : 'No Photo Added'}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {isBN 
                      ? 'লগইন করার পর ছবি যোগ করলেই কেবল প্রোফাইল পিকচার প্রদর্শিত হবে।' 
                      : 'Upload a picture from your device or paste a URL to show as your profile photo.'}
                  </p>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                    <input
                      type="file"
                      ref={formFileInputRef}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        if (!file.type.startsWith('image/')) {
                          alert(isBN ? 'অনুগ্রহ করে ছবি ফাইল নির্বাচন করুন।' : 'Please select an image file.');
                          return;
                        }
                        const reader = new FileReader();
                        reader.onload = () => {
                          const dataUrl = reader.result as string;
                          setForm(prev => ({ ...prev, avatar: dataUrl }));
                        };
                        reader.readAsDataURL(file);
                        e.target.value = '';
                      }}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => formFileInputRef.current?.click()}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-sm transition cursor-pointer"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      <span>{isBN ? 'ডিভাইস থেকে ছবি আপলোড করুন' : 'Upload from Device'}</span>
                    </button>
                    {form.avatar && (
                      <button
                        type="button"
                        onClick={() => setForm(prev => ({ ...prev, avatar: '' }))}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900 font-semibold text-xs transition cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>{isBN ? 'ছবি মুছুন' : 'Remove Photo'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Optional URL input */}
              <div className="mt-3 pt-3 border-t border-indigo-100/70 dark:border-indigo-900/40">
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  {isBN ? 'অথবা সরাসরি ছবির লিঙ্ক (Image URL) দিন:' : 'Or enter direct Image URL:'}
                </label>
                <input
                  type="url"
                  value={form.avatar}
                  onChange={e => setForm({ ...form, avatar: e.target.value })}
                  placeholder="https://example.com/my-photo.jpg"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  {isBN ? 'পূর্ণ নাম' : 'Full Name'}
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  {isBN ? 'ইমেইল অ্যাড্রেস' : 'Email Address'}
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  {isBN ? 'মোবাইল নম্বর' : 'Phone Number'}
                </label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  placeholder={isBN ? 'যেমন: ০১৭০০-০০০০০০' : 'e.g. +1 (555) 019-2831'}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  {isBN ? 'বিভাগ / ডিপার্টমেন্ট' : 'Department'}
                </label>
                <select
                  value={form.department}
                  onChange={e => setForm({ ...form, department: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  {departments.map(d => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>

              {role === 'STUDENT' && (
                <>
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300">
                      {isBN ? 'রোল / আইডি নম্বর' : 'Roll / ID Number'}
                    </label>
                    <input
                      type="text"
                      value={form.rollNumber}
                      onChange={e => setForm({ ...form, rollNumber: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300">
                      {isBN ? 'সেমিস্টার' : 'Semester'}
                    </label>
                    <select
                      value={form.semester}
                      onChange={e => setForm({ ...form, semester: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    >
                      <option value="1st Semester">1st Semester</option>
                      <option value="2nd Semester">2nd Semester</option>
                      <option value="3rd Semester">3rd Semester</option>
                      <option value="4th Semester">4th Semester</option>
                      <option value="5th Semester">5th Semester</option>
                      <option value="6th Semester">6th Semester</option>
                      <option value="7th Semester">7th Semester</option>
                      <option value="8th Semester">8th Semester</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300">
                      {isBN ? 'অভিভাবকের নাম' : 'Guardian Name'}
                    </label>
                    <input
                      type="text"
                      value={form.guardianName}
                      onChange={e => setForm({ ...form, guardianName: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300">
                      {isBN ? 'অভিভাবকের ফোন নম্বর' : 'Guardian Phone'}
                    </label>
                    <input
                      type="text"
                      value={form.guardianPhone}
                      onChange={e => setForm({ ...form, guardianPhone: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300">
                      {isBN ? 'রক্তের গ্রুপ' : 'Blood Group'}
                    </label>
                    <select
                      value={form.bloodGroup}
                      onChange={e => setForm({ ...form, bloodGroup: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    >
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>
                </>
              )}

              {role !== 'STUDENT' && (
                <>
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300">
                      {isBN ? 'পদবী / ডেসিগনেশন' : 'Designation / Title'}
                    </label>
                    <input
                      type="text"
                      value={form.designation}
                      onChange={e => setForm({ ...form, designation: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300">
                      {isBN ? 'অফিস রুম নং' : 'Office Room / Suite'}
                    </label>
                    <input
                      type="text"
                      value={form.officeRoom}
                      onChange={e => setForm({ ...form, officeRoom: e.target.value })}
                      placeholder={isBN ? 'যেমন: রুম ৪০২, অ্যাকাডেমিক ভবন' : 'e.g. Room 402, Academic Bldg'}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300">
                      {isBN ? 'অফিস কনসালটেশন সময়' : 'Office Consultation Hours'}
                    </label>
                    <input
                      type="text"
                      value={form.officeHours}
                      onChange={e => setForm({ ...form, officeHours: e.target.value })}
                      placeholder={isBN ? 'যেমন: রবি-মঙ্গল ১০:০০ AM - ১২:০০ PM' : 'e.g. Sun-Tue 10:00 AM - 12:00 PM'}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300">
                      {isBN ? 'শিক্ষাগত যোগ্যতা' : 'Qualification'}
                    </label>
                    <input
                      type="text"
                      value={form.qualification}
                      onChange={e => setForm({ ...form, qualification: e.target.value })}
                      placeholder="e.g. B.Sc in CSE, M.Sc, Ph.D"
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                </>
              )}
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 text-xs">
                {isBN ? 'সংক্ষিপ্ত বায়োগ্রাফি / পরিচিতি' : 'Biography / Short About'}
              </label>
              <textarea
                rows={3}
                value={form.biography}
                onChange={e => setForm({ ...form, biography: e.target.value })}
                placeholder={isBN ? 'আপনার সংক্ষিপ্ত একাডেমিক ব্যাকগ্রাউন্ড লিখুন...' : 'Brief introduction or background...'}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                {isBN ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition cursor-pointer"
              >
                <Save className="h-4 w-4" />
                <span>{isBN ? 'সংরক্ষণ করুন' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
