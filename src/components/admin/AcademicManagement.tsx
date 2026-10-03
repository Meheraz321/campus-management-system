import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BookOpen, Cpu, Zap, Briefcase, Settings, Plus, Clock, MapPin, X } from 'lucide-react';

export const AcademicManagement: React.FC = () => {
  const { departments, subjects, routines, addRoutineItem, language } = useApp();
  const isBN = language === 'BN';
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [routineForm, setRoutineForm] = useState({
    day: 'Monday' as const,
    timeSlot: '10:00 AM - 11:30 AM',
    subjectCode: 'CSE-301',
    subjectName: 'Data Structures & Algorithms',
    teacherName: 'Prof. Sarah Jenkins',
    roomNumber: 'Room 304',
    department: 'Computer Science & Engineering',
    semester: 'Semester 5',
    section: 'A'
  });

  const handleAddRoutine = (e: React.FormEvent) => {
    e.preventDefault();
    addRoutineItem(routineForm);
    setIsModalOpen(false);
  };

  const dayLabels: { [key: string]: string } = {
    Monday: isBN ? 'সোমবার' : 'Monday',
    Tuesday: isBN ? 'মঙ্গলবার' : 'Tuesday',
    Wednesday: isBN ? 'বুধবার' : 'Wednesday',
    Thursday: isBN ? 'বৃহস্পতিবার' : 'Thursday',
    Friday: isBN ? 'শুক্রবার' : 'Friday',
    Saturday: isBN ? 'শনিবার' : 'Saturday',
    Sunday: isBN ? 'রবিবার' : 'Sunday'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
            {isBN ? 'একাডেমিক কাঠামো ও ক্লাস রুটিন' : 'Academic Architecture & Routines'}
          </h1>
          <p className="text-xs text-slate-500">
            {isBN 
              ? 'ডিপার্টমেন্ট, বিষয়সমূহ, ক্রেডিট বরাদ্দ এবং কেন্দ্রীয় সাপ্তাহিক ক্লাস রুটিন পরিচালনা।'
              : 'Departments, subjects, credit allocations, and master timetable schedules.'}
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          {isBN ? 'ক্লাস রুটিন যুক্ত করুন' : 'Schedule Class Routine'}
        </button>
      </div>

      {/* Departments Grid */}
      <div>
        <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
          {isBN ? `সক্রিয় ক্যাম্পাস বিভাগসমূহ (${departments.length})` : `Active Campus Departments (${departments.length})`}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {departments.map(dept => (
            <div
              key={dept.id}
              className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-xl bg-indigo-100 px-2.5 py-1 text-xs font-mono font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  {dept.code}
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  {dept.totalStudents} {isBN ? 'শিক্ষার্থী' : 'Students'}
                </span>
              </div>

              <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">
                {dept.name}
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                {isBN ? 'বিভাগীয় প্রধান: ' : 'Head of Dept: '}{dept.headName}
              </p>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-medium text-slate-600 dark:border-slate-800 dark:text-slate-300">
                <span>{dept.totalTeachers} {isBN ? 'শিক্ষক' : 'Faculty Staff'}</span>
                <span>{dept.coursesCount} {isBN ? 'কোর্স' : 'Active Courses'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Routine Timetable Grid */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              {isBN ? 'সাপ্তাহিক মাস্টার রুটিন' : 'Master Weekly Timetable'}
            </h2>
            <p className="text-[11px] text-slate-400">
              {isBN ? 'নির্ধারিত ক্লাস স্লটসমূহ' : 'Scheduled Routine Slots'}
            </p>
          </div>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            {routines.length} {isBN ? 'ক্লাস অন্তর্ভুক্ত' : 'Classes Timetabled'}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {routines.map(rt => (
            <div
              key={rt.id}
              className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3.5 dark:border-slate-800/80 dark:bg-slate-800/40"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-indigo-600 px-2 py-0.5 text-[10px] font-bold text-white">
                  {dayLabels[rt.day] || rt.day}
                </span>
                <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {rt.timeSlot}
                </span>
              </div>

              <div className="mt-2.5 font-bold text-xs text-slate-900 dark:text-white">
                {rt.subjectCode}: {rt.subjectName}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                {isBN ? 'শিক্ষক: ' : 'Instructor: '}{rt.teacherName}
              </div>

              <div className="mt-2 flex items-center justify-between text-[10px] font-semibold text-slate-400 border-t border-slate-200/60 pt-2 dark:border-slate-700/60">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-indigo-500" /> {rt.roomNumber}
                </span>
                <span>
                  {rt.semester} ({rt.section})
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Routine Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 rounded-full bg-slate-100 p-1.5 text-slate-400 hover:bg-slate-200 dark:bg-slate-800"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {isBN ? 'নতুন ক্লাস রুটিন যুক্ত করুন' : 'Schedule New Class Routine Slot'}
            </h3>

            <form onSubmit={handleAddRoutine} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  {isBN ? 'সপ্তাহের দিন' : 'Day of Week'}
                </label>
                <select
                  value={routineForm.day}
                  onChange={e => setRoutineForm({ ...routineForm, day: e.target.value as any })}
                  className="mt-1 w-full rounded-xl border p-2.5 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="Monday">{isBN ? 'সোমবার' : 'Monday'}</option>
                  <option value="Tuesday">{isBN ? 'মঙ্গলবার' : 'Tuesday'}</option>
                  <option value="Wednesday">{isBN ? 'বুধবার' : 'Wednesday'}</option>
                  <option value="Thursday">{isBN ? 'বৃহস্পতিবার' : 'Thursday'}</option>
                  <option value="Friday">{isBN ? 'শুক্রবার' : 'Friday'}</option>
                  <option value="Saturday">{isBN ? 'শনিবার' : 'Saturday'}</option>
                  <option value="Sunday">{isBN ? 'রবিবার' : 'Sunday'}</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  {isBN ? 'সময়সূচী (Time Slot)' : 'Time Slot'}
                </label>
                <input
                  type="text"
                  required
                  value={routineForm.timeSlot}
                  onChange={e => setRoutineForm({ ...routineForm, timeSlot: e.target.value })}
                  className="mt-1 w-full rounded-xl border p-2.5 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  {isBN ? 'বিষয় কোড ও নাম' : 'Subject Code & Name'}
                </label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  <input
                    type="text"
                    required
                    placeholder="e.g. CSE-301"
                    value={routineForm.subjectCode}
                    onChange={e => setRoutineForm({ ...routineForm, subjectCode: e.target.value })}
                    className="rounded-xl border p-2.5 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Database Systems"
                    value={routineForm.subjectName}
                    onChange={e => setRoutineForm({ ...routineForm, subjectName: e.target.value })}
                    className="col-span-2 rounded-xl border p-2.5 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  {isBN ? 'শিক্ষকের নাম' : 'Teacher Name'}
                </label>
                <input
                  type="text"
                  required
                  value={routineForm.teacherName}
                  onChange={e => setRoutineForm({ ...routineForm, teacherName: e.target.value })}
                  className="mt-1 w-full rounded-xl border p-2.5 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    {isBN ? 'রুম নম্বর' : 'Room Number'}
                  </label>
                  <input
                    type="text"
                    required
                    value={routineForm.roomNumber}
                    onChange={e => setRoutineForm({ ...routineForm, roomNumber: e.target.value })}
                    className="mt-1 w-full rounded-xl border p-2.5 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    {isBN ? 'সেকশন' : 'Section'}
                  </label>
                  <input
                    type="text"
                    required
                    value={routineForm.section}
                    onChange={e => setRoutineForm({ ...routineForm, section: e.target.value })}
                    className="mt-1 w-full rounded-xl border p-2.5 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="mt-4 flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/2 rounded-xl border py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300"
                >
                  {isBN ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="w-1/2 rounded-xl bg-indigo-600 py-2.5 text-xs font-semibold text-white hover:bg-indigo-700"
                >
                  {isBN ? 'রুটিন সংরক্ষণ করুন' : 'Save Routine Slot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
