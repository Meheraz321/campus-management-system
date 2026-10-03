import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserAvatar } from '../common/UserAvatar';
import { UserCheck, Save, Sparkles, Mail, Phone, MapPin, Award } from 'lucide-react';

export const TeacherProfile: React.FC = () => {
  const { currentTeacher, updateTeacher, language } = useApp();
  const isBN = language === 'BN';

  const [form, setForm] = useState({
    name: currentTeacher.name,
    email: currentTeacher.email,
    designation: currentTeacher.designation,
    department: currentTeacher.department,
    phone: currentTeacher.phone,
    officeRoom: currentTeacher.officeRoom,
    qualification: currentTeacher.qualification,
    officeHours: currentTeacher.officeHours,
    biography: currentTeacher.biography
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateTeacher({
      ...currentTeacher,
      ...form
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
          {isBN ? 'শিক্ষক প্রোফাইল তথ্য' : 'Faculty Personal Profile'}
        </h1>
        <p className="text-xs text-slate-500">
          {isBN 
            ? 'যোগাযোগের তথ্য, গবেষণা বা বায়োগ্রাফি এবং কনসালটেশন সময়সূচী আপডেট করুন।' 
            : 'Update contact details, research biography, and student consulting office hours.'}
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-4 border-b border-slate-100 pb-5 dark:border-slate-800">
          <UserAvatar
            src={currentTeacher.avatar}
            name={currentTeacher.name}
            size="xl"
          />
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {currentTeacher.name}
            </h2>
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              {currentTeacher.designation}
            </div>
            <div className="text-xs text-slate-400">{currentTeacher.department}</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                {isBN ? 'নাম' : 'Name'}
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="mt-1 w-full rounded-xl border p-2.5 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                {isBN ? 'ইমেইল' : 'Email'}
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="mt-1 w-full rounded-xl border p-2.5 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                {isBN ? 'মোবাইল' : 'Phone'}
              </label>
              <input
                type="text"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                className="mt-1 w-full rounded-xl border p-2.5 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                {isBN ? 'অফিস রুম' : 'Office Room'}
              </label>
              <input
                type="text"
                value={form.officeRoom}
                onChange={e => setForm({ ...form, officeRoom: e.target.value })}
                className="mt-1 w-full rounded-xl border p-2.5 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              {isBN ? 'অফিস কনসালটেশন সময়' : 'Office Hours'}
            </label>
            <input
              type="text"
              value={form.officeHours}
              onChange={e => setForm({ ...form, officeHours: e.target.value })}
              className="mt-1 w-full rounded-xl border p-2.5 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              {isBN ? 'শিক্ষাগত যোগ্যতা' : 'Qualifications'}
            </label>
            <input
              type="text"
              value={form.qualification}
              onChange={e => setForm({ ...form, qualification: e.target.value })}
              className="mt-1 w-full rounded-xl border p-2.5 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              {isBN ? 'সংক্ষিপ্ত বায়োগ্রাফি ও গবেষণা ক্ষেত্র' : 'Biography & Research Interests'}
            </label>
            <textarea
              rows={3}
              value={form.biography}
              onChange={e => setForm({ ...form, biography: e.target.value })}
              className="mt-1 w-full rounded-xl border p-2.5 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {savedSuccess && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              <Sparkles className="h-4 w-4" />
              <span>{isBN ? 'শিক্ষকের প্রোফাইল তথ্য সফলভাবে সংরক্ষিত হয়েছে!' : 'Faculty profile details updated!'}</span>
            </div>
          )}

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-xs font-semibold text-white shadow-lg shadow-emerald-600/25 hover:bg-emerald-700 transition-colors cursor-pointer"
          >
            <Save className="h-4 w-4" />
            <span>{isBN ? 'প্রোফাইল সংরক্ষণ করুন' : 'Save Profile'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
