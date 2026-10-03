import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { StudyMaterial } from '../../types';
import {
  BookOpen,
  Video,
  FileText,
  Download,
  Play,
  Plus,
  X,
  Search,
  Filter,
  Sparkles,
  Clock,
  Bookmark,
  BookmarkCheck,
  GraduationCap,
  CheckCircle2,
  Trash2,
  Eye,
  Layers,
  FileCode,
  RotateCcw,
  Volume2,
  VolumeX,
  Award,
  ChevronRight,
  ExternalLink,
  Info,
  Calendar,
  UserCheck,
  Tag,
  Maximize2
} from 'lucide-react';

export const StudyMaterialUploader: React.FC = () => {
  const {
    role,
    materials,
    addMaterial,
    deleteMaterial,
    currentStudent,
    currentTeacher,
    principalUser,
    hodUser,
    language
  } = useApp();

  const isBN = language === 'BN';

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [deptFilter, setDeptFilter] = useState<string>('ALL');
  const [semesterFilter, setSemesterFilter] = useState<string>('ALL');
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

  // Bookmarks state (saved in localStorage)
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('academia_study_bookmarks');
      return saved ? JSON.parse(saved) : ['mat-001', 'mat-002', 'mat-007'];
    } catch {
      return ['mat-001', 'mat-002'];
    }
  });

  const toggleBookmark = (id: string) => {
    setBookmarkedIds(prev => {
      const next = prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id];
      try {
        localStorage.setItem('academia_study_bookmarks', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  // Video Player Modal
  const [activeVideoMaterial, setActiveVideoMaterial] = useState<StudyMaterial | null>(null);

  // PDF Document Viewer / Reader Modal
  const [activeDocMaterial, setActiveDocMaterial] = useState<StudyMaterial | null>(null);
  const [readerZoom, setReaderZoom] = useState<number>(100);
  const [readerTheme, setReaderTheme] = useState<'light' | 'sepia' | 'dark'>('light');

  // Teacher/Admin Upload Modal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newSubjectCode, setNewSubjectCode] = useState('CST-401');
  const [newSubjectName, setNewSubjectName] = useState('Advanced Programming with Python');
  const [newDepartment, setNewDepartment] = useState('কম্পিউটার সায়েন্স অ্যান্ড ইঞ্জিনিয়ারিং (CST)');
  const [newSemester, setNewSemester] = useState('৪র্থ সেমিস্টার');
  const [newFileType, setNewFileType] = useState<'pdf' | 'video' | 'docx'>('pdf');
  const [newCategory, setNewCategory] = useState<'Lecture Notes' | 'Video Class' | 'Lab Manual' | 'Question Bank' | 'Hand Notes' | 'Cheat Sheet'>('Lecture Notes');
  const [newFileUrl, setNewFileUrl] = useState('');
  const [newFileSize, setNewFileSize] = useState('4.2 MB');
  const [newDuration, setNewDuration] = useState('35:00 min');
  const [newPages, setNewPages] = useState<number>(32);
  const [newTags, setNewTags] = useState('Python, Exam Prep');

  // Delete Confirmation
  const [materialToDelete, setMaterialToDelete] = useState<StudyMaterial | null>(null);

  // Pomodoro Study Timer Tool
  const [isTimerOpen, setIsTimerOpen] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerMode, setTimerMode] = useState<'focus' | 'break'>('focus');
  const [completedSessions, setCompletedSessions] = useState(2);
  const [ambientSound, setAmbientSound] = useState<'none' | 'library' | 'rain'>('none');

  // Quick Study Scratchpad
  const [scratchpadText, setScratchpadText] = useState(() => {
    try {
      return localStorage.getItem('academia_study_scratchpad') || '📌 আজকের গুরুত্বপূর্ণ পড়াশোনার নোটস:\n- Data Structures: Tree Traversal (Inorder, Preorder)\n- Python: Decorators & Generators প্র্যাকটিস করা\n- বিগত বছরের প্রশ্নের ৩ নম্বর সেট সমাধান';
    } catch {
      return '';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('academia_study_scratchpad', scratchpadText);
    } catch (e) {
      console.error(e);
    }
  }, [scratchpadText]);

  // Pomodoro countdown timer effect
  useEffect(() => {
    let interval: any = null;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(sec => sec - 1);
      }, 1000);
    } else if (timerRunning && timerSeconds === 0) {
      if (timerMode === 'focus') {
        setCompletedSessions(c => c + 1);
        setTimerMode('break');
        setTimerSeconds(5 * 60);
      } else {
        setTimerMode('focus');
        setTimerSeconds(25 * 60);
      }
      setTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds, timerMode]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Filtered Materials
  const filteredMaterials = materials.filter(mat => {
    const matchesSearch =
      mat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mat.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mat.subjectCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mat.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mat.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (mat.tags && mat.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesCategory =
      categoryFilter === 'ALL' ||
      (categoryFilter === 'VIDEO' && mat.fileType === 'video') ||
      (categoryFilter === 'PDF' && mat.fileType === 'pdf') ||
      mat.category === categoryFilter;

    const matchesDept = deptFilter === 'ALL' || mat.department === deptFilter;
    const matchesSemester = semesterFilter === 'ALL' || mat.semester === semesterFilter;
    const matchesBookmark = !showBookmarksOnly || bookmarkedIds.includes(mat.id);

    return matchesSearch && matchesCategory && matchesDept && matchesSemester && matchesBookmark;
  });

  // Calculate stats
  const totalCount = materials.length;
  const videoCount = materials.filter(m => m.fileType === 'video').length;
  const pdfCount = materials.filter(m => m.fileType === 'pdf').length;
  const handNotesCount = materials.filter(m => m.category === 'Hand Notes' || m.category === 'Lecture Notes').length;
  const qBankCount = materials.filter(m => m.category === 'Question Bank').length;

  const handleCreateMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const authorName =
      role === 'TEACHER'
        ? currentTeacher.name
        : role === 'HOD'
        ? hodUser.name
        : principalUser.name;

    addMaterial({
      title: newTitle.trim(),
      description: newDesc.trim() || 'লেটেস্ট একাডেমিক নোটস ও স্টাডি রিসোর্স।',
      subjectCode: newSubjectCode,
      subjectName: newSubjectName,
      teacherName: authorName,
      department: newDepartment,
      semester: newSemester,
      fileType: newFileType,
      fileUrl: newFileUrl.trim() || (newFileType === 'video' ? 'https://www.youtube.com/embed/RBSGKlAvoiM' : 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'),
      fileSize: newFileType === 'video' ? undefined : newFileSize,
      videoDuration: newFileType === 'video' ? newDuration : undefined,
      category: newCategory,
      pages: newFileType === 'pdf' ? newPages : undefined,
      tags: newTags.split(',').map(t => t.trim()).filter(Boolean),
      isFeatured: false
    });

    setIsUploadModalOpen(false);
    setNewTitle('');
    setNewDesc('');
  };

  const getCategoryBadge = (cat?: string, fileType?: string) => {
    if (fileType === 'video' || cat === 'Video Class') {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[10px] font-bold text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
          <Video className="h-3 w-3 text-rose-500" />
          {isBN ? 'ভিডিও ক্লাস (Video Class)' : 'Video Lecture'}
        </span>
      );
    }
    if (cat === 'Hand Notes') {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          <FileText className="h-3 w-3 text-emerald-500" />
          {isBN ? 'হ্যান্ড নোটস (Hand Notes)' : 'Faculty Notes'}
        </span>
      );
    }
    if (cat === 'Lab Manual') {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-0.5 text-[10px] font-bold text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
          <FileCode className="h-3 w-3 text-purple-500" />
          {isBN ? 'ল্যাব ম্যানুয়াল (Lab Manual)' : 'Lab Manual'}
        </span>
      );
    }
    if (cat === 'Question Bank') {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
          <Award className="h-3 w-3 text-amber-500" />
          {isBN ? 'প্রশ্নব্যাংক (Question Bank)' : 'Question Bank'}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
        <BookOpen className="h-3 w-3 text-indigo-500" />
        {isBN ? 'লেকচার স্লাইড (PDF Slides)' : 'PDF Lecture Slide'}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Academic Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white shadow-2xl border border-slate-800">
        <div className="absolute right-0 top-0 -mt-12 -mr-12 h-80 w-80 rounded-full bg-indigo-600/15 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 -mb-10 h-40 w-40 rounded-full bg-violet-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 px-3.5 py-1 text-xs font-bold text-indigo-300 border border-indigo-500/30">
              <GraduationCap className="h-3.5 w-3.5 text-indigo-400" />
              {isBN ? 'Academia OS • ডিজিটাল স্টাডি পোর্টাল ও ই-লার্নিং হাব' : 'Academia OS • Digital Study Portal & E-Learning Hub'}
            </div>
            <h1 className="text-2xl font-black tracking-tight sm:text-3xl text-white">
              {isBN ? 'ডিজিটাল স্টাডি পোর্টাল ও রিসোর্স সেন্টার' : 'Digital Study Portal & Academic Library'}
            </h1>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isBN
                ? 'ক্লাসের লেকচার স্লাইড, হ্যান্ড নোটস, ল্যাব প্র্যাকটিক্যাল শিট, ভিডিও লেকচার এবং বোর্ড ফাইনাল পরীক্ষার প্রশ্নব্যাংক এক ঠিকানায়। যেকোনো সময় অনলাইনে পড়ুন বা অফলাইন স্টাডির জন্য ডাউনলোড করুন।'
                : 'Subject lecture slides, instructor hand notes, lab practical sheets, video recordings, and board final examination archives in one unified portal.'}
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] text-indigo-200/80 font-medium">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span>{isBN ? '"ধারাবাহিক অনুশীলন ও সঠিক অধ্যয়নই সাফল্যের চাবিকাঠি।" — ডেইলি স্টাডি টিপ' : '"Consistent practice and structured study lead to academic excellence." — Daily Tip'}</span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsTimerOpen(!isTimerOpen)}
              className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition-all shadow-lg active:scale-95 ${
                isTimerOpen
                  ? 'bg-amber-500 text-slate-950 shadow-amber-500/20'
                  : 'bg-slate-800/90 text-amber-300 hover:bg-slate-700 border border-amber-500/30'
              }`}
              title="Study Timer & Focus Mode"
            >
              <Clock className="h-4 w-4" />
              <span>{isTimerOpen ? (isBN ? 'ফোকাস মোড লুকান' : 'Hide Focus Timer') : (isBN ? '⏱️ ফোকাস স্টাডি টাইমার' : '⏱️ Focus Study Timer')}</span>
            </button>

            {role !== 'STUDENT' && (
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(true)}
                className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/25 active:scale-95 border border-indigo-400/30"
              >
                <Plus className="h-4 w-4" />
                <span>{isBN ? 'ম্যাটেরিয়াল আপলোড করুন' : 'Upload Study Material'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
              className={`flex items-center gap-2 rounded-2xl px-3.5 py-2.5 text-xs font-bold transition-all border ${
                showBookmarksOnly
                  ? 'bg-amber-500 text-slate-950 border-amber-400'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 border-slate-700'
              }`}
            >
              <Bookmark className={`h-4 w-4 ${showBookmarksOnly ? 'fill-current' : ''}`} />
              <span>{isBN ? `বুকমার্কড (${bookmarkedIds.length})` : `Bookmarks (${bookmarkedIds.length})`}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Study Focus Mode (Pomodoro Timer & Scratchpad) */}
      {isTimerOpen && (
        <div className="rounded-3xl border border-amber-200/80 bg-gradient-to-br from-amber-50/70 via-orange-50/40 to-white p-5 shadow-lg dark:border-amber-950/60 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950 animate-in fade-in slide-in-from-top-3">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-amber-200/60 pb-4 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500 text-slate-950 shadow-md">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                  Pomodoro Focus Companion (স্মার্ট পড়াশোনা টাইমার)
                  <span className="rounded-full bg-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-900 dark:bg-amber-950 dark:text-amber-300">
                    {timerMode === 'focus' ? '🎯 মনোযোগ স্টাডি সেশন' : '☕ রিল্যাক্স ব্রেক'}
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  ২৫ মিনিট গভীর মনোযোগে অধ্যয়ন এবং ৫ মিনিটের বিশ্রাম আপনাকে দীর্ঘক্ষণ সতেজ রাখবে।
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                আজকের সেশন: <span className="font-mono text-indigo-600 dark:text-indigo-400">{completedSessions} টি</span> সম্পন্ন
              </div>
              <button
                onClick={() => setIsTimerOpen(false)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Countdown Clock */}
            <div className="md:col-span-5 flex flex-col items-center justify-center rounded-2xl bg-white p-5 text-center shadow-sm dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
              <div className="font-mono text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                {formatTime(timerSeconds)}
              </div>
              <div className="mt-1 text-xs font-semibold text-slate-500">
                {timerRunning ? 'সেশন চলমান রয়েছে...' : 'পড়াশোনা শুরু করতে প্লে বাটনে চাপুন'}
              </div>

              <div className="mt-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTimerRunning(!timerRunning)}
                  className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-md transition ${
                    timerRunning ? 'bg-rose-600 hover:bg-rose-500' : 'bg-emerald-600 hover:bg-emerald-500'
                  }`}
                >
                  {timerRunning ? <Play className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                  <span>{timerRunning ? 'পজ করুন (Pause)' : 'শুরু করুন (Start)'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTimerRunning(false);
                    setTimerSeconds(timerMode === 'focus' ? 25 * 60 : 5 * 60);
                  }}
                  className="rounded-xl bg-slate-100 p-2 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                  title="রিসেট করুন"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const nextMode = timerMode === 'focus' ? 'break' : 'focus';
                    setTimerMode(nextMode);
                    setTimerSeconds(nextMode === 'focus' ? 25 * 60 : 5 * 60);
                    setTimerRunning(false);
                  }}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  {timerMode === 'focus' ? 'ব্রেক নিন (5m)' : 'স্টাডি মোড (25m)'}
                </button>
              </div>
            </div>

            {/* Quick Live Notes Scratchpad */}
            <div className="md:col-span-7 flex flex-col rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-indigo-500" />
                  কুইক স্টাডি স্ক্র্যাচপ্যাড (স্বয়ংক্রিয়ভাবে সেভ হয়)
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                  ✓ অটোসেভ সক্রিয়
                </span>
              </div>
              <textarea
                value={scratchpadText}
                onChange={e => setScratchpadText(e.target.value)}
                placeholder="ভিডিও বা লেকচার দেখার সময় গুরুত্বপূর্ণ সমীকরণ, প্রশ্ন বা তথ্য এখানে লিখে রাখুন..."
                className="mt-2 w-full flex-1 rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 resize-none h-24"
              />
            </div>
          </div>
        </div>
      )}

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>সর্বমোট রিসোর্স</span>
            <BookOpen className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{totalCount}</div>
          <div className="mt-1 text-[11px] text-slate-400">অনলাইন ই-লাইব্রেরি</div>
        </div>

        <div className="rounded-2xl border border-rose-200/60 bg-rose-50/40 p-4 shadow-sm dark:border-rose-900/40 dark:bg-rose-950/20">
          <div className="flex items-center justify-between text-xs font-semibold text-rose-700 dark:text-rose-400">
            <span>ভিডিও ক্লাস</span>
            <Video className="h-4 w-4 text-rose-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-rose-900 dark:text-rose-200">{videoCount}</div>
          <div className="mt-1 text-[11px] text-rose-600/80 dark:text-rose-400">রেকর্ডেড লেকচারস</div>
        </div>

        <div className="rounded-2xl border border-indigo-200/60 bg-indigo-50/40 p-4 shadow-sm dark:border-indigo-900/40 dark:bg-indigo-950/20">
          <div className="flex items-center justify-between text-xs font-semibold text-indigo-700 dark:text-indigo-400">
            <span>স্লাইড ও হ্যান্ডনোট</span>
            <FileText className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-indigo-900 dark:text-indigo-200">{pdfCount}</div>
          <div className="mt-1 text-[11px] text-indigo-600/80 dark:text-indigo-400">পিডিএফ লেকচার নোট</div>
        </div>

        <div className="rounded-2xl border border-emerald-200/60 bg-emerald-50/40 p-4 shadow-sm dark:border-emerald-900/40 dark:bg-emerald-950/20">
          <div className="flex items-center justify-between text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            <span>ল্যাব ম্যানুয়াল</span>
            <FileCode className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-900 dark:text-emerald-200">
            {materials.filter(m => m.category === 'Lab Manual').length || 1}
          </div>
          <div className="mt-1 text-[11px] text-emerald-600/80 dark:text-emerald-400">প্র্যাকটিক্যাল শিট</div>
        </div>

        <div className="rounded-2xl border border-amber-200/60 bg-amber-50/40 p-4 shadow-sm dark:border-amber-900/40 dark:bg-amber-950/20">
          <div className="flex items-center justify-between text-xs font-semibold text-amber-700 dark:text-amber-400">
            <span>প্রশ্ন সংকলন</span>
            <Award className="h-4 w-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-amber-900 dark:text-amber-200">{qBankCount || 1}</div>
          <div className="mt-1 text-[11px] text-amber-600/80 dark:text-amber-400">বোর্ড প্রশ্ন ও সাজেশন</div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="space-y-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={isBN ? "টপিক, বিষয়, সাবজেক্ট কোড, শিক্ষক বা ট্যাগ দিয়ে খুঁজুন..." : "Search by topic, subject code, teacher, or tags..."}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Department Filter */}
            <select
              value={deptFilter}
              onChange={e => setDeptFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
            >
              <option value="ALL">{isBN ? 'সকল ডিপার্টমেন্ট (All Depts)' : 'All Departments'}</option>
              <option value="কম্পিউটার সায়েন্স অ্যান্ড ইঞ্জিনিয়ারিং (CST)">Computer (CST)</option>
              <option value="ইলেকট্রিক্যাল টেকনোলজি (EEE)">Electrical (EEE)</option>
              <option value="ইলেকট্রনিক্স টেকনোলজি (ENT)">Electronics (ENT)</option>
              <option value="নন-টেক ডিপার্টমেন্ট">Non-Tech</option>
            </select>

            {/* Semester Filter */}
            <select
              value={semesterFilter}
              onChange={e => setSemesterFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
            >
              <option value="ALL">{isBN ? 'সকল সেমিস্টার (All Semesters)' : 'All Semesters'}</option>
              <option value="১ম সেমিস্টার">{isBN ? '১ম সেমিস্টার' : '1st Semester'}</option>
              <option value="২য় সেমিস্টার">{isBN ? '২য় সেমিস্টার' : '2nd Semester'}</option>
              <option value="৩য় সেমিস্টার">{isBN ? '৩য় সেমিস্টার' : '3rd Semester'}</option>
              <option value="৪র্থ সেমিস্টার">{isBN ? '৪র্থ সেমিস্টার' : '4th Semester'}</option>
              <option value="৫ম সেমিস্টার">{isBN ? '৫ম সেমিস্টার' : '5th Semester'}</option>
              <option value="৬ষ্ঠ সেমিস্টার">{isBN ? '৬ষ্ঠ সেমিস্টার' : '6th Semester'}</option>
              <option value="৭ম সেমিস্টার">{isBN ? '৭ম সেমিস্টার' : '7th Semester'}</option>
              <option value="৮ম সেমিস্টার">{isBN ? '৮ম সেমিস্টার' : '8th Semester'}</option>
            </select>
          </div>
        </div>

        {/* Category Pills Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100 dark:border-slate-800 pb-1">
          <Filter className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          {[
            { id: 'ALL', label: isBN ? `সকল উপাদান (${totalCount})` : `All Materials (${totalCount})` },
            { id: 'VIDEO', label: isBN ? `ভিডিও ক্লাস (${videoCount})` : `Video Classes (${videoCount})` },
            { id: 'Lecture Notes', label: isBN ? `লেকচার স্লাইড (${pdfCount})` : `Lecture Slides (${pdfCount})` },
            { id: 'Hand Notes', label: isBN ? `হ্যান্ড নোটস` : `Hand Notes` },
            { id: 'Lab Manual', label: isBN ? `ল্যাব ম্যানুয়াল` : `Lab Manuals` },
            { id: 'Question Bank', label: isBN ? `প্রশ্নব্যাংক (${qBankCount})` : `Question Bank (${qBankCount})` },
            { id: 'Cheat Sheet', label: isBN ? `চিট শিট ও সামারি` : `Cheat Sheets` }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                categoryFilter === cat.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filteredMaterials.length === 0 ? (
          <div className="col-span-full rounded-3xl border border-slate-200/80 bg-white p-12 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <BookOpen className="h-12 w-12 mx-auto mb-3 text-slate-300 dark:text-slate-700" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {isBN ? 'কোনো স্টাডি ম্যাটেরিয়াল পাওয়া যায়নি' : 'No Study Materials Found'}
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {isBN
                ? 'আপনার ফিল্টার অনুযায়ী কোনো রিসোর্স তালিকাভুক্ত নেই। সার্চ কোয়েরি পরিবর্তন করে আবার চেষ্টা করুন।'
                : 'No study resources match your active filters. Try clearing filters or searching for another topic.'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('ALL');
                setDeptFilter('ALL');
                setSemesterFilter('ALL');
                setShowBookmarksOnly(false);
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition"
            >
              {isBN ? 'সব ফিল্টার রিসেট করুন' : 'Reset All Filters'}
            </button>
          </div>
        ) : (
          filteredMaterials.map(mat => {
            const isBookmarked = bookmarkedIds.includes(mat.id);
            return (
              <div
                key={mat.id}
                className="group relative flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm hover:shadow-xl hover:border-indigo-300/80 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-500/50 transition-all duration-300"
              >
                <div>
                  {/* Top Tags & Bookmark Button */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {getCategoryBadge(mat.category, mat.fileType)}
                      <span className="font-mono text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-lg border border-indigo-200/50 dark:border-indigo-900/50">
                        {mat.subjectCode}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleBookmark(mat.id)}
                      className={`p-1.5 rounded-xl transition ${
                        isBookmarked
                          ? 'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40'
                          : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                      title={isBookmarked ? 'বুকমার্ক সরান' : 'পড়ার জন্য বুকমার্ক করুন'}
                    >
                      <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Title & Subject */}
                  <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                    {mat.title}
                  </h3>
                  
                  <div className="mt-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    {mat.subjectName}
                  </div>

                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {mat.description}
                  </p>

                  {/* Tags */}
                  {mat.tags && mat.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {mat.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Bottom Strip */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pb-3">
                    <span className="flex items-center gap-1">
                      <UserCheck className="h-3 w-3 text-slate-400" />
                      {mat.teacherName.split(' ')[0]}
                    </span>
                    <span>
                      {mat.fileType === 'video'
                        ? `ভিডিও: ${mat.videoDuration || '30m'}`
                        : mat.pages
                        ? `${mat.pages} পৃষ্ঠা • ${mat.fileSize || '3 MB'}`
                        : mat.fileSize || '3.5 MB'}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    {mat.fileType === 'video' ? (
                      <button
                        type="button"
                        onClick={() => setActiveVideoMaterial(mat)}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-rose-600 px-3 py-2 text-xs font-bold text-white shadow-md shadow-rose-600/20 hover:bg-rose-500 transition active:scale-95"
                      >
                        <Play className="h-3.5 w-3.5 fill-current" />
                        <span>ভিডিও দেখুন</span>
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => setActiveDocMaterial(mat)}
                          className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-500 transition active:scale-95"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>অনলাইনে পড়ুন</span>
                        </button>
                        <a
                          href={mat.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 transition"
                          title="ডাউনলোড ফাইল"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </a>
                      </>
                    )}

                    {role !== 'STUDENT' && (
                      <button
                        type="button"
                        onClick={() => setMaterialToDelete(mat)}
                        className="rounded-xl p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                        title="রিসোর্স মুছুন"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Interactive Video Lecture Player Modal */}
      {activeVideoMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl bg-slate-900 shadow-2xl border border-slate-800 text-white my-8">
            <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-600 text-white shadow-md">
                  <Play className="h-4 w-4 fill-current" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white line-clamp-1">
                    {activeVideoMaterial.title}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {activeVideoMaterial.subjectCode} • {activeVideoMaterial.subjectName} • শিক্ষক: {activeVideoMaterial.teacherName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveVideoMaterial(null)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Video Player */}
            <div className="aspect-video w-full bg-black">
              <iframe
                src={activeVideoMaterial.fileUrl}
                title={activeVideoMaterial.title}
                className="h-full w-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Video Info & Key Topics */}
            <div className="p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-slate-400">ক্লাস বিবরণী:</div>
                  <p className="text-xs text-slate-200 leading-relaxed max-w-2xl">
                    {activeVideoMaterial.description}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleBookmark(activeVideoMaterial.id)}
                    className="flex items-center gap-1.5 rounded-xl bg-slate-800 px-3 py-2 text-xs font-bold text-amber-400 hover:bg-slate-700"
                  >
                    <Bookmark className="h-3.5 w-3.5" />
                    <span>বুকমার্কে রাখুন</span>
                  </button>
                </div>
              </div>

              {/* Timestamp Chapters */}
              <div>
                <div className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-indigo-400" />
                  লেকচারের গুরুত্বপূর্ণ টপিক ও টাইমস্ট্যাম্প (Key Chapters):
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="rounded-xl bg-slate-800/60 p-2.5 border border-slate-800">
                    <span className="font-mono font-bold text-rose-400">00:00</span>
                    <div className="text-[11px] text-slate-300 mt-0.5">পরিচিতি ও সিলেবাস ওভারভিউ</div>
                  </div>
                  <div className="rounded-xl bg-slate-800/60 p-2.5 border border-slate-800">
                    <span className="font-mono font-bold text-rose-400">12:30</span>
                    <div className="text-[11px] text-slate-300 mt-0.5">মূল থিওরি ও ভিজ্যুয়ালাইজেশন</div>
                  </div>
                  <div className="rounded-xl bg-slate-800/60 p-2.5 border border-slate-800">
                    <span className="font-mono font-bold text-rose-400">26:45</span>
                    <div className="text-[11px] text-slate-300 mt-0.5">লাইভ কোডিং ও এক্সপেরিমেন্ট</div>
                  </div>
                  <div className="rounded-xl bg-slate-800/60 p-2.5 border border-slate-800">
                    <span className="font-mono font-bold text-rose-400">38:10</span>
                    <div className="text-[11px] text-slate-300 mt-0.5">পরীক্ষার সম্ভাব্য প্রশ্নোত্তর</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Online PDF Reader / Document Viewer Modal */}
      {activeDocMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-3xl rounded-3xl bg-white shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-950">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                    {activeDocMaterial.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {activeDocMaterial.subjectCode} • {activeDocMaterial.subjectName} • {activeDocMaterial.pages || 32} পৃষ্ঠা
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={activeDocMaterial.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-500 shadow-sm"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>PDF ডাউনলোড</span>
                </a>

                <button
                  onClick={() => setActiveDocMaterial(null)}
                  className="rounded-xl p-2 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Document Reader Canvas */}
            <div className="p-6 max-h-[65vh] overflow-y-auto space-y-5 bg-slate-50/50 dark:bg-slate-950/40">
              {/* Document Cover Header */}
              <div className="rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm dark:border-indigo-950 dark:bg-slate-900 space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                  <GraduationCap className="h-3.5 w-3.5" />
                  অফিসিয়াল ডিপার্টমেন্টাল স্টাডি শিট
                </div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                  {activeDocMaterial.title}
                </h2>
                <div className="text-xs text-slate-500 dark:text-slate-400 flex flex-wrap gap-3">
                  <span>বিভাগ: {activeDocMaterial.department}</span>
                  <span>•</span>
                  <span>সেমিস্টার: {activeDocMaterial.semester}</span>
                  <span>•</span>
                  <span>শিক্ষক: {activeDocMaterial.teacherName}</span>
                </div>
              </div>

              {/* Document Overview Section */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  লেকচার সামারি ও সারসংক্ষেপ (Executive Summary)
                </h4>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {activeDocMaterial.description}
                </p>

                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                    🎯 এই অধ্যায় শেষে যা শিখতে পারবেন (Key Learning Outcomes):
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 list-disc list-inside">
                    <li>মৌলিক আর্কিটেকচার এবং কনসেপচুয়াল ডায়াগ্রাম ব্যাখ্যা করার দক্ষতা।</li>
                    <li>বাস্তব জীবনের অ্যালগরিদম ও বাস্তবায়ন পদ্ধতিসমূহের তুলনামূলক বিশ্লেষণ।</li>
                    <li>বোর্ড ফাইনাল ও মিডটার্ম পরীক্ষার সংক্ষিপ্ত এবং রচনামূলক প্রশ্নের পূর্ণাঙ্গ প্রস্তুতি।</li>
                    <li>প্র্যাকটিক্যাল ল্যাব কোড এবং ভেরিফাইড এক্সপেরিমেন্ট ডেটা অ্যানালাইসিস।</li>
                  </ul>
                </div>
              </div>

              {/* Sample PDF Preview Sheet */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 text-xs font-mono space-y-3">
                <div className="flex items-center justify-between text-slate-400 text-[11px] pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span>PAGE 1 OF {activeDocMaterial.pages || 32}</span>
                  <span>OFFICIAL LECTURE TRANSCRIPT</span>
                </div>
                <div className="text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
                  <h5 className="font-bold text-sm mb-2 font-mono">1.1 Introduction & Foundational Concepts</h5>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">
                    The core principles outlined in this unit establish the theoretical framework necessary for solving complex engineering tasks. Follow the structured step-by-step methodology outlined in the accompanying lab exercises.
                  </p>
                  <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-xl text-slate-800 dark:text-slate-200 font-mono text-[11px]">
                    // Key Formula / Definition Reference<br />
                    F(x) = ∑ [W_i * Input_i] + Bias<br />
                    Status: Verified for Semester Final Examination Syllabus
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-3.5 dark:border-slate-800 dark:bg-slate-950 text-xs">
              <div className="text-slate-500">
                পুরো ডকুমেন্টটি অফলাইনে পড়তে ডাউনলোড বাটনে ক্লিক করুন।
              </div>
              <a
                href={activeDocMaterial.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 font-bold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 transition"
              >
                <Download className="h-3.5 w-3.5" />
                <span>সম্পূর্ণ PDF ফাইল সেভ করুন</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Upload New Material Modal (Teacher/HOD/Admin) */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                  <Plus className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    নতুন স্টাডি ম্যাটেরিয়াল আপলোড করুন
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    শিক্ষার্থীদের জন্য লেকচার স্লাইড, ভিডিও বা প্রশ্নব্যাংক যুক্ত করুন
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMaterial} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  ম্যাটেরিয়াল শিরোনাম (Title) *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="যেমন: Python Object-Oriented Programming Lecture 04"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">রিসোর্স ধরন (Category)</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as any)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  >
                    <option value="Lecture Notes">লেকচার স্লাইড (PDF)</option>
                    <option value="Video Class">ভিডিও ক্লাস (Video)</option>
                    <option value="Hand Notes">হ্যান্ড নোটস</option>
                    <option value="Lab Manual">ল্যাব ম্যানুয়াল</option>
                    <option value="Question Bank">প্রশ্নব্যাংক</option>
                    <option value="Cheat Sheet">চিট শিট</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">ফাইল টাইপ (File Type)</label>
                  <select
                    value={newFileType}
                    onChange={e => setNewFileType(e.target.value as any)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  >
                    <option value="pdf">PDF Document (.pdf)</option>
                    <option value="video">ভিডিও লিংক (YouTube / Stream)</option>
                    <option value="docx">Word Document (.docx)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">বিষয় কোড (Subject Code)</label>
                  <input
                    type="text"
                    value={newSubjectCode}
                    onChange={e => setNewSubjectCode(e.target.value)}
                    placeholder="যেমন: CST-401"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-mono font-bold text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">বিষয়ের নাম (Subject Name)</label>
                  <input
                    type="text"
                    value={newSubjectName}
                    onChange={e => setNewSubjectName(e.target.value)}
                    placeholder="যেমন: Python Programming"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">ডিপার্টমেন্ট (Department)</label>
                  <select
                    value={newDepartment}
                    onChange={e => setNewDepartment(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  >
                    <option value="কম্পিউটার সায়েন্স অ্যান্ড ইঞ্জিনিয়ারিং (CST)">Computer (CST)</option>
                    <option value="ইলেকট্রিক্যাল টেকনোলজি (EEE)">Electrical (EEE)</option>
                    <option value="ইলেকট্রনিক্স টেকনোলজি (ENT)">Electronics (ENT)</option>
                    <option value="নন-টেক ডিপার্টমেন্ট">Non-Tech</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">সেমিস্টার (Semester)</label>
                  <select
                    value={newSemester}
                    onChange={e => setNewSemester(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  >
                    <option value="১ম সেমিস্টার">১ম সেমিস্টার</option>
                    <option value="২য় সেমিস্টার">২য় সেমিস্টার</option>
                    <option value="৩য় সেমিস্টার">৩য় সেমিস্টার</option>
                    <option value="৪র্থ সেমিস্টার">৪র্থ সেমিস্টার</option>
                    <option value="৫ম সেমিস্টার">৫ম সেমিস্টার</option>
                    <option value="৬ষ্ঠ সেমিস্টার">৬ষ্ঠ সেমিস্টার</option>
                    <option value="৭ম সেমিস্টার">৭ম সেমিস্টার</option>
                    <option value="৮ম সেমিস্টার">৮ম সেমিস্টার</option>
                    <option value="সকল সেমিস্টার">সকল সেমিস্টার</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  {newFileType === 'video' ? 'ভিডিও এমবেড / ইউটিউব লিংক (Video URL)' : 'ডাউনলোড বা ড্রাইভ লিংক (File URL)'}
                </label>
                <input
                  type="text"
                  value={newFileUrl}
                  onChange={e => setNewFileUrl(e.target.value)}
                  placeholder={
                    newFileType === 'video'
                      ? 'https://www.youtube.com/embed/...'
                      : 'https://campus-drive.edu/materials/lecture.pdf'
                  }
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">বিবরণী ও নির্দেশনা (Description)</label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  placeholder="লেকচারের মূল টপিক এবং শিক্ষার্থীদের জন্য প্রাসঙ্গিক নোট লিখুন..."
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition"
                >
                  আপলোড ও প্রকাশ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {materialToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 mx-auto mb-4">
              <Trash2 className="h-6 w-6" />
            </div>

            <h3 className="text-center text-lg font-bold text-slate-900 dark:text-white">
              ম্যাটেরিয়াল মুছে ফেলতে চান?
            </h3>
            <p className="mt-2 text-center text-xs text-slate-500 dark:text-slate-400">
              আপনি কি নিশ্চিতভাবে <span className="font-bold text-slate-800 dark:text-slate-200">"{materialToDelete.title}"</span> স্টাডি পোর্টাল থেকে অপসারণ করতে চান?
            </p>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setMaterialToDelete(null)}
                className="flex-1 rounded-2xl bg-slate-100 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteMaterial(materialToDelete.id);
                  setMaterialToDelete(null);
                }}
                className="flex-1 rounded-2xl bg-rose-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-rose-600/30 hover:bg-rose-700"
              >
                মুছে ফেলুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
