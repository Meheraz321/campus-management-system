import React from 'react';
import { useApp } from '../../context/AppContext';
import { MapPin, Phone, Mail, Globe, BookOpen, Building2, Shield, Users } from 'lucide-react';

export const CampusInfoModule: React.FC = () => {
  const { language } = useApp();
  const isBN = language === 'BN';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
          {isBN ? 'ক্যাম্পাস তথ্য ও নির্দেশিকা' : 'Campus Information & Directory'}
        </h1>
        <p className="text-xs text-slate-500">
          {isBN 
            ? 'ভার্চুয়াল ক্যাম্পাস নির্দেশিকা, জরুরি হেল্পলাইন নম্বর এবং সেন্ট্রাল লাইব্রেরি আর্কাইভ।'
            : 'Virtual campus guide, faculty directory, emergency helpline numbers, and library archives.'}
        </p>
      </div>

      {/* Campus Hero Image */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white shadow-xl h-48 sm:h-64">
        <img
          src="https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1200&q=80"
          alt="Campus Grounds"
          className="h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent p-6 flex flex-col justify-end">
          <span className="rounded-full bg-indigo-600/80 px-3 py-1 text-[10px] font-bold tracking-wider uppercase backdrop-blur-md w-fit">
            {isBN ? 'মূল ক্যাম্পাস' : 'Main Campus'}
          </span>
          <h2 className="mt-2 text-xl font-extrabold sm:text-2xl">
            Academia Institute of Science & Technology
          </h2>
          <p className="text-xs text-slate-300">
            {isBN ? '১০০ ইউনিভার্সিটি বুলেভার্ড, টেক ডিস্ট্রিক্ট, ঢাকা' : '100 University Boulevard, Tech District, City Center'}
          </p>
        </div>
      </div>

      {/* Grid Features */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Contact Info */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2 mb-3">
            <Phone className="h-5 w-5 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {isBN ? 'জরুরি হেল্পলাইন নম্বর' : 'Emergency Helplines'}
            </h3>
          </div>
          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <div>{isBN ? '📞 ক্যাম্পাস নিরাপত্তা: +৮৮০ ২-৯৯৬৬৫৫' : '📞 Campus Security: +1 (800) 555-CAMPUS'}</div>
            <div>{isBN ? '🏥 মেডিকেল সেন্টার: +৮৮০ ২-৯৯৬৬৫৬' : '🏥 Health Center: +1 (800) 555-CLINIC'}</div>
            <div>{isBN ? '📧 হেল্পডেস্ক: support@campus.edu' : '📧 Helpdesk: support@campus.edu'}</div>
          </div>
        </div>

        {/* Library Info */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="h-5 w-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {isBN ? 'সেন্ট্রাল লাইব্রেরি' : 'Central Library'}
            </h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            {isBN 
              ? 'শনিবার - বৃহস্পতিবার: সকাল ০৮:০০ - রাত ১০:০০। ৫০,০০০+ ডিজিটাল জার্নাল ও গবেষণা ডাটাবেস।'
              : 'Open Monday - Saturday: 08:00 AM - 10:00 PM. Access 50,000+ digital journals and research databases.'}
          </p>
        </div>

        {/* Accreditation */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="h-5 w-5 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {isBN ? 'অনুমোদন ও স্বীকৃতি' : 'Accreditation'}
            </h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            {isBN 
              ? 'ইউজিসি ও জাতীয় বিশ্ববিদ্যালয় কর্তৃক ‘A++’ গ্রেড প্রাপ্ত এবং আন্তর্জাতিক মানের কারিকুলাম স্বীকৃত।'
              : "Grade 'A++' National Academic Accreditation Council (NAAC) & ABET Accredited Engineering Programs."}
          </p>
        </div>
      </div>
    </div>
  );
};
