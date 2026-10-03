import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Assignment } from '../../types';
import { FileText, Upload, CheckCircle2, Clock, X, Sparkles } from 'lucide-react';

export const StudentAssignments: React.FC = () => {
  const { assignments, submissions, submitAssignment, currentStudent, language } = useApp();
  const isBN = language === 'BN';
  const [activeAsgModal, setActiveAsgModal] = useState<Assignment | null>(null);
  const [fileName, setFileName] = useState('AlexRivera_Solution_Assignment.pdf');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleSubmitFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeAsgModal) {
      submitAssignment(activeAsgModal.id, fileName);
      setSubmittedSuccess(true);
      setTimeout(() => {
        setSubmittedSuccess(false);
        setActiveAsgModal(null);
      }, 1500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
          {isBN ? 'অ্যাসাইনমেন্ট ও প্রজেক্ট জমাদান' : 'Assignments & Project Submissions'}
        </h1>
        <p className="text-xs text-slate-500">
          {isBN 
            ? 'পিডিএফ বা ডকুমেন্ট আকারে সমাধান আপলোড করুন, ডেডলাইন পর্যবেক্ষণ করুন এবং শিক্ষকের মূল্যায়ন দেখুন।' 
            : 'Upload PDF/DOCX solutions, track due deadlines, and view faculty marks & feedback.'}
        </p>
      </div>

      {/* Assignment List */}
      <div className="space-y-4">
        {assignments.map(asg => {
          const mySubmission = submissions.find(
            s => s.assignmentId === asg.id && s.studentId === currentStudent.id
          );

          return (
            <div
              key={asg.id}
              className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center justify-between">
                <span className="rounded bg-indigo-100 px-2.5 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-mono">
                  {asg.subjectCode}
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {isBN ? 'জমা দেওয়ার শেষ সময়' : 'Due Date'}: {asg.dueDate}
                </span>
              </div>

              <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">
                {asg.title}
              </h3>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                {asg.description}
              </p>

              <div className="mt-4 flex flex-col justify-between gap-3 border-t border-slate-100 pt-3 text-xs sm:flex-row sm:items-center dark:border-slate-800">
                <div className="text-slate-500 font-medium">
                  {isBN ? 'শিক্ষক' : 'Instructor'}: {asg.teacherName} • {isBN ? 'সর্বোচ্চ নম্বর' : 'Max Score'}: {asg.maxMarks}
                </div>

                <div>
                  {mySubmission ? (
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {mySubmission.status === 'GRADED'
                          ? (isBN ? `মূল্যায়ন সম্পন্ন: ${mySubmission.marksObtained}/100` : `Graded: ${mySubmission.marksObtained}/100`)
                          : (isBN ? 'জমা দেওয়া হয়েছে' : 'Submitted')}
                      </span>
                    </div>
                  ) : (
                    <button
                      onClick={() => setActiveAsgModal(asg)}
                      className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 transition cursor-pointer"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      <span>{isBN ? 'অ্যাসাইনমেন্ট জমা দিন' : 'Submit Assignment Solution'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Show feedback if graded */}
              {mySubmission?.teacherFeedback && (
                <div className="mt-3 rounded-2xl bg-slate-50 p-3 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-100 dark:border-slate-700">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {isBN ? 'শিক্ষকের মন্তব্য ও ফিডব্যাক:' : 'Faculty Feedback:'}
                  </span> "{mySubmission.teacherFeedback}"
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Upload Modal */}
      {activeAsgModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setActiveAsgModal(null)}
              className="absolute right-4 top-4 rounded-full bg-slate-100 p-1.5 text-slate-400 hover:bg-slate-200 dark:bg-slate-800"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {isBN ? 'টাস্ক জমা দিন' : 'Submit Task'}: {activeAsgModal.title}
            </h3>

            <form onSubmit={handleSubmitFile} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  {isBN ? 'সংযুক্ত ফাইলের নাম' : 'Attachment File Name'}
                </label>
                <input
                  type="text"
                  required
                  value={fileName}
                  onChange={e => setFileName(e.target.value)}
                  className="mt-1 w-full rounded-xl border p-2.5 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white font-mono"
                />
              </div>

              <div className="rounded-2xl border-2 border-dashed border-slate-200 p-6 text-center dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40">
                <Upload className="mx-auto h-8 w-8 text-indigo-500" />
                <p className="mt-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {isBN ? 'আপনার সমাধানের পিডিএফ ফাইল ড্র্যাগ করুন অথবা সিলেক্ট করুন' : 'Drag & drop your PDF solution or click to select'}
                </p>
                <span className="text-[10px] text-slate-400">
                  {isBN ? 'PDF, DOCX, ZIP ফাইল সমর্থিত (সর্বোচ্চ ২৫ মেগাবাইট)' : 'Supports PDF, DOCX, ZIP up to 25MB'}
                </span>
              </div>

              {submittedSuccess && (
                <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                  <Sparkles className="h-4 w-4" />
                  <span>{isBN ? 'অ্যাসাইনমেন্ট সফলভাবে জমা হয়েছে!' : 'Assignment submitted successfully!'}</span>
                </div>
              )}

              <div className="mt-4 flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveAsgModal(null)}
                  className="w-1/2 rounded-xl border py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  {isBN ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="w-1/2 rounded-xl bg-indigo-600 py-2.5 text-xs font-semibold text-white hover:bg-indigo-700 cursor-pointer"
                >
                  {isBN ? 'আপলোড ও সাবমিট' : 'Upload & Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
