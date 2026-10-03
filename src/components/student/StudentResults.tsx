import React from 'react';
import { useApp } from '../../context/AppContext';
import { Award, Printer, Download, GraduationCap } from 'lucide-react';

export const StudentResults: React.FC = () => {
  const { currentStudent, results, language } = useApp();
  const isBN = language === 'BN';

  const handlePrintTranscript = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
            {isBN ? 'একাডেমিক ফলাফল ও ট্রান্সক্রিপ্ট' : 'Academic Transcript & Results'}
          </h1>
          <p className="text-xs text-slate-500">
            {isBN 
              ? 'সেমিস্টার পরীক্ষার অফিসিয়াল ফলাফল এবং জিপিএ/সিজিপিএ মূল্যায়ন প্রতিবেদন।' 
              : 'Official semester performance records and Grade Point Average (GPA) calculations.'}
          </p>
        </div>

        <button
          onClick={handlePrintTranscript}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-700 transition-colors"
        >
          <Printer className="h-4 w-4" />
          {isBN ? 'গ্রেডশিট / রিপোর্ট কার্ড প্রিন্ট করুন' : 'Print Official Report Card'}
        </button>
      </div>

      {/* CGPA Summary Card */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-lg shadow-amber-500/25">
            <Award className="h-8 w-8" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase">
              {isBN ? 'সর্বমোট সিজিপিএ (CGPA)' : 'Cumulative CGPA'}
            </div>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {currentStudent.cgpa.toFixed(2)} / 4.00
            </div>
            <div className="text-xs font-semibold text-emerald-600">
              {isBN ? 'ফার্স্ট ক্লাস অনার রোল স্ট্যান্ডিং' : 'First Class Honors Standing'}
            </div>
          </div>
        </div>
      </div>

      {/* Semester Results List */}
      <div className="space-y-6">
        {results.map(res => (
          <div
            key={res.id}
            className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{res.semester}</h3>
                <p className="text-[11px] text-slate-400">
                  {isBN ? 'প্রকাশের তারিখ' : 'Published'}: {res.publishedDate}
                </p>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                {isBN ? 'সেমিস্টার জিপিএ' : 'Semester GPA'}: {res.gpa.toFixed(2)}
              </span>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 dark:bg-slate-800/60">
                  <tr>
                    <th className="p-3 font-semibold">{isBN ? 'কোর্স কোড ও শিরোনাম' : 'Course Code & Title'}</th>
                    <th className="p-3 font-semibold">{isBN ? 'ক্রেডিট' : 'Credits'}</th>
                    <th className="p-3 font-semibold">{isBN ? 'প্রাপ্ত নম্বর' : 'Marks'}</th>
                    <th className="p-3 font-semibold">{isBN ? 'গ্রেড' : 'Grade'}</th>
                    <th className="p-3 font-semibold">{isBN ? 'গ্রেড পয়েন্ট' : 'Grade Point'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {res.subjectResults.map((sr, idx) => (
                    <tr key={idx}>
                      <td className="p-3 font-bold text-slate-900 dark:text-white">
                        {sr.subjectCode}: {sr.subjectName}
                      </td>
                      <td className="p-3 font-mono">{sr.credits}</td>
                      <td className="p-3 font-mono">{sr.marksObtained}/100</td>
                      <td className="p-3 font-bold text-emerald-600">{sr.grade}</td>
                      <td className="p-3 font-bold text-slate-800 dark:text-slate-200">
                        {sr.gradePoint.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
