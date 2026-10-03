import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AssignmentSubmission } from '../../types';
import { FileText, Plus, CheckCircle2, Clock, Award, X, MessageSquare, Send } from 'lucide-react';

export const AssignmentManager: React.FC = () => {
  const {
    assignments,
    submissions,
    addAssignment,
    gradeSubmission,
    currentTeacher,
    language
  } = useApp();

  const isBN = language === 'BN';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<AssignmentSubmission | null>(null);

  // Assignment Form State
  const [asgForm, setAsgForm] = useState({
    title: '',
    description: '',
    subjectCode: 'CSE-301',
    subjectName: 'Data Structures & Algorithms',
    teacherName: currentTeacher.name,
    teacherId: currentTeacher.id,
    department: 'Computer Science & Engineering',
    semester: 'Semester 5',
    dueDate: '2026-08-10',
    maxMarks: 100,
    attachmentName: 'Assignment_Requirements.pdf',
    attachmentType: 'pdf' as const
  });

  // Grading Form State
  const [gradeMarks, setGradeMarks] = useState(90);
  const [gradeFeedback, setGradeFeedback] = useState('');

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    addAssignment(asgForm);
    setIsModalOpen(false);
  };

  const handleOpenGradeModal = (subm: AssignmentSubmission) => {
    setSelectedSubmission(subm);
    setGradeMarks(subm.marksObtained || 90);
    setGradeFeedback(subm.teacherFeedback || (isBN ? 'চমৎকার সমাধান ও উপস্থাপনা।' : 'Good effort! Satisfactory solution.'));
  };

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSubmission) {
      gradeSubmission(selectedSubmission.id, Number(gradeMarks), gradeFeedback);
      setSelectedSubmission(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
            {isBN ? 'অ্যাসাইনমেন্ট ও জমাদান মূল্যায়ন' : 'Assignments & Student Submissions'}
          </h1>
          <p className="text-xs text-slate-500">
            {isBN 
              ? 'কোর্স টাস্ক প্রকাশ করুন, জমাকৃত ফাইল যাচাই করুন, নম্বর দিন এবং ফিডব্যাক প্রদান করুন।' 
              : 'Publish course tasks, review submitted files, assign marks, and provide feedback.'}
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-emerald-600/25 hover:bg-emerald-700 transition-colors cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>{isBN ? 'নতুন অ্যাসাইনমেন্ট তৈরি করুন' : 'Create New Assignment'}</span>
        </button>
      </div>

      {/* Active Assignments */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="h-4 w-4 text-emerald-600" />
          <span>{isBN ? `কোর্স অ্যাসাইনমেন্ট তালিকা (${assignments.length})` : `Course Assignments (${assignments.length})`}</span>
        </h2>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {assignments.map(asg => (
            <div
              key={asg.id}
              className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {asg.subjectCode}
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {isBN ? 'শেষ সময়' : 'Due'}: {asg.dueDate}
                </span>
              </div>

              <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">
                {asg.title}
              </h3>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                {asg.description}
              </p>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs dark:border-slate-800 font-semibold">
                <span className="text-slate-500">
                  {isBN ? 'সর্বোচ্চ নম্বর' : 'Max Score'}: {asg.maxMarks}
                </span>
                <span className="text-indigo-600 dark:text-indigo-400">{asg.subjectName}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Student Submissions List */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
          {isBN ? 'শিক্ষার্থীদের জমাকৃত সমাধানসমূহ' : 'Student Submissions Log'}
        </h2>

        <div className="space-y-3">
          {submissions.map(subm => (
            <div
              key={subm.id}
              className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5 sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-800/40"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">
                    {subm.studentName}
                  </span>
                  <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400">
                    ({subm.rollNumber})
                  </span>
                </div>
                <div className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                  📄 {subm.fileName} ({subm.fileSize})
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {isBN ? 'জমাদান' : 'Submitted'}: {subm.submittedAt}
                </div>
              </div>

              <div className="flex items-center gap-3">
                {subm.status === 'GRADED' ? (
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                      {isBN ? 'নম্বর' : 'Score'}: {subm.marksObtained}/100
                    </span>
                    {subm.teacherFeedback && (
                      <div className="text-[10px] text-slate-400 mt-1">
                        "{subm.teacherFeedback}"
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => handleOpenGradeModal(subm)}
                    className="rounded-xl bg-amber-500 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-amber-600 cursor-pointer"
                  >
                    {isBN ? 'নম্বর ও ফিডব্যাক দিন' : 'Grade & Feedback'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Assignment Modal */}
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
              {isBN ? 'নতুন অ্যাসাইনমেন্ট আপলোড করুন' : 'Upload New Assignment'}
            </h3>

            <form onSubmit={handleCreateAssignment} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  {isBN ? 'শিরোনাম' : 'Title'}
                </label>
                <input
                  type="text"
                  required
                  value={asgForm.title}
                  onChange={e => setAsgForm({ ...asgForm, title: e.target.value })}
                  className="mt-1 w-full rounded-xl border p-2.5 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  {isBN ? 'বিবরণ ও নির্দেশনা' : 'Description'}
                </label>
                <textarea
                  required
                  rows={3}
                  value={asgForm.description}
                  onChange={e => setAsgForm({ ...asgForm, description: e.target.value })}
                  className="mt-1 w-full rounded-xl border p-2.5 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    {isBN ? 'কোর্স' : 'Course'}
                  </label>
                  <select
                    value={asgForm.subjectCode}
                    onChange={e => setAsgForm({ ...asgForm, subjectCode: e.target.value })}
                    className="mt-1 w-full rounded-xl border p-2.5 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="CSE-301">CSE-301</option>
                    <option value="CSE-302">CSE-302</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    {isBN ? 'জমা দেওয়ার শেষ সময়' : 'Due Date'}
                  </label>
                  <input
                    type="date"
                    required
                    value={asgForm.dueDate}
                    onChange={e => setAsgForm({ ...asgForm, dueDate: e.target.value })}
                    className="mt-1 w-full rounded-xl border p-2.5 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="mt-4 flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/2 rounded-xl border py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  {isBN ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="w-1/2 rounded-xl bg-emerald-600 py-2.5 text-xs font-semibold text-white hover:bg-emerald-700 cursor-pointer"
                >
                  {isBN ? 'অ্যাসাইনমেন্ট প্রকাশ করুন' : 'Publish Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grade Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setSelectedSubmission(null)}
              className="absolute right-4 top-4 rounded-full bg-slate-100 p-1.5 text-slate-400 hover:bg-slate-200 dark:bg-slate-800"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {isBN ? 'মূল্যায়ন করুন' : 'Grade Submission'}: {selectedSubmission.studentName}
            </h3>

            <form onSubmit={handleSaveGrade} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  {isBN ? 'প্রাপ্ত নম্বর (১০০ এর মধ্যে)' : 'Marks Obtained (out of 100)'}
                </label>
                <input
                  type="number"
                  max={100}
                  min={0}
                  required
                  value={gradeMarks}
                  onChange={e => setGradeMarks(Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border p-2.5 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white font-mono font-bold"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  {isBN ? 'শিক্ষকের মন্তব্য ও ফিডব্যাক' : 'Faculty Feedback'}
                </label>
                <textarea
                  rows={3}
                  value={gradeFeedback}
                  onChange={e => setGradeFeedback(e.target.value)}
                  placeholder={isBN ? 'শিক্ষার্থীর জন্য গঠনমূলক মন্তব্য লিখুন...' : 'Enter comments for student...'}
                  className="mt-1 w-full rounded-xl border p-2.5 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="mt-4 flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedSubmission(null)}
                  className="w-1/2 rounded-xl border py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  {isBN ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="w-1/2 rounded-xl bg-amber-500 py-2.5 text-xs font-semibold text-white hover:bg-amber-600 cursor-pointer"
                >
                  {isBN ? 'গ্রেড সংরক্ষণ করুন' : 'Save Grade'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
