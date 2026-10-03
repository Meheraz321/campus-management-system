import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, Plus, Calendar, Trash2, Tag, FileText, CheckCircle2, X } from 'lucide-react';

export const NoticeEventManagement: React.FC = () => {
  const { notices, events, addNotice, deleteNotice, principalUser, language } = useApp();
  const isBN = language === 'BN';
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [noticeForm, setNoticeForm] = useState({
    title: '',
    content: '',
    category: 'General' as const,
    publishedBy: `${principalUser.name} (Principal)`,
    targetRole: 'ALL' as const,
    isImportant: false,
    attachmentName: 'Official_Notice_Doc.pdf'
  });

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    addNotice(noticeForm);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
            {isBN ? 'ক্যাম্পাস নোটিশ ও ইভেন্ট বুলেটিন' : 'Campus Notices & Events Bulletin'}
          </h1>
          <p className="text-xs text-slate-500">
            {isBN 
              ? 'অফিসিয়াল একাডেমিক নোটিশ, পরীক্ষার ঘোষণা এবং আসন্ন ইভেন্ট প্রকাশ ও পরিচালনা করুন।'
              : 'Publish official academic notices, exam announcements, and upcoming events.'}
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          {isBN ? 'নতুন নোটিশ দিন' : 'Publish Notice'}
        </button>
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Bell className="h-4 w-4 text-indigo-600" /> 
          {isBN ? `প্রকাশিত নোটিশসমূহ (${notices.length})` : `Published Announcements (${notices.length})`}
        </h2>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {notices.length === 0 ? (
            <div className="col-span-full py-10 text-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-6">
              <Bell className="h-9 w-9 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
              <p className="font-semibold text-sm text-slate-700 dark:text-slate-300">
                {isBN ? 'বর্তমানে কোনো নোটিশ নেই' : 'No notices published yet'}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {isBN ? 'নতুন নোটিশ প্রকাশ করতে উপরের "নতুন নোটিশ প্রকাশ করুন" বাটনে ক্লিক করুন।' : 'Click "Publish New Notice" above to create an announcement.'}
              </p>
            </div>
          ) : (
            notices.map(ntc => (
            <div
              key={ntc.id}
              className={`relative flex flex-col justify-between rounded-3xl border p-5 shadow-sm transition-all ${
                ntc.isImportant
                  ? 'border-amber-300/80 bg-amber-50/40 dark:border-amber-900/50 dark:bg-amber-950/20'
                  : 'border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      ntc.category === 'Exam'
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        : ntc.category === 'Event'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                    }`}
                  >
                    {ntc.category === 'Exam' ? (isBN ? 'পরীক্ষা' : 'Exam') : ntc.category === 'Event' ? (isBN ? 'ইভেন্ট' : 'Event') : (isBN ? 'সাধারণ' : 'General')}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{ntc.publishDate}</span>
                </div>

                <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">
                  {ntc.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  {ntc.content}
                </p>

                {ntc.attachmentName && (
                  <div className="mt-3 inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white/80 px-2.5 py-1 text-[11px] font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    <FileText className="h-3.5 w-3.5 text-indigo-500" />
                    <span>{ntc.attachmentName}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs dark:border-slate-800">
                <span className="text-[11px] font-semibold text-slate-500">
                  {isBN ? 'প্রকাশক: ' : 'Published by: '}{ntc.publishedBy}
                </span>
                <button
                  onClick={() => deleteNotice(ntc.id)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-slate-800"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          )))}
        </div>
      </div>

      {/* Events Section */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <Calendar className="h-4 w-4 text-emerald-500" /> {isBN ? `ক্যাম্পাস ইভেন্ট ক্যালেন্ডার (${events.length})` : `Campus Events Calendar (${events.length})`}
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {events.length === 0 ? (
            <div className="col-span-full py-8 text-center text-slate-400">
              <Calendar className="h-8 w-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
              <p className="font-semibold text-sm text-slate-600 dark:text-slate-300">
                {isBN ? 'বর্তমানে কোনো ইভেন্ট নির্ধারিত নেই' : 'No upcoming events scheduled'}
              </p>
            </div>
          ) : (
            events.map(evt => (
            <div
              key={evt.id}
              className="overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-800/40"
            >
              <img
                src={evt.bannerImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80'}
                alt={evt.title}
                className="h-32 w-full object-cover"
              />
              <div className="p-4">
                <span className="rounded bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  {evt.category}
                </span>
                <h3 className="mt-2 text-sm font-bold text-slate-900 dark:text-white">
                  {evt.title}
                </h3>
                <p className="mt-1 text-xs text-slate-500 line-clamp-2">{evt.description}</p>
                <div className="mt-3 text-[11px] font-medium text-slate-600 dark:text-slate-300">
                  <div>📅 {evt.date} ({evt.time})</div>
                  <div>📍 {evt.location}</div>
                </div>
              </div>
            </div>
          )))}
        </div>
      </div>

      {/* Create Notice Modal */}
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
              {isBN ? 'নতুন ক্যাম্পাস নোটিশ জারি করুন' : 'Publish New Campus Notice'}
            </h3>

            <form onSubmit={handlePublish} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">{isBN ? 'নোটিশের শিরোনাম' : 'Notice Title'}</label>
                <input
                  type="text"
                  required
                  value={noticeForm.title}
                  onChange={e => setNoticeForm({ ...noticeForm, title: e.target.value })}
                  className="mt-1 w-full rounded-xl border p-2.5 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">{isBN ? 'ক্যাটাগরি' : 'Category'}</label>
                <select
                  value={noticeForm.category}
                  onChange={e => setNoticeForm({ ...noticeForm, category: e.target.value as any })}
                  className="mt-1 w-full rounded-xl border p-2.5 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="General">{isBN ? 'সাধারণ' : 'General'}</option>
                  <option value="Academic">{isBN ? 'একাডেমিক' : 'Academic'}</option>
                  <option value="Exam">{isBN ? 'পরীক্ষা' : 'Exam'}</option>
                  <option value="Event">{isBN ? 'ইভেন্ট' : 'Event'}</option>
                  <option value="Emergency">{isBN ? 'জরুরি' : 'Emergency'}</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">{isBN ? 'নোটিশের বিবরণ' : 'Content'}</label>
                <textarea
                  required
                  rows={4}
                  value={noticeForm.content}
                  onChange={e => setNoticeForm({ ...noticeForm, content: e.target.value })}
                  className="mt-1 w-full rounded-xl border p-2.5 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="important"
                  checked={noticeForm.isImportant}
                  onChange={e => setNoticeForm({ ...noticeForm, isImportant: e.target.checked })}
                  className="h-4 w-4 rounded accent-indigo-600"
                />
                <label htmlFor="important" className="font-medium text-slate-700 dark:text-slate-300">
                  {isBN ? 'উচ্চ অগ্রাধিকার চিহ্নিত করুন' : 'Mark as High-Priority Notice'}
                </label>
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
                  {isBN ? 'নোটিশ প্রকাশ করুন' : 'Publish Notice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
