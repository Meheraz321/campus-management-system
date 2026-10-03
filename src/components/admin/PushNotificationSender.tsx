import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Send, CheckCircle2 } from 'lucide-react';

export const PushNotificationSender: React.FC = () => {
  const { sendPushNotification, language } = useApp();
  const isBN = language === 'BN';
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetRole, setTargetRole] = useState<'ALL' | 'STUDENT' | 'TEACHER'>('ALL');
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;
    sendPushNotification(title, message, targetRole);
    setTitle('');
    setMessage('');
    setSentSuccess(true);
    setTimeout(() => setSentSuccess(false), 3000);
  };

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
          {isBN ? 'ব্রডকাস্ট পুশ নোটিফিকেশন' : 'Broadcast Push Notifications'}
        </h1>
        <p className="text-xs text-slate-500">
          {isBN 
            ? 'ক্যাম্পাস মোবাইল ও ওয়েব ব্যবহারকারীদের জন্য তাৎক্ষণিক পুশ এলার্ট ও নোটিফিকেশন প্রেরণ করুন।'
            : 'Dispatch instant Firebase Cloud Messaging (FCM) push alerts to active campus mobile apps and web clients.'}
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              {isBN ? 'প্রাপক নির্বাচন (Target Audience)' : 'Target Audience'}
            </label>
            <div className="mt-1 flex gap-2">
              {(['ALL', 'STUDENT', 'TEACHER'] as const).map(roleOption => (
                <button
                  key={roleOption}
                  type="button"
                  onClick={() => setTargetRole(roleOption)}
                  className={`flex-1 rounded-xl py-2 text-xs font-semibold transition-colors ${
                    targetRole === roleOption
                      ? 'bg-indigo-600 text-white'
                      : 'border border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {roleOption === 'ALL'
                    ? (isBN ? 'সমগ্র ক্যাম্পাস' : 'Entire Campus')
                    : roleOption === 'STUDENT'
                    ? (isBN ? 'শুধুমাত্র শিক্ষার্থী' : 'Students Only')
                    : (isBN ? 'শুধুমাত্র শিক্ষক' : 'Teachers Only')}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              {isBN ? 'নোটিফিকেশনের শিরোনাম' : 'Notification Title'}
            </label>
            <input
              type="text"
              required
              placeholder={isBN ? "যেমন: জরুরি আবহাওয়া সতর্কতা / ছুটির নোটিশ" : "e.g. Emergency Weather Advisory / Exam Delay"}
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              {isBN ? 'বার্তার বিবরণ' : 'Message Body'}
            </label>
            <textarea
              required
              rows={4}
              placeholder={isBN ? "পুশ বার্তার সম্পূর্ণ বিবরণ এখানে লিখুন..." : "Enter push notification body text..."}
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {sentSuccess && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              <CheckCircle2 className="h-4 w-4" />
              {isBN ? 'পুশ নোটিফিকেশন সফলভাবে ব্রডকাস্ট করা হয়েছে!' : 'Push Notification successfully broadcasted to campus clients!'}
            </div>
          )}

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-xs font-semibold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-700 transition-colors"
          >
            <Send className="h-4 w-4" /> {isBN ? 'নোটিফিকেশন পাঠান' : 'Broadcast Notification Now'}
          </button>
        </form>
      </div>
    </div>
  );
};
