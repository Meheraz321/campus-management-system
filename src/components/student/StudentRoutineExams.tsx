import React from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, Clock, MapPin, AlertCircle, FileText } from 'lucide-react';

export const StudentRoutineExams: React.FC = () => {
  const { routines, examSchedules, currentStudent, language } = useApp();
  const isBN = language === 'BN';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
          {isBN ? 'ক্লাস রুটিন ও পরীক্ষার সময়সূচী' : 'Class Routine & Exam Schedule'}
        </h1>
        <p className="text-xs text-slate-500">
          {isBN 
            ? `${currentStudent.semester} (${currentStudent.section}) এর সাপ্তাহিক ক্লাসের সময়সূচি এবং সেমিস্টার পরীক্ষার রুটিন।`
            : `Weekly course timetable for ${currentStudent.semester} (${currentStudent.section}) and official midterm examination schedule.`}
        </p>
      </div>

      {/* Class Routine Grid */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <Clock className="h-4 w-4 text-indigo-600" />
          <span>{isBN ? 'সাপ্তাহিক ক্লাস লেকচার টাইমটেবিল' : 'Weekly Lecture Timetable'}</span>
        </h2>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {routines.map(rt => (
            <div
              key={rt.id}
              className="rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5 dark:border-slate-800 dark:bg-slate-800/40"
            >
              <div className="flex items-center justify-between">
                <span className="rounded bg-indigo-600 px-2 py-0.5 text-[10px] font-bold text-white">
                  {rt.day}
                </span>
                <span className="text-[11px] font-mono text-slate-500">{rt.timeSlot}</span>
              </div>

              <div className="mt-2 text-xs font-bold text-slate-900 dark:text-white">
                {rt.subjectCode}: {rt.subjectName}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                {isBN ? 'শিক্ষক' : 'Instructor'}: {rt.teacherName}
              </div>

              <div className="mt-2 text-[10px] font-semibold text-slate-400 flex items-center gap-1 border-t border-slate-200/60 pt-2 dark:border-slate-700/60">
                <MapPin className="h-3 w-3 text-indigo-500" /> {rt.roomNumber}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Midterm Exam Schedule */}
      <div className="rounded-3xl border border-rose-200/80 bg-rose-50/30 p-5 shadow-sm dark:border-rose-900/40 dark:bg-slate-900">
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle className="h-4 w-4 text-rose-600 dark:text-rose-400" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            {isBN ? 'আসন্ন সেমিস্টার ও মিডটার্ম পরীক্ষার রুটিন' : 'Upcoming Midterm Examinations'}
          </h2>
        </div>

        <div className="space-y-3">
          {examSchedules.map(ex => (
            <div
              key={ex.id}
              className="flex flex-col justify-between gap-2 rounded-2xl border border-rose-100 bg-white p-4 sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-800/60"
            >
              <div>
                <span className="rounded bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-mono">
                  {ex.subjectCode}
                </span>
                <div className="mt-1 text-xs font-bold text-slate-900 dark:text-white">
                  {ex.subjectName}
                </div>
                <div className="text-[11px] text-slate-500">
                  {isBN ? 'পরিদর্শক' : 'Invigilator'}: {ex.invigilator} • {ex.roomNumber}
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400">
                  📅 {ex.date}
                </div>
                <div className="text-[10px] text-slate-400">{ex.timeSlot}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
