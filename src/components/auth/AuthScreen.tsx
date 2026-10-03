import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { PublicFacultyDirectory } from '../common/PublicFacultyDirectory';
import { auth, googleAuthProvider } from '../../lib/firebase.ts';
import { signInWithPopup } from 'firebase/auth';
import {
  GraduationCap,
  UserCheck,
  Shield,
  ShieldCheck,
  Lock,
  Mail,
  User as UserIcon,
  BookOpen,
  Building2,
  KeyRound,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Moon,
  Sun,
  Globe,
  School,
  Phone,
  Award,
  FileSpreadsheet,
  FileText,
  Database,
  Download,
  Users
} from 'lucide-react';

export const AuthScreen: React.FC = () => {
  const {
    login,
    registerStudent,
    registerTeacher,
    registerAdmin,
    registerPrincipal,
    registerHOD,
    registeredUsers,
    exportUsersExcel,
    exportUsersPDF,
    downloadSlipPDF,
    theme,
    toggleTheme,
    language,
    setLanguage,
    isBN,
    l,
    departments,
    loginWithGoogle
  } = useApp();

  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      const result = await signInWithPopup(auth, googleAuthProvider);
      if (result.user) {
        loginWithGoogle({
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL
        });
      }
    } catch (err: any) {
      console.error('Google sign-in error:', err);
      setFeedback({
        type: 'error',
        message: language === 'BN' ? 'গুগল সাইন-ইন সম্পন্ন করা যায়নি।' : 'Google Sign-In could not be completed.'
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const [selectedRole, setSelectedRole] = useState<UserRole>('STUDENT');
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [showPassword, setShowPassword] = useState(false);
  const [showPublicDirectory, setShowPublicDirectory] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string; userObj?: any } | null>(null);

  // Login form state
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const clearFormFields = () => {
    setIdentifier('');
    setPassword('');
    setFeedback(null);
  };

  // Registration state - Student
  const [regStudentName, setRegStudentName] = useState('');
  const [regRollNumber, setRegRollNumber] = useState('');
  const [regStudentEmail, setRegStudentEmail] = useState('');
  const [regStudentDept, setRegStudentDept] = useState(departments[0]?.name || 'Computer Science & Engineering');
  const [regSemester, setRegSemester] = useState('1st Semester');
  const [regStudentAvatar, setRegStudentAvatar] = useState('');
  const [regStudentPass, setRegStudentPass] = useState('');
  const [regStudentConfirmPass, setRegStudentConfirmPass] = useState('');

  // Registration state - Teacher
  const [regTeacherName, setRegTeacherName] = useState('');
  const [regTeacherEmail, setRegTeacherEmail] = useState('');
  const [regDesignation, setRegDesignation] = useState('Assistant Professor');
  const [regTeacherDept, setRegTeacherDept] = useState(departments[0]?.name || 'Computer Science & Engineering');
  const [regTeacherPhone, setRegTeacherPhone] = useState('');
  const [regTeacherAvatar, setRegTeacherAvatar] = useState('');
  const [regTeacherPass, setRegTeacherPass] = useState('');
  const [regTeacherConfirmPass, setRegTeacherConfirmPass] = useState('');

  // Registration state - HOD
  const [regHodName, setRegHodName] = useState('');
  const [regHodEmail, setRegHodEmail] = useState('');
  const [regHodDept, setRegHodDept] = useState(departments[0]?.name || 'Computer Science & Engineering');
  const [regHodAvatar, setRegHodAvatar] = useState('');
  const [regHodPass, setRegHodPass] = useState('');
  const [regHodConfirmPass, setRegHodConfirmPass] = useState('');

  // Registration state - Principal
  const [regPrincipalName, setRegPrincipalName] = useState('');
  const [regPrincipalEmail, setRegPrincipalEmail] = useState('');
  const [regPrincipalPhone, setRegPrincipalPhone] = useState('');
  const [regPrincipalAvatar, setRegPrincipalAvatar] = useState('');
  const [regPrincipalPass, setRegPrincipalPass] = useState('');
  const [regPrincipalConfirmPass, setRegPrincipalConfirmPass] = useState('');

  // Registration state - Admin
  const [regAdminName, setRegAdminName] = useState('');
  const [regAdminEmail, setRegAdminEmail] = useState('');
  const [regAdminKey, setRegAdminKey] = useState('');
  const [regAdminAvatar, setRegAdminAvatar] = useState('');
  const [regAdminPass, setRegAdminPass] = useState('');
  const [regAdminConfirmPass, setRegAdminConfirmPass] = useState('');

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setFeedback(null);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const res = login(selectedRole, identifier, password);
    if (res.success) {
      setFeedback({ type: 'success', message: res.message });
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (selectedRole === 'STUDENT') {
      if (regStudentPass && regStudentPass !== regStudentConfirmPass) {
        setFeedback({ type: 'error', message: 'Passwords do not match!' });
        return;
      }
      const res = registerStudent({
        name: regStudentName,
        rollNumber: regRollNumber,
        email: regStudentEmail,
        department: regStudentDept,
        semester: regSemester,
        password: regStudentPass,
        avatar: regStudentAvatar
      });
      if (res.success) {
        setFeedback({
          type: 'success',
          message: res.message,
          userObj: {
            name: regStudentName,
            email: regStudentEmail,
            role: 'STUDENT',
            identifier: regRollNumber,
            department: regStudentDept,
            semester: regSemester,
            registeredAt: new Date().toLocaleDateString()
          }
        });
      } else {
        setFeedback({ type: 'error', message: res.message });
      }
    } else if (selectedRole === 'TEACHER') {
      if (regTeacherPass && regTeacherPass !== regTeacherConfirmPass) {
        setFeedback({ type: 'error', message: 'Passwords do not match!' });
        return;
      }
      const res = registerTeacher({
        name: regTeacherName,
        email: regTeacherEmail,
        designation: regDesignation,
        department: regTeacherDept,
        phone: regTeacherPhone,
        password: regTeacherPass,
        avatar: regTeacherAvatar
      });
      if (res.success) {
        setFeedback({
          type: 'success',
          message: res.message,
          userObj: {
            name: regTeacherName,
            email: regTeacherEmail,
            role: 'TEACHER',
            identifier: regTeacherEmail,
            department: regTeacherDept,
            designation: regDesignation,
            phone: regTeacherPhone,
            registeredAt: new Date().toLocaleDateString()
          }
        });
      } else {
        setFeedback({ type: 'error', message: res.message });
      }
    } else if (selectedRole === 'HOD') {
      if (regHodPass && regHodPass !== regHodConfirmPass) {
        setFeedback({ type: 'error', message: 'Passwords do not match!' });
        return;
      }
      const res = registerHOD({
        name: regHodName,
        email: regHodEmail,
        department: regHodDept,
        password: regHodPass,
        avatar: regHodAvatar
      });
      if (res.success) {
        setFeedback({
          type: 'success',
          message: res.message,
          userObj: {
            name: regHodName,
            email: regHodEmail,
            role: 'HOD',
            identifier: regHodEmail,
            department: regHodDept,
            designation: 'Head of Department',
            registeredAt: new Date().toLocaleDateString()
          }
        });
      } else {
        setFeedback({ type: 'error', message: res.message });
      }
    } else if (selectedRole === 'PRINCIPAL') {
      if (regPrincipalPass && regPrincipalPass !== regPrincipalConfirmPass) {
        setFeedback({ type: 'error', message: 'Passwords do not match!' });
        return;
      }
      const res = registerPrincipal({
        name: regPrincipalName,
        email: regPrincipalEmail,
        phone: regPrincipalPhone,
        password: regPrincipalPass,
        avatar: regPrincipalAvatar
      });
      if (res.success) {
        setFeedback({
          type: 'success',
          message: res.message,
          userObj: {
            name: regPrincipalName,
            email: regPrincipalEmail,
            role: 'PRINCIPAL',
            identifier: regPrincipalEmail,
            registeredAt: new Date().toLocaleDateString()
          }
        });
      } else {
        setFeedback({ type: 'error', message: res.message });
      }
    } else if (selectedRole === 'ADMIN') {
      if (regAdminPass && regAdminPass !== regAdminConfirmPass) {
        setFeedback({ type: 'error', message: 'Passwords do not match!' });
        return;
      }
      const res = registerAdmin({
        name: regAdminName,
        email: regAdminEmail,
        adminKey: regAdminKey,
        password: regAdminPass,
        avatar: regAdminAvatar
      });
      if (res.success) {
        setFeedback({
          type: 'success',
          message: res.message,
          userObj: {
            name: regAdminName,
            email: regAdminEmail,
            role: 'ADMIN',
            identifier: regAdminEmail,
            registeredAt: new Date().toLocaleDateString()
          }
        });
      } else {
        setFeedback({ type: 'error', message: res.message });
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-900 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Background Decorative Lighting */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 translate-x-1/2 w-[600px] h-[600px] bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar Navigation */}
      <header className="relative z-10 flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-lg shadow-indigo-500/25">
            <School className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              {isBN ? 'ক্যাম্পাস ম্যানেজমেন্ট পোর্টাল' : 'EduCampus Portal'}
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                v2.5 ERP
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              {isBN ? 'সমন্বিত প্রাতিষ্ঠানিক ও একাডেমিক ম্যানেজমেন্ট সিস্টেম' : 'Integrated Academic Management System'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Public Faculty Directory Button */}
          <button
            onClick={() => setShowPublicDirectory(!showPublicDirectory)}
            className="flex items-center gap-1.5 rounded-xl border border-indigo-500/40 bg-indigo-950/80 px-3.5 py-1.5 text-xs font-bold text-indigo-200 hover:bg-indigo-900 transition shadow-sm cursor-pointer"
          >
            <Users className="h-4 w-4 text-indigo-400" />
            <span>
              {showPublicDirectory 
                ? (isBN ? 'লগইনে ফিরুন' : 'Back to Login') 
                : (isBN ? 'ক্যাম্পাস শিক্ষক ডিরেক্টরি (পাবলিক)' : 'Campus Faculty Directory (Public)')}
            </span>
          </button>

          {/* Language Switcher (Prominent Dual Segment Toggle) */}
          <div className="flex items-center rounded-xl border border-slate-800 bg-slate-900/90 p-0.5 shadow-sm">
            <button
              type="button"
              onClick={() => setLanguage('BN')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                language === 'BN'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="বাংলা ভাষা নির্বাচন করুন"
            >
              <span>🇧🇩</span>
              <span>বাংলা</span>
            </button>
            <button
              type="button"
              onClick={() => setLanguage('EN')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                language === 'EN'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Select English Language"
            >
              <span>🇬🇧</span>
              <span>English</span>
            </button>
          </div>

          {/* Dark / Light Toggle */}
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700 hover:bg-slate-800 transition"
            title={isBN ? 'থিম পরিবর্তন' : 'Toggle Theme'}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-indigo-300" />}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-8 max-w-6xl mx-auto w-full">
        {showPublicDirectory ? (
          <div className="w-full">
            <PublicFacultyDirectory isGuestView onBackToAuth={() => setShowPublicDirectory(false)} />
          </div>
        ) : (
          <>
            {/* Hero Tagline */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{isBN ? 'স্মার্ট অ্যাক্সেস কন্ট্রোল ও নিরাপদ প্রমাণীকরণ' : 'Smart Access Control & Role Based Authentication'}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {isBN ? 'ক্যাম্পাস ম্যানেজমেন্ট সিস্টেমে স্বাগতম' : 'Welcome to Campus Management System'}
              </h2>
              <p className="text-sm text-slate-400 max-w-lg mx-auto mt-2">
                {isBN 
                  ? 'লগইন করতে অথবা নতুন অ্যাকাউন্ট খুলতে নিচের তালিকা থেকে আপনার উপযুক্ত প্যানেল নির্বাচন করুন। শিক্ষক ও অনুষদের তথ্য ও অফিস আওয়ার দেখতে চান? ' 
                  : 'Select your panel role below to log in or register your account. Want to check faculty ranks & office hours first? '}
                <button
                  onClick={() => setShowPublicDirectory(true)}
                  className="text-indigo-400 font-bold underline hover:text-indigo-300 inline-flex items-center gap-1 cursor-pointer"
                >
                  {isBN ? 'পাবলিক শিক্ষক ডিরেক্টরি দেখুন' : 'View Public Faculty Directory'}
                </button>
              </p>
            </div>

        {/* Auth Card Box */}
        <div className="w-full max-w-2xl bg-slate-950/80 border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          
          {/* Role Selection Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 p-1.5 bg-slate-900/90 border border-slate-800 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => handleRoleChange('STUDENT')}
              className={`flex flex-col items-center justify-center gap-1 py-2 px-1.5 rounded-xl text-[11px] font-semibold transition-all ${
                selectedRole === 'STUDENT'
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <GraduationCap className="h-4 w-4" />
              <span>{language === 'BN' ? 'শিক্ষার্থী' : 'Student'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange('TEACHER')}
              className={`flex flex-col items-center justify-center gap-1 py-2 px-1.5 rounded-xl text-[11px] font-semibold transition-all ${
                selectedRole === 'TEACHER'
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <UserCheck className="h-4 w-4" />
              <span>{language === 'BN' ? 'শিক্ষক' : 'Teacher'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange('HOD')}
              className={`flex flex-col items-center justify-center gap-1 py-2 px-1.5 rounded-xl text-[11px] font-semibold transition-all ${
                selectedRole === 'HOD'
                  ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Award className="h-4 w-4" />
              <span>{language === 'BN' ? 'বিভাগীয় প্রধান' : 'Head of Dept'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange('PRINCIPAL')}
              className={`flex flex-col items-center justify-center gap-1 py-2 px-1.5 rounded-xl text-[11px] font-semibold transition-all ${
                selectedRole === 'PRINCIPAL'
                  ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg shadow-amber-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Award className="h-4 w-4 text-amber-300" />
              <span>{language === 'BN' ? 'অধ্যক্ষ' : 'Principal'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange('ADMIN')}
              className={`flex flex-col items-center justify-center gap-1 py-2 px-1.5 rounded-xl text-[11px] font-semibold transition-all ${
                selectedRole === 'ADMIN'
                  ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-lg shadow-rose-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Shield className="h-4 w-4 text-rose-300" />
              <span>{language === 'BN' ? 'মাস্টার অ্যাডমিন' : 'Admin'}</span>
            </button>
          </div>

          {/* Mode Switcher: Login vs Register */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white flex items-center gap-2">
                {selectedRole === 'STUDENT' && <GraduationCap className="h-4 w-4 text-indigo-400" />}
                {selectedRole === 'TEACHER' && <UserCheck className="h-4 w-4 text-emerald-400" />}
                {selectedRole === 'HOD' && <Award className="h-4 w-4 text-purple-400" />}
                {selectedRole === 'PRINCIPAL' && <Award className="h-4 w-4 text-amber-400" />}
                {selectedRole === 'ADMIN' && <Shield className="h-4 w-4 text-rose-400" />}
                
                {selectedRole === 'ADMIN' && (language === 'BN' ? 'মাস্টার অ্যাডমিন প্যানেল (সর্বময় নিয়ন্ত্রণ)' : 'Master Admin Control Panel')}
                {selectedRole === 'PRINCIPAL' && (language === 'BN' ? 'অধ্যক্ষ প্যানেল (একাডেমিক ও প্রশাসন)' : 'Principal Executive Panel')}
                {selectedRole === 'HOD' && (language === 'BN' ? 'বিভাগীয় প্রধান পোর্টাল' : 'Department Head Portal')}
                {selectedRole === 'TEACHER' && (language === 'BN' ? 'শিক্ষক ও ফ্যাকাল্টি পোর্টাল' : 'Teacher & Faculty Portal')}
                {selectedRole === 'STUDENT' && (language === 'BN' ? 'শিক্ষার্থী স্টাডি পোর্টাল' : 'Student Study Portal')}
              </span>
            </div>

            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
              <button
                type="button"
                onClick={() => { setAuthMode('LOGIN'); setFeedback(null); }}
                className={`px-3 py-1 rounded-lg font-semibold transition cursor-pointer ${
                  authMode === 'LOGIN' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {isBN ? 'লগইন' : 'Log In'}
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('REGISTER'); setFeedback(null); }}
                className={`px-3 py-1 rounded-lg font-semibold transition cursor-pointer ${
                  authMode === 'REGISTER' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {isBN ? 'নিবন্ধন / রেজিস্ট্রেশন' : 'Register / Sign Up'}
              </button>
            </div>
          </div>

          {/* Alert / Feedback message */}
          {feedback && (
            <div
              className={`mb-6 p-4 rounded-2xl border text-xs font-medium ${
                feedback.type === 'success'
                  ? 'bg-emerald-950/60 border-emerald-800/80 text-emerald-300'
                  : 'bg-rose-950/60 border-rose-800/80 text-rose-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {feedback.type === 'success' ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                ) : (
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                )}
                <span className="font-semibold text-sm">{feedback.message}</span>
              </div>

              {feedback.type === 'success' && feedback.userObj && (
                <div className="mt-3 pt-3 border-t border-emerald-800/50 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => downloadSlipPDF(feedback.userObj)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 text-white font-bold hover:bg-emerald-600 transition shadow"
                  >
                    <Download className="h-3.5 w-3.5" />
                    {isBN ? 'রেজিস্ট্রেশন স্লিপ ডাউনলোড (PDF)' : 'Download Registration Slip (PDF)'}
                  </button>
                  <button
                    type="button"
                    onClick={exportUsersExcel}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-900/80 border border-emerald-700 text-emerald-200 font-semibold hover:bg-emerald-800 transition"
                  >
                    <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-400" />
                    {isBN ? 'ডাটাবেজ এক্সেল এক্সপোর্ট (.xlsx)' : 'Export DB to Excel (.xlsx)'}
                  </button>
                  <button
                    type="button"
                    onClick={exportUsersPDF}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-900/80 border border-emerald-700 text-emerald-200 font-semibold hover:bg-emerald-800 transition"
                  >
                    <FileText className="h-3.5 w-3.5 text-rose-400" />
                    {isBN ? 'ডাটাবেজ পিডিএফ এক্সপোর্ট' : 'Export DB to PDF'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* FORM AREA */}
          {authMode === 'LOGIN' ? (
            /* LOGIN FORM */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  {selectedRole === 'STUDENT'
                    ? (isBN ? 'শিক্ষার্থী রোল নম্বর অথবা ইমেইল' : 'Roll Number or Student Email')
                    : selectedRole === 'TEACHER'
                    ? (isBN ? 'শিক্ষক ফ্যাকাল্টি ইমেইল বা আইডি' : 'Faculty Email or ID')
                    : selectedRole === 'HOD'
                    ? (isBN ? 'বিভাগীয় প্রধানের অফিসিয়াল ইমেইল' : 'HOD Official Email')
                    : selectedRole === 'PRINCIPAL'
                    ? (isBN ? 'অধ্যক্ষ মহোদয়ের অফিসিয়াল ইমেইল' : 'Principal Official Email')
                    : (isBN ? 'মাস্টার অ্যাডমিন ইমেইল / সিকিউরিটি কোড' : 'Master Admin Email or System Key')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    {selectedRole === 'STUDENT' ? (
                      <GraduationCap className="h-4 w-4 text-indigo-400" />
                    ) : selectedRole === 'TEACHER' ? (
                      <UserCheck className="h-4 w-4 text-emerald-400" />
                    ) : selectedRole === 'HOD' ? (
                      <Award className="h-4 w-4 text-purple-400" />
                    ) : selectedRole === 'PRINCIPAL' ? (
                      <Award className="h-4 w-4 text-amber-400" />
                    ) : (
                      <Shield className="h-4 w-4 text-rose-400" />
                    )}
                  </div>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={e => setIdentifier(e.target.value)}
                    placeholder={
                      selectedRole === 'STUDENT'
                        ? (isBN ? 'আপনার রোল নম্বর অথবা ইমেইল লিখুন' : 'Enter your Roll or Student Email')
                        : selectedRole === 'TEACHER'
                        ? (isBN ? 'শিক্ষকের ইমেইল এড্রেস লিখুন' : 'Enter faculty email address')
                        : selectedRole === 'HOD'
                        ? (isBN ? 'বিভাগীয় প্রধানের ইমেইল লিখুন' : 'Enter HOD official email')
                        : selectedRole === 'PRINCIPAL'
                        ? 'principal@campus.edu'
                        : 'admin@campus.edu'
                    }
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/90 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-slate-300">{isBN ? 'পাসওয়ার্ড' : 'Password'}</label>
                  <button
                    type="button"
                    onClick={() => alert(isBN ? 'পাসওয়ার্ড রিসেট লিংক আপনার ইমেইলে পাঠানো হয়েছে।' : 'Password reset link sent to registered email!')}
                    className="text-[11px] font-medium text-indigo-400 hover:underline cursor-pointer"
                  >
                    {isBN ? 'পাসওয়ার্ড ভুলে গেছেন?' : 'Forgot Password?'}
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/90 pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="rounded border-slate-800 bg-slate-900 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                  />
                  <span>{isBN ? 'এই ডিভাইসে আমাকে লগইন রাখুন' : 'Keep me logged in on this device'}</span>
                </label>
              </div>

              <button
                type="submit"
                className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-white transition shadow-lg mt-2 ${
                  selectedRole === 'STUDENT'
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 shadow-indigo-600/30'
                    : selectedRole === 'TEACHER'
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 shadow-emerald-600/30'
                    : selectedRole === 'HOD'
                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 shadow-purple-600/30'
                    : selectedRole === 'PRINCIPAL'
                    ? 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 shadow-amber-600/30'
                    : 'bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 shadow-rose-600/30'
                }`}
              >
                <span>
                  {selectedRole === 'ADMIN'
                    ? (language === 'BN' ? 'মাস্টার অ্যাডমিন প্যানেলে প্রবেশ করুন' : 'Enter Master Admin Panel')
                    : selectedRole === 'PRINCIPAL'
                    ? (language === 'BN' ? 'অধ্যক্ষ এক্সিকিউটিভ প্যানেলে প্রবেশ করুন' : 'Enter Principal Executive Panel')
                    : selectedRole === 'HOD'
                    ? (language === 'BN' ? 'বিভাগীয় প্রধান পোর্টালে প্রবেশ করুন' : 'Enter Head of Dept Portal')
                    : selectedRole === 'TEACHER'
                    ? (language === 'BN' ? 'শিক্ষক পোর্টালে প্রবেশ করুন' : 'Enter Teacher Portal')
                    : (language === 'BN' ? 'শিক্ষার্থী পোর্টালে প্রবেশ করুন' : 'Enter Student Portal')}
                </span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <div className="relative my-3 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-800" />
                </div>
                <span className="relative bg-slate-950 px-2 text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                  {language === 'BN' ? 'অথবা ক্লাউড লগইন' : 'OR CLOUD LOGIN'}
                </span>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading}
                className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-200 border border-slate-700 bg-slate-900/80 hover:bg-slate-800 transition shadow-sm"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>
                  {isGoogleLoading
                    ? (language === 'BN' ? 'গুগল সাইন-ইন হচ্ছে...' : 'Signing in...')
                    : (language === 'BN' ? 'Google দিয়ে সাইন-ইন করুন (Firebase Auth)' : 'Sign In with Google')}
                </span>
              </button>
            </form>
          ) : (
            /* REGISTER FORM */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              {/* STUDENT REGISTRATION */}
              {selectedRole === 'STUDENT' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Full Student Name</label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                        <input
                          type="text"
                          required
                          value={regStudentName}
                          onChange={e => setRegStudentName(e.target.value)}
                          placeholder="শিক্ষার্থীর পুরো নাম লিখুন"
                          className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Roll / Student ID</label>
                      <div className="relative">
                        <Award className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                        <input
                          type="text"
                          required
                          value={regRollNumber}
                          onChange={e => setRegRollNumber(e.target.value)}
                          placeholder="রোল বা আইডি নম্বর"
                          className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Department</label>
                      <select
                        value={regStudentDept}
                        onChange={e => setRegStudentDept(e.target.value)}
                        className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                      >
                        {departments.map(d => (
                          <option key={d.id} value={d.name}>{d.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Semester</label>
                      <select
                        value={regSemester}
                        onChange={e => setRegSemester(e.target.value)}
                        className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
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
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Student Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                      <input
                        type="email"
                        required
                        value={regStudentEmail}
                        onChange={e => setRegStudentEmail(e.target.value)}
                        placeholder="e.g. alex.rivera@student.campus.edu"
                        className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
                      <input
                        type="password"
                        required
                        value={regStudentPass}
                        onChange={e => setRegStudentPass(e.target.value)}
                        placeholder="Create password"
                        className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Confirm Password</label>
                      <input
                        type="password"
                        required
                        value={regStudentConfirmPass}
                        onChange={e => setRegStudentConfirmPass(e.target.value)}
                        placeholder="Confirm password"
                        className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* TEACHER REGISTRATION */}
              {selectedRole === 'TEACHER' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Faculty Name</label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                        <input
                          type="text"
                          required
                          value={regTeacherName}
                          onChange={e => setRegTeacherName(e.target.value)}
                          placeholder="শিক্ষকের পুরো নাম লিখুন"
                          className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Designation</label>
                      <select
                        value={regDesignation}
                        onChange={e => setRegDesignation(e.target.value)}
                        className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                      >
                        <option value="Professor & Head">Professor & Head</option>
                        <option value="Associate Professor">Associate Professor</option>
                        <option value="Assistant Professor">Assistant Professor</option>
                        <option value="Senior Lecturer">Senior Lecturer</option>
                        <option value="Lecturer">Lecturer</option>
                        <option value="Junior Instructor">Junior Instructor</option>
                        <option value="Instructor">Instructor</option>
                        <option value="Chief Instructor">Chief Instructor</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Academic Department</label>
                      <select
                        value={regTeacherDept}
                        onChange={e => setRegTeacherDept(e.target.value)}
                        className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                      >
                        {departments.map(d => (
                          <option key={d.id} value={d.name}>{d.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                        <input
                          type="text"
                          value={regTeacherPhone}
                          onChange={e => setRegTeacherPhone(e.target.value)}
                          placeholder="মোবাইল নম্বর লিখুন"
                          className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Academic Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                      <input
                        type="email"
                        required
                        value={regTeacherEmail}
                        onChange={e => setRegTeacherEmail(e.target.value)}
                        placeholder="শিক্ষকের ইমেইল এড্রেস লিখুন"
                        className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
                      <input
                        type="password"
                        required
                        value={regTeacherPass}
                        onChange={e => setRegTeacherPass(e.target.value)}
                        placeholder="পাসওয়ার্ড দিন"
                        className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Confirm Password</label>
                      <input
                        type="password"
                        required
                        value={regTeacherConfirmPass}
                        onChange={e => setRegTeacherConfirmPass(e.target.value)}
                        placeholder="পাসওয়ার্ড নিশ্চিত করুন"
                        className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* HOD REGISTRATION */}
              {selectedRole === 'HOD' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Head of Department (HOD) Name</label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                      <input
                        type="text"
                        required
                        value={regHodName}
                        onChange={e => setRegHodName(e.target.value)}
                        placeholder="বিভাগীয় প্রধানের নাম লিখুন"
                        className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Department</label>
                      <select
                        value={regHodDept}
                        onChange={e => setRegHodDept(e.target.value)}
                        className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                      >
                        {departments.map(d => (
                          <option key={d.id} value={d.name}>{d.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">HOD Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                        <input
                          type="email"
                          required
                          value={regHodEmail}
                          onChange={e => setRegHodEmail(e.target.value)}
                          placeholder="ইমেইল এড্রেস লিখুন"
                          className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
                      <input
                        type="password"
                        required
                        value={regHodPass}
                        onChange={e => setRegHodPass(e.target.value)}
                        placeholder="পাসওয়ার্ড দিন"
                        className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Confirm Password</label>
                      <input
                        type="password"
                        required
                        value={regHodConfirmPass}
                        onChange={e => setRegHodConfirmPass(e.target.value)}
                        placeholder="পাসওয়ার্ড নিশ্চিত করুন"
                        className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* PRINCIPAL REGISTRATION */}
              {selectedRole === 'PRINCIPAL' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      {language === 'BN' ? 'অধ্যক্ষ মহোদয়ের নাম' : 'Principal Full Name'}
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                      <input
                        type="text"
                        required
                        value={regPrincipalName}
                        onChange={e => setRegPrincipalName(e.target.value)}
                        placeholder="e.g. Prof. Dr. M. A. Rahman"
                        className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      {language === 'BN' ? 'অফিসিয়াল প্রশাসনিক ইমেইল' : 'Official Executive Email'}
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                      <input
                        type="email"
                        required
                        value={regPrincipalEmail}
                        onChange={e => setRegPrincipalEmail(e.target.value)}
                        placeholder="principal@educampus.ac.bd"
                        className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      {language === 'BN' ? 'অফিসিয়াল যোগাযোগ নম্বর' : 'Official Contact Number'}
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                      <input
                        type="tel"
                        value={regPrincipalPhone}
                        onChange={e => setRegPrincipalPhone(e.target.value)}
                        placeholder="+880 1711-000000"
                        className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">{language === 'BN' ? 'পাসওয়ার্ড' : 'Password'}</label>
                      <input
                        type="password"
                        required
                        value={regPrincipalPass}
                        onChange={e => setRegPrincipalPass(e.target.value)}
                        placeholder="পাসওয়ার্ড দিন"
                        className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">{language === 'BN' ? 'পাসওয়ার্ড নিশ্চিত করুন' : 'Confirm Password'}</label>
                      <input
                        type="password"
                        required
                        value={regPrincipalConfirmPass}
                        onChange={e => setRegPrincipalConfirmPass(e.target.value)}
                        placeholder="পাসওয়ার্ড নিশ্চিত করুন"
                        className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* ADMIN REGISTRATION */}
              {selectedRole === 'ADMIN' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      {language === 'BN' ? 'মাস্টার সিস্টেম অ্যাডমিন নাম' : 'Master System Admin Name'}
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                      <input
                        type="text"
                        required
                        value={regAdminName}
                        onChange={e => setRegAdminName(e.target.value)}
                        placeholder="e.g. Master SysAdmin"
                        className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      {language === 'BN' ? 'অ্যাডমিন সিকিউরিটি ইমেইল' : 'Master Admin Email'}
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                      <input
                        type="email"
                        required
                        value={regAdminEmail}
                        onChange={e => setRegAdminEmail(e.target.value)}
                        placeholder="admin@educampus.ac.bd"
                        className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      {language === 'BN' ? 'মাস্টার এনক্রিপশন / অথরাইজেশন কী' : 'Master Authorization Key'}
                    </label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                      <input
                        type="text"
                        required
                        value={regAdminKey}
                        onChange={e => setRegAdminKey(e.target.value)}
                        placeholder="e.g. ADMIN123 or ROOT2026"
                        className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">{language === 'BN' ? 'পাসওয়ার্ড' : 'Password'}</label>
                      <input
                        type="password"
                        required
                        value={regAdminPass}
                        onChange={e => setRegAdminPass(e.target.value)}
                        placeholder="পাসওয়ার্ড দিন"
                        className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">{language === 'BN' ? 'পাসওয়ার্ড নিশ্চিত করুন' : 'Confirm Password'}</label>
                      <input
                        type="password"
                        required
                        value={regAdminConfirmPass}
                        onChange={e => setRegAdminConfirmPass(e.target.value)}
                        placeholder="পাসওয়ার্ড নিশ্চিত করুন"
                        className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </>
              )}

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-white transition shadow-lg mt-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 shadow-indigo-600/30"
              >
                <span>{language === 'BN' ? 'অ্যাকাউন্ট নিবন্ধন সম্পন্ন করুন' : 'Register Account & Enter Campus App'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}

          {/* Real Storage & Database Notice */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 text-slate-300">
              <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
              {language === 'BN' 
                ? 'রিয়েল-টাইম লোকাল স্টোরেজ ও ক্লাউড ডাটাবেজ ইন্টিগ্রেশন' 
                : 'Real-time LocalStorage & Cloud SQL Integration'}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400">
                {language === 'BN' 
                  ? 'সকল যোগকৃত তথ্য স্বয়ংক্রিয়ভাবে সংরক্ষিত থাকে' 
                  : 'All added profiles & records are permanently saved'}
              </span>
              {(identifier || password) && (
                <button
                  type="button"
                  onClick={clearFormFields}
                  className="text-indigo-400 hover:text-indigo-300 underline font-semibold transition text-xs shrink-0 ml-1"
                >
                  {language === 'BN' ? 'ফর্ম ক্লিয়ার করুন' : 'Clear Form'}
                </button>
              )}
            </div>
          </div>
        </div>
        </>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-4 text-center text-xs text-slate-500 border-t border-slate-800/60 bg-slate-950/80">
        © 2026 EduCampus Management Systems. All rights reserved. Encrypted & Secure Portal.
      </footer>
    </div>
  );
};
