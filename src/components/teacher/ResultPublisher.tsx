import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Award, CheckCircle2, Sparkles, Send } from 'lucide-react';

export const ResultPublisher: React.FC = () => {
  const { students, language } = useApp();
  const isBN = language === 'BN';
  const [published, setPublished] = useState(false);

  const [marks, setMarks] = useState<{ [studentId: string]: number }>({
    'std-1': 94,
    'std-2': 88,
    'std-3': 81
  });

  const calculateGrade = (score: number) => {
    if (score >= 90) return { grade: 'A+', point: 4.0 };
    if (score >= 80) return { grade: 'A', point: 3.75 };
    if (score >= 70) return { grade: 'B', point: 3.0 };
    return { grade: 'C', point: 2.0 };
  };

  const handlePublish = () => {
    setPublished(true);
    setTimeout(() => setPublished(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
          {isBN ? 'কোর্স ফলাফল ও জিপিএ প্রকাশ' : 'Publish Course Results & GPA Scores'}
        </h1>
        <p className="text-xs text-slate-500">
          {isBN 
            ? 'শিক্ষার্থীদের পরীক্ষার নম্বর ইনপুট দিন এবং সেমিস্টার গ্রেড পয়েন্ট আপডেট করুন।' 
            : 'Enter examination marks for enrolled students to update semester grade point averages.'}
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-800/60">
              <tr>
                <th className="p-4 font-semibold">{isBN ? 'শিক্ষার্থীর নাম ও রোল' : 'Student Name & Roll'}</th>
                <th className="p-4 font-semibold">{isBN ? 'কোর্স কোড' : 'Course Code'}</th>
                <th className="p-4 font-semibold">{isBN ? 'নম্বর (১০০ এর মধ্যে)' : 'Marks (Out of 100)'}</th>
                <th className="p-4 font-semibold">{isBN ? 'হিসাবকৃত গ্রেড' : 'Calculated Grade'}</th>
                <th className="p-4 font-semibold">{isBN ? 'গ্রেড পয়েন্ট' : 'Grade Point'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {students.map(st => {
                const score = marks[st.id] || 85;
                const { grade, point } = calculateGrade(score);
                return (
                  <tr key={st.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30">
                    <td className="p-4">
                      <div className="font-bold text-slate-900 dark:text-white">{st.name}</div>
                      <div className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400">
                        {st.rollNumber}
                      </div>
                    </td>
                    <td className="p-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                      CSE-301
                    </td>
                    <td className="p-4">
                      <input
                        type="number"
                        max={100}
                        min={0}
                        value={score}
                        onChange={e =>
                          setMarks({ ...marks, [st.id]: Number(e.target.value) })
                        }
                        className="w-20 rounded-xl border border-slate-200 p-2 text-xs font-mono font-bold outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                    </td>
                    <td className="p-4 font-bold text-emerald-600">{grade}</td>
                    <td className="p-4 font-bold text-slate-800 dark:text-slate-200">
                      {point.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {published && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            <Sparkles className="h-4 w-4" />
            <span>{isBN ? 'কোর্সের ফলাফল অফিসিয়াল গ্রেডশিটে প্রকাশিত হয়েছে!' : 'Course results published to official student transcripts!'}</span>
          </div>
        )}

        <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handlePublish}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-xs font-semibold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            <Send className="h-4 w-4" />
            <span>{isBN ? 'ফলাফল ট্রান্সক্রিপ্টে প্রকাশ করুন' : 'Publish Results to Transcripts'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
