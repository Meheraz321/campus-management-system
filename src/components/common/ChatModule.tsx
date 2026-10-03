import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserAvatar } from './UserAvatar';
import { Send, Hash, MessageSquare, Search, User, Sparkles, Image, Paperclip } from 'lucide-react';

export const ChatModule: React.FC = () => {
  const { role, principalUser, hodUser, currentTeacher, currentStudent, messages, sendChatMessage, language } = useApp();
  const isBN = language === 'BN';

  const [activeChannel, setActiveChannel] = useState<'#CSE-Department' | '#Faculty-Lounge' | '#General-Campus'>('#CSE-Department');
  const [inputMessage, setInputMessage] = useState('');

  const currentUserInfo =
    role === 'ADMIN'
      ? { id: principalUser?.id || 'admin', name: principalUser?.name || 'Principal', role: 'ADMIN', avatar: principalUser?.avatar || '' }
      : role === 'HOD'
      ? { id: hodUser?.id || 'hod', name: hodUser?.name || 'Head of Dept', role: 'HOD', avatar: hodUser?.avatar || '' }
      : role === 'TEACHER'
      ? { id: currentTeacher?.id || 'teacher', name: currentTeacher?.name || 'Faculty', role: 'TEACHER', avatar: currentTeacher?.avatar || '' }
      : { id: currentStudent?.id || 'student', name: currentStudent?.name || 'Student', role: 'STUDENT', avatar: currentStudent?.avatar || '' };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    sendChatMessage('channel-all', inputMessage.trim());
    setInputMessage('');
  };

  const safeMessages = messages || [];
  const filteredMessages = safeMessages.filter(m => !m.channel || m.channel === activeChannel);

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] rounded-3xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
      <div className="flex h-full">
        {/* Channel Sidebar */}
        <div className="w-56 border-r border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/60 hidden sm:block">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            {isBN ? 'আলোচনা চ্যানেল' : 'Discussion Channels'}
          </div>

          <div className="space-y-1">
            {(['#CSE-Department', '#Faculty-Lounge', '#General-Campus'] as const).map(ch => (
              <button
                key={ch}
                onClick={() => setActiveChannel(ch)}
                className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
                  activeChannel === ch
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                <Hash className="h-3.5 w-3.5" />
                <span>
                  {ch === '#CSE-Department'
                    ? (isBN ? 'সিএসই বিভাগ' : 'CSE Department')
                    : ch === '#Faculty-Lounge'
                    ? (isBN ? 'শিক্ষক লাউঞ্জ' : 'Faculty Lounge')
                    : (isBN ? 'সাধারণ ক্যাম্পাস' : 'General Campus')}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-6 border-t border-slate-200/60 pt-4 dark:border-slate-800">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              {isBN ? 'বর্তমান ব্যবহারকারী' : 'Active User'}
            </div>
            <div className="flex items-center gap-2">
              <UserAvatar
                src={currentUserInfo.avatar}
                name={currentUserInfo.name}
                size="sm"
              />
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                  {currentUserInfo.name}
                </div>
                <div className="text-[10px] font-semibold text-emerald-500">● {isBN ? 'অনলাইন' : 'Online'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Feed */}
        <div className="flex flex-1 flex-col justify-between">
          {/* Chat Header */}
          <div className="flex items-center justify-between border-b border-slate-100 p-4 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Hash className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  {activeChannel}
                </h2>
                <p className="text-[11px] text-slate-400">
                  {isBN 
                    ? 'শিক্ষক, শিক্ষার্থী ও প্রশাসনের জন্য ডিজিটাল আলোচনা চ্যানেল'
                    : 'Campus discussion channel for teachers, students & administration'}
                </p>
              </div>
            </div>

            {/* Mobile Channel Switcher */}
            <select
              value={activeChannel}
              onChange={e => setActiveChannel(e.target.value as any)}
              className="sm:hidden rounded-xl border border-slate-200 bg-slate-50 p-1.5 text-xs font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="#CSE-Department">{isBN ? '#সিএসই-বিভাগ' : '#CSE-Department'}</option>
              <option value="#Faculty-Lounge">{isBN ? '#শিক্ষক-লাউঞ্জ' : '#Faculty-Lounge'}</option>
              <option value="#General-Campus">{isBN ? '#সাধারণ-ক্যাম্পাস' : '#General-Campus'}</option>
            </select>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {filteredMessages.map(msg => {
              const isMe = msg.senderId === currentUserInfo.id;
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <UserAvatar
                    src={msg.senderAvatar}
                    name={msg.senderName}
                    size="sm"
                  />
                  <div className={`max-w-xs sm:max-w-md ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                        {msg.senderName}
                      </span>
                      <span className="text-[9px] font-mono text-slate-400">{msg.timestamp}</span>
                    </div>

                    <div
                      className={`rounded-2xl p-3 text-xs leading-relaxed ${
                        isMe
                          ? 'bg-indigo-600 text-white rounded-tr-none'
                          : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100 rounded-tl-none'
                      }`}
                    >
                      {msg.message || (msg as any).content}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={handleSend}
            className="border-t border-slate-100 p-3 dark:border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder={isBN ? `${activeChannel}-এ মেসেজ লিখুন...` : `Message ${activeChannel}...`}
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-800 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
            <button
              type="submit"
              className="flex items-center justify-center rounded-2xl bg-indigo-600 p-2.5 text-white shadow-md hover:bg-indigo-700 transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
