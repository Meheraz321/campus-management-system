import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserAvatar } from '../common/UserAvatar';
import { CheckCircle2, XCircle, Clock, Calendar, CheckCheck, Save, Sparkles } from 'lucide-react';

export const AttendanceMarker: React.FC = () => {
  const { students, addAttendance, currentTeacher, language } = useApp();
  const isBN = language === 'BN';

  const [selectedSubject, setSelectedSubject] = useState('CSE-301');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceMap, setAttendanceMap] = useState<{ [studentId: string]: 'PRESENT' | 'ABSENT' | 'LATE' }>(
    () => {
      const initial: { [key: string]: 'PRESENT' | 'ABSENT' | 'LATE' } = {};
      students.forEach(s => {
        initial[s.id] = 'PRESENT';
      });
      return initial;
    }
  );

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleStatusChange = (studentId: string, status: 'PRESENT' | 'ABSENT' | 'LATE') => {
    setAttendanceMap(prev => ({ ...prev, [studentId]: status }));
  };

  const markAllPresent = () => {
    const updated: { [key: string]: 'PRESENT' | 'ABSENT' | 'LATE' } = {};
    students.forEach(s => {
      updated[s.id] = 'PRESENT';
    });
    setAttendanceMap(updated);
  };

  const handleSave = () => {
    const records = students.map(s => ({
      studentId: s.id,
      studentName: s.name,
      rollNumber: s.rollNumber,
      subjectCode: selectedSubject,
      date: selectedDate,
      status: attendanceMap[s.id] || 'PRESENT',
      markedByTeacherId: currentTeacher.id
    }));

    addAttendance(records);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const presentCount = Object.values(attendanceMap).filter(v => v === 'PRESENT').length;
  const absentCount = Object.values(attendanceMap).filter(v => v === 'ABSENT').length;
  const lateCount = Object.values(attendanceMap).filter(v => v === 'LATE').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
            {isBN ? 'ক্লাস হাজিরা রেজিস্টার' : 'Class Attendance Register'}
          </h1>
          <p className="text-xs text-slate-500">
            {isBN 
              ? 'নির্ধারিত কোর্স লেকচার ও ল্যাব সেশনের দৈনিক শিক্ষার্থী হাজিরা গ্রহণ করুন।' 
              : 'Mark daily student attendance for assigned course lectures and lab sessions.'}
          </p>
        </div>

        <button
          onClick={markAllPresent}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 cursor-pointer"
        >
          <CheckCheck className="h-4 w-4 text-emerald-500" />
          <span>{isBN ? 'সবাইকে উপস্থিত মার্ক করুন' : 'Mark All Present'}</span>
        </button>
      </div>

      {/* Control Bar */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div>
          <label className="text-[11px] font-bold text-slate-400 uppercase">
            {isBN ? 'কোর্স নির্বাচন' : 'Select Course'}
          </label>
          <select
            value={selectedSubject}
            onChange={e => setSelectedSubject(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-semibold text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            <option value="CSE-301">CSE-301: Data Structures & Algorithms</option>
            <option value="CSE-302">CSE-302: Full Stack Web Development</option>
            <option value="EEE-201">EEE-201: Embedded Systems & IoT</option>
          </select>
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-400 uppercase">
            {isBN ? 'লেকচারের তারিখ' : 'Lecture Date'}
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-semibold text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>

        <div className="flex items-center justify-around rounded-xl bg-slate-50 p-2 dark:bg-slate-800/60">
          <div className="text-center">
            <span className="block text-xs font-bold text-emerald-600">{presentCount}</span>
            <span className="text-[9px] font-semibold text-slate-400">
              {isBN ? 'উপস্থিত' : 'Present'}
            </span>
          </div>
          <div className="text-center">
            <span className="block text-xs font-bold text-rose-500">{absentCount}</span>
            <span className="text-[9px] font-semibold text-slate-400">
              {isBN ? 'অনুপস্থিত' : 'Absent'}
            </span>
          </div>
          <div className="text-center">
            <span className="block text-xs font-bold text-amber-500">{lateCount}</span>
            <span className="text-[9px] font-semibold text-slate-400">
              {isBN ? 'দেরি' : 'Late'}
            </span>
          </div>
        </div>
      </div>

      {/* Student List */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="space-y-3">
          {students.map(st => {
            const currentStatus = attendanceMap[st.id] || 'PRESENT';
            return (
              <div
                key={st.id}
                className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5 transition-all sm:flex-row sm:items-center dark:border-slate-800/80 dark:bg-slate-800/40"
              >
                <div className="flex items-center gap-3">
                  <UserAvatar
                    src={st.avatar}
                    name={st.name}
                    size="sm"
                  />
                  <div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white">{st.name}</div>
                    <div className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400">
                      {st.rollNumber} • {st.semester}
                    </div>
                  </div>
                </div>

                {/* Status Toggle Buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleStatusChange(st.id, 'PRESENT')}
                    className={`flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                      currentStatus === 'PRESENT'
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                        : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>{isBN ? 'উপস্থিত' : 'Present'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStatusChange(st.id, 'ABSENT')}
                    className={`flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                      currentStatus === 'ABSENT'
                        ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                        : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    <XCircle className="h-3.5 w-3.5" />
                    <span>{isBN ? 'অনুপস্থিত' : 'Absent'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStatusChange(st.id, 'LATE')}
                    className={`flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                      currentStatus === 'LATE'
                        ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                        : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    <Clock className="h-3.5 w-3.5" />
                    <span>{isBN ? 'দেরি' : 'Late'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {savedSuccess && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            <Sparkles className="h-4 w-4" />
            <span>{isBN ? 'উপস্থিতির রেকর্ড সফলভাবে সংরক্ষিত হয়েছে!' : 'Attendance record saved to database and synchronized with student portals!'}</span>
          </div>
        )}

        <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handleSave}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-xs font-semibold text-white shadow-lg shadow-emerald-600/25 hover:bg-emerald-700 transition-colors cursor-pointer"
          >
            <Save className="h-4 w-4" />
            <span>{isBN ? 'উপস্থিতি খাতা সংরক্ষণ করুন' : 'Save Attendance Log'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
