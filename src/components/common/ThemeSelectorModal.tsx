import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sun,
  Moon,
  Laptop,
  Globe,
  Palette,
  Check,
  X,
  Sparkles
} from 'lucide-react';
import { ColorMode, AccentColor, Language } from '../../types';

interface ThemeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({ isOpen, onClose }) => {
  const {
    colorMode,
    setColorMode,
    accentColor,
    setAccentColor,
    language,
    setLanguage,
    t
  } = useApp();

  if (!isOpen) return null;

  const isBN = language === 'BN';

  const modes: { id: ColorMode; label: string; sub: string; icon: React.ElementType }[] = [
    {
      id: 'light',
      label: isBN ? 'লাইট মোড' : 'Light Mode',
      sub: isBN ? 'উজ্জ্বল ও পরিচ্ছন্ন' : 'Bright & clear',
      icon: Sun
    },
    {
      id: 'dark',
      label: isBN ? 'ডার্ক মোড' : 'Dark Mode',
      sub: isBN ? 'চোখের জন্য আরামদায়ক' : 'Relaxing & deep dark',
      icon: Moon
    },
    {
      id: 'system',
      label: isBN ? 'সিস্টেম অটো' : 'System Auto',
      sub: isBN ? 'ডিভাইস সেটিংস অনুসরণ' : 'Sync with OS setting',
      icon: Laptop
    }
  ];

  const accents: { id: AccentColor; name: string; color: string; border: string }[] = [
    { id: 'indigo', name: isBN ? 'ইন্ডিগো (Indigo)' : 'Indigo Blue', color: 'bg-indigo-600', border: 'border-indigo-600' },
    { id: 'emerald', name: isBN ? 'পান্না সবুজ (Emerald)' : 'Emerald Green', color: 'bg-emerald-600', border: 'border-emerald-600' },
    { id: 'blue', name: isBN ? 'সমুদ্র নীল (Ocean)' : 'Ocean Blue', color: 'bg-sky-600', border: 'border-sky-600' },
    { id: 'purple', name: isBN ? 'রয়্যাল পার্পল (Purple)' : 'Royal Purple', color: 'bg-purple-600', border: 'border-purple-600' },
    { id: 'amber', name: isBN ? 'অ্যাম্বার গোল্ড (Amber)' : 'Amber Gold', color: 'bg-amber-500', border: 'border-amber-500' }
  ];

  const languages: { id: Language; name: string; nativeName: string; flag: string }[] = [
    { id: 'BN', name: 'বাংলা', nativeName: 'Bangla (বাংলা)', flag: '🇧🇩' },
    { id: 'EN', name: 'English', nativeName: 'English (US/UK)', flag: '🇬🇧' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl transition-all dark:border-slate-800 dark:bg-slate-900"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <Palette className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {t('colorThemeTitle')}
              </h3>
              <p className="text-xs text-slate-400">
                {t('themeDescription')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Section 1: Language Switcher */}
        <div className="mt-5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Globe className="h-3.5 w-3.5 text-indigo-500" />
            <span>{isBN ? 'অ্যাপের ভাষা (Language)' : 'App Language'}</span>
          </label>

          <div className="mt-2.5 grid grid-cols-2 gap-3">
            {languages.map(item => {
              const active = language === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setLanguage(item.id)}
                  className={`flex items-center justify-between rounded-2xl border p-3 text-left transition-all ${
                    active
                      ? 'border-indigo-600 bg-indigo-50/70 shadow-sm dark:border-indigo-500 dark:bg-indigo-950/40'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/80 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{item.flag}</span>
                    <div>
                      <div className={`text-xs font-bold ${active ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-800 dark:text-slate-200'}`}>
                        {item.name}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {item.nativeName}
                      </div>
                    </div>
                  </div>
                  {active && (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white dark:bg-indigo-500">
                      <Check className="h-3 w-3" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Color Mode (Light / Dark / System) */}
        <div className="mt-5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Sun className="h-3.5 w-3.5 text-amber-500" />
            <span>{isBN ? 'ডিসপ্লে মোড (Color Mode)' : 'Display Mode'}</span>
          </label>

          <div className="mt-2.5 grid grid-cols-3 gap-2.5">
            {modes.map(mode => {
              const Icon = mode.icon;
              const active = colorMode === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => setColorMode(mode.id)}
                  className={`flex flex-col items-center justify-center rounded-2xl border p-3 text-center transition-all ${
                    active
                      ? 'border-indigo-600 bg-indigo-50/70 shadow-sm dark:border-indigo-500 dark:bg-indigo-950/40'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/80 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className={`flex h-9 w-9 items-center justify-center rounded-xl mb-1.5 ${
                    active
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-200/70 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                  }`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className={`text-xs font-bold ${active ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-800 dark:text-slate-200'}`}>
                    {mode.label}
                  </div>
                  <div className="text-[9px] text-slate-400 mt-0.5 line-clamp-1">
                    {mode.sub}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 3: Color Accents */}
        <div className="mt-5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-violet-500" />
            <span>{isBN ? 'অ্যাকসেন্ট কালার (Theme Accent)' : 'Accent Color'}</span>
          </label>

          <div className="mt-2.5 flex items-center justify-between gap-2 p-2 rounded-2xl border border-slate-200/80 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/40">
            {accents.map(acc => {
              const active = accentColor === acc.id;
              return (
                <button
                  key={acc.id}
                  onClick={() => setAccentColor(acc.id)}
                  className={`group relative flex flex-1 flex-col items-center py-1.5 px-1 rounded-xl transition ${
                    active ? 'bg-white shadow-sm dark:bg-slate-800' : 'hover:bg-slate-200/40 dark:hover:bg-slate-700/40'
                  }`}
                  title={acc.name}
                >
                  <div className={`h-6 w-6 rounded-full ${acc.color} flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-110`}>
                    {active && <Check className="h-3.5 w-3.5" />}
                  </div>
                  <span className="text-[10px] font-medium text-slate-600 dark:text-slate-300 mt-1 line-clamp-1">
                    {acc.id}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Done Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="w-full rounded-2xl bg-indigo-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition"
          >
            {isBN ? 'সেভ ও সম্পন্ন করুন (Apply)' : 'Apply & Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
