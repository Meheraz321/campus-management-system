import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RegisteredUser } from '../../types';
import { UserAvatar } from '../common/UserAvatar';
import {
  Database,
  Search,
  FileSpreadsheet,
  FileText,
  Printer,
  Trash2,
  UserCheck,
  GraduationCap,
  Shield,
  Award,
  Calendar,
  Mail,
  Filter,
  Eye,
  CheckCircle2,
  QrCode,
  Copy,
  X,
  Smartphone,
  Layers,
  Building,
  Hash,
  Sparkles
} from 'lucide-react';

export const RegisteredUsersView: React.FC = () => {
  const {
    registeredUsers,
    deleteRegisteredUser,
    exportUsersExcel,
    exportUsersPDF,
    downloadSlipPDF
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [selectedUserForSlip, setSelectedUserForSlip] = useState<RegisteredUser | null>(null);
  const [userToDelete, setUserToDelete] = useState<RegisteredUser | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredUsers = registeredUsers.filter(user => {
    const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      user.name.toLowerCase().includes(q) ||
      user.email.toLowerCase().includes(q) ||
      user.identifier.toLowerCase().includes(q) ||
      (user.department && user.department.toLowerCase().includes(q)) ||
      (user.phone && user.phone.includes(q));
    return matchesRole && matchesQuery;
  });

  const totalCount = registeredUsers.length;
  const studentCount = registeredUsers.filter(u => u.role === 'STUDENT').length;
  const hodCount = registeredUsers.filter(u => u.role === 'HOD').length;
  const teacherCount = registeredUsers.filter(u => u.role === 'TEACHER').length;
  const adminCount = registeredUsers.filter(u => u.role === 'ADMIN').length;

  const handleCopyDetails = (user: RegisteredUser) => {
    const text = `Academia OS Registration Record:
Name: ${user.name}
Role: ${user.role}
ID/Roll: ${user.identifier}
Email: ${user.email}
Department: ${user.department || 'N/A'}
Designation/Semester: ${user.semester || user.designation || 'N/A'}
Phone: ${user.phone || 'N/A'}
Registered: ${user.registeredAt}`;
    
    navigator.clipboard.writeText(text);
    setCopiedId(user.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'STUDENT':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            <GraduationCap className="h-3.5 w-3.5" />
            শিক্ষার্থী (Student)
          </span>
        );
      case 'HOD':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1 text-xs font-bold text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
            <Award className="h-3.5 w-3.5" />
            বিভাগীয় প্রধান (HOD)
          </span>
        );
      case 'TEACHER':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <UserCheck className="h-3.5 w-3.5" />
            শিক্ষক অনুষদ (Teacher)
          </span>
        );
      case 'ADMIN':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <Shield className="h-3.5 w-3.5" />
            অধ্যক্ষ / অ্যাডমিন
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            {role}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white shadow-xl border border-slate-800">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 px-3.5 py-1 text-xs font-bold text-indigo-300 border border-indigo-500/30">
              <Database className="h-3.5 w-3.5 text-indigo-400" />
              Central Dynamic Database & Exports
            </div>
            <h1 className="mt-2 text-2xl font-black tracking-tight flex items-center gap-2">
              নিবন্ধিত ইউজার ডাটাবেজ ও এক্সপোর্ট
              <span className="rounded-xl bg-indigo-600/80 px-2.5 py-0.5 text-xs font-bold text-white">
                {totalCount} টি রেকর্ড
              </span>
            </h1>
            <p className="mt-1 text-xs text-slate-300 max-w-2xl leading-relaxed">
              সেন্ট্রাল ডাটাবেজে সংরক্ষিত সকল শিক্ষার্থী, শিক্ষক, বিভাগীয় প্রধান (HOD) ও অধ্যক্ষের লাইভ রেকর্ড। যেকোনো ইউজারের অফিসিয়াল ভেরিফাইড রেজিস্ট্রেশন রশিদ প্রিন্ট বা সম্পূর্ণ তালিকা এক্সপোর্ট করুন।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={exportUsersExcel}
              className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
              title="সম্পূর্ণ ডাটাবেজ এক্সেল (.xlsx) ফাইলে ডাউনলোড করুন"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Excel এক্সপোর্ট (.xlsx)
            </button>
            <button
              type="button"
              onClick={exportUsersPDF}
              className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
              title="সম্পূর্ণ ডাটাবেজ তালিকা প্রিন্ট বা PDF হিসেবে সেভ করুন"
            >
              <Printer className="h-4 w-4" />
              PDF / প্রিন্ট রিপোর্ট
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>সর্বমোট রেকর্ড</span>
            <Database className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{totalCount}</div>
          <div className="mt-1 text-[11px] text-slate-400">সক্রিয় অ্যাকাউন্ট</div>
        </div>

        <div className="rounded-2xl border border-indigo-200/60 bg-indigo-50/40 p-4 shadow-sm dark:border-indigo-900/40 dark:bg-indigo-950/20">
          <div className="flex items-center justify-between text-xs font-semibold text-indigo-700 dark:text-indigo-400">
            <span>শিক্ষার্থী</span>
            <GraduationCap className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-indigo-900 dark:text-indigo-200">{studentCount}</div>
          <div className="mt-1 text-[11px] text-indigo-600/80 dark:text-indigo-400">স্টুডেন্ট রেকর্ডস</div>
        </div>

        <div className="rounded-2xl border border-purple-200/60 bg-purple-50/40 p-4 shadow-sm dark:border-purple-900/40 dark:bg-purple-950/20">
          <div className="flex items-center justify-between text-xs font-semibold text-purple-700 dark:text-purple-400">
            <span>বিভাগীয় প্রধান</span>
            <Award className="h-4 w-4 text-purple-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-purple-900 dark:text-purple-200">{hodCount}</div>
          <div className="mt-1 text-[11px] text-purple-600/80 dark:text-purple-400">HOD অনুষদ</div>
        </div>

        <div className="rounded-2xl border border-emerald-200/60 bg-emerald-50/40 p-4 shadow-sm dark:border-emerald-900/40 dark:bg-emerald-950/20">
          <div className="flex items-center justify-between text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            <span>শিক্ষক অনুষদ</span>
            <UserCheck className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-900 dark:text-emerald-200">{teacherCount}</div>
          <div className="mt-1 text-[11px] text-emerald-600/80 dark:text-emerald-400">টেক ও সাধারণ শিক্ষক</div>
        </div>

        <div className="rounded-2xl border border-amber-200/60 bg-amber-50/40 p-4 shadow-sm dark:border-amber-900/40 dark:bg-amber-950/20">
          <div className="flex items-center justify-between text-xs font-semibold text-amber-700 dark:text-amber-400">
            <span>অধ্যক্ষ / অ্যাডমিন</span>
            <Shield className="h-4 w-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-amber-900 dark:text-amber-200">{adminCount}</div>
          <div className="mt-1 text-[11px] text-amber-600/80 dark:text-amber-400">প্রশাসন অ্যাকাউন্ট</div>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="নাম, ইমেইল, রোল নম্বর, বিভাগ বা মোবাইল নম্বর দিয়ে খুঁজুন..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <Filter className="h-4 w-4 text-slate-400 shrink-0" />
          {[
            { id: 'ALL', label: `সকল (${totalCount})` },
            { id: 'STUDENT', label: `শিক্ষার্থী (${studentCount})` },
            { id: 'HOD', label: `HOD (${hodCount})` },
            { id: 'TEACHER', label: `শিক্ষক (${teacherCount})` },
            { id: 'ADMIN', label: `অ্যাডমিন (${adminCount})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setRoleFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                roleFilter === tab.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Users Database Table */}
      <div className="rounded-3xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-4">ইউজার ও প্রোফাইল</th>
                <th className="px-5 py-4">ভূমিকা / Role</th>
                <th className="px-5 py-4">লগইন আইডি / রোল</th>
                <th className="px-5 py-4">বিভাগ ও পদবি / সেমিস্টার</th>
                <th className="px-5 py-4">রেজিস্ট্রেশন তারিখ</th>
                <th className="px-5 py-4 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                    <Database className="h-10 w-10 mx-auto mb-2 text-slate-300 dark:text-slate-700 opacity-60" />
                    কোনো নিবন্ধিত অ্যাকাউন্ট পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors group"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <UserAvatar
                          src={user.avatar}
                          name={user.name}
                          size="md"
                        />
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white text-sm">
                            {user.name}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                            <Mail className="h-3 w-3 text-slate-400" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-3.5">
                      {getRoleBadge(user.role)}
                    </td>

                    <td className="px-5 py-3.5">
                      <div className="font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-lg inline-block border border-indigo-200/60 dark:border-indigo-900/60">
                        {user.identifier}
                      </div>
                      {user.phone && (
                        <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-1 font-mono">
                          <Smartphone className="h-2.5 w-2.5" />
                          {user.phone}
                        </div>
                      )}
                    </td>

                    <td className="px-5 py-3.5 text-slate-700 dark:text-slate-300">
                      <div className="font-semibold">{user.department || 'N/A'}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {user.semester ? `সেমিস্টার: ${user.semester}` : user.designation || 'Faculty Member'}
                      </div>
                    </td>

                    <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        {user.registeredAt}
                      </div>
                      <div className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                        <CheckCircle2 className="h-3 w-3" /> ডাটাবেজ ভেরিফাইড
                      </div>
                    </td>

                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedUserForSlip(user)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300 font-bold transition border border-indigo-200/60 dark:border-indigo-800"
                          title="রেজিস্ট্রেশন স্লিপ দেখুন ও প্রিন্ট করুন"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>স্লিপ দেখুন</span>
                        </button>
                        
                        <button
                          onClick={() => downloadSlipPDF(user)}
                          className="p-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 transition"
                          title="সরাসরি প্রিন্ট / PDF স্লিপ ওপেন করুন"
                        >
                          <Printer className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => handleCopyDetails(user)}
                          className="p-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 transition"
                          title="ইউজার তথ্য কপি করুন"
                        >
                          <Copy className="h-4 w-4 text-slate-500" />
                        </button>

                        <button
                          onClick={() => setUserToDelete(user)}
                          className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                          title="অ্যাকাউন্ট রেকর্ড মুছুন"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Copy Toast Indicator */}
      {copiedId && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-xs font-bold text-white shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          ইউজার রেজিস্ট্রেশন তথ্য ক্লিপবোর্ডে কপি করা হয়েছে!
        </div>
      )}

      {/* Interactive Official Registration Slip Modal */}
      {selectedUserForSlip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    অফিসিয়াল রেজিস্ট্রেশন সনদ ও রশিদ (Slip Preview)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    সেন্ট্রাল ডাটাবেজ দ্বারা সত্যায়িত অফিসিয়াল ভেরিফিকেশন রেকর্ড
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedUserForSlip(null)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Printable Card Preview Container */}
            <div className="mt-5 space-y-4 rounded-2xl border border-indigo-100 bg-gradient-to-b from-indigo-50/40 to-white p-5 dark:border-indigo-900/40 dark:from-slate-950 dark:to-slate-900 shadow-inner">
              {/* Slip Top Header */}
              <div className="rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-900 p-4 text-white shadow-md flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-extrabold uppercase tracking-widest text-indigo-200">
                    ACADEMIA OS - CAMPUS MANAGEMENT
                  </div>
                  <div className="text-base font-black">
                    OFFICIAL REGISTRATION ACKNOWLEDGMENT SLIP
                  </div>
                  <div className="text-[11px] text-indigo-200">
                    কেন্দ্রীয় ডাটাবেজ ভেরিফাইড নিবন্ধন রশিদ
                  </div>
                </div>
                <div className="rounded-full bg-white/20 px-3 py-1 text-[11px] font-bold tracking-wider text-white border border-white/30 uppercase">
                  VERIFIED
                </div>
              </div>

              {/* User Profile Card */}
              <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                <UserAvatar
                  src={selectedUserForSlip.avatar}
                  name={selectedUserForSlip.name}
                  size="xl"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-lg font-black text-slate-900 dark:text-white">
                      {selectedUserForSlip.name}
                    </h4>
                    {getRoleBadge(selectedUserForSlip.role)}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      ID: {selectedUserForSlip.identifier}
                    </span>
                    <span>•</span>
                    <span>{selectedUserForSlip.email}</span>
                  </div>
                </div>
              </div>

              {/* Details Key-Value Table */}
              <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden dark:border-slate-800 dark:bg-slate-900 text-xs">
                <div className="bg-slate-50 px-4 py-2.5 font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                  <span>ACCOUNT REGISTRATION DETAILS (DATABASE RECORDED)</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                    STATUS: ACTIVE
                  </span>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  <div className="flex p-3">
                    <span className="w-1/3 font-semibold text-slate-500">পূর্ণ নাম (Full Name):</span>
                    <span className="w-2/3 font-bold text-slate-900 dark:text-white">
                      {selectedUserForSlip.name}
                    </span>
                  </div>
                  <div className="flex p-3 bg-slate-50/50 dark:bg-slate-800/30">
                    <span className="w-1/3 font-semibold text-slate-500">ব্যবহারকারী ভূমিকা:</span>
                    <span className="w-2/3 font-bold text-indigo-600 dark:text-indigo-400">
                      {selectedUserForSlip.role}
                    </span>
                  </div>
                  <div className="flex p-3">
                    <span className="w-1/3 font-semibold text-slate-500">আইডি / রোল নম্বর:</span>
                    <span className="w-2/3 font-mono font-bold text-slate-900 dark:text-white">
                      {selectedUserForSlip.identifier}
                    </span>
                  </div>
                  <div className="flex p-3 bg-slate-50/50 dark:bg-slate-800/30">
                    <span className="w-1/3 font-semibold text-slate-500">ইমেইল এড্রেস:</span>
                    <span className="w-2/3 font-semibold text-slate-800 dark:text-slate-200">
                      {selectedUserForSlip.email}
                    </span>
                  </div>
                  <div className="flex p-3">
                    <span className="w-1/3 font-semibold text-slate-500">বিভাগ (Department):</span>
                    <span className="w-2/3 font-semibold text-slate-800 dark:text-slate-200">
                      {selectedUserForSlip.department || 'N/A'}
                    </span>
                  </div>
                  <div className="flex p-3 bg-slate-50/50 dark:bg-slate-800/30">
                    <span className="w-1/3 font-semibold text-slate-500">পদবি / সেমিস্টার:</span>
                    <span className="w-2/3 font-semibold text-slate-800 dark:text-slate-200">
                      {selectedUserForSlip.semester
                        ? `সেমিস্টার: ${selectedUserForSlip.semester}`
                        : selectedUserForSlip.designation || 'Staff / Faculty'}
                    </span>
                  </div>
                  <div className="flex p-3">
                    <span className="w-1/3 font-semibold text-slate-500">মোবাইল ফোন নম্বর:</span>
                    <span className="w-2/3 font-mono text-slate-800 dark:text-slate-200">
                      {selectedUserForSlip.phone || 'N/A'}
                    </span>
                  </div>
                  <div className="flex p-3 bg-slate-50/50 dark:bg-slate-800/30">
                    <span className="w-1/3 font-semibold text-slate-500">নিবন্ধনের সময়:</span>
                    <span className="w-2/3 text-slate-700 dark:text-slate-300">
                      {selectedUserForSlip.registeredAt}
                    </span>
                  </div>
                  <div className="flex p-3">
                    <span className="w-1/3 font-semibold text-slate-500">ডাটাবেজ স্ট্যাটাস:</span>
                    <span className="w-2/3 font-bold text-emerald-600 dark:text-emerald-400">
                      ✓ ACTIVE & VERIFIED IN CENTRAL DATABASE
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Verification Seal */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500">
                <div className="flex items-center gap-2">
                  <QrCode className="h-5 w-5 text-indigo-600" />
                  <span>ইলেক্ট্রনিকভাবে তৈরি ও সিকিউরলি ভেরিফাইড ডকুমেন্ট।</span>
                </div>
                <div className="font-bold text-slate-800 dark:text-slate-200">
                  অধ্যক্ষ / রেজিস্ট্রার কার্যালয়
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => handleCopyDetails(selectedUserForSlip)}
                className="flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              >
                <Copy className="h-4 w-4" />
                তথ্য কপি করুন
              </button>

              <button
                type="button"
                onClick={() => {
                  downloadSlipPDF(selectedUserForSlip);
                }}
                className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all active:scale-95"
              >
                <Printer className="h-4 w-4" />
                রশিদ প্রিন্ট / PDF ডাউনলোড করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 mx-auto mb-4">
              <Trash2 className="h-6 w-6" />
            </div>

            <h3 className="text-center text-lg font-bold text-slate-900 dark:text-white">
              রেকর্ড মুছে ফেলতে নিশ্চিত?
            </h3>
            <p className="mt-2 text-center text-xs text-slate-500 dark:text-slate-400">
              আপনি কি নিশ্চিতভাবে <span className="font-bold text-slate-800 dark:text-slate-200">"{userToDelete.name}"</span> ({userToDelete.identifier}) এর ডাটাবেজ রেকর্ড ডিলিট করতে চান?
            </p>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="flex-1 rounded-2xl bg-slate-100 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteRegisteredUser(userToDelete.id);
                  setUserToDelete(null);
                }}
                className="flex-1 rounded-2xl bg-rose-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-rose-600/30 hover:bg-rose-700"
              >
                হ্যাঁ, মুছে ফেলুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
