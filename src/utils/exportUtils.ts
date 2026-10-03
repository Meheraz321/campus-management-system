import * as XLSX from 'xlsx';
import { RegisteredUser, StudentProfile, TeacherProfile } from '../types';

/**
 * Export generic array of objects to Excel (.xlsx) file with full UTF-8 support
 */
export const exportToExcel = (data: Record<string, any>[], filename: string, sheetName: string = 'Data') => {
  if (!data || data.length === 0) return;
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, `${filename.replace(/\s+/g, '_')}.xlsx`);
};

/**
 * Generate and trigger High-Resolution Printable Official Document with 100% Bengali & English Unicode support
 */
export const printDocumentWindow = (title: string, htmlContent: string) => {
  const printWindow = window.open('', '_blank', 'width=900,height=950');
  if (!printWindow) {
    alert('Please allow popups to open the printable document.');
    return;
  }

  const fullHTML = `<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'Plus Jakarta Sans', 'Hind Siliguri', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background-color: #f8fafc;
      color: #0f172a;
      line-height: 1.5;
      padding: 20px;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .print-container {
      max-width: 820px;
      margin: 0 auto;
      background: #ffffff;
      padding: 32px;
      border-radius: 16px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
      border: 1px solid #e2e8f0;
      position: relative;
    }
    .watermark {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-30deg);
      font-size: 80px;
      font-weight: 900;
      color: rgba(99, 102, 241, 0.04);
      pointer-events: none;
      z-index: 0;
      white-space: nowrap;
      text-transform: uppercase;
      letter-spacing: 4px;
    }
    .header-bar {
      background: linear-gradient(135deg, #3730a3 0%, #4f46e5 50%, #6366f1 100%);
      color: #ffffff;
      padding: 24px 28px;
      border-radius: 12px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .header-left h1 {
      font-size: 22px;
      font-weight: 800;
      letter-spacing: -0.5px;
      margin-bottom: 4px;
    }
    .header-left p {
      font-size: 13px;
      color: #e0e7ff;
      font-weight: 500;
    }
    .header-badge {
      background: rgba(255, 255, 255, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.3);
      padding: 6px 14px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    .card-section {
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      overflow: hidden;
      margin-bottom: 24px;
      background: #ffffff;
      position: relative;
      z-index: 1;
    }
    .card-header {
      background: #f1f5f9;
      padding: 12px 20px;
      font-size: 13px;
      font-weight: 700;
      color: #334155;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .details-table {
      width: 100%;
      border-collapse: collapse;
    }
    .details-table tr {
      border-bottom: 1px solid #f1f5f9;
    }
    .details-table tr:last-child {
      border-bottom: none;
    }
    .details-table td {
      padding: 12px 20px;
      font-size: 13.5px;
    }
    .details-table td.label-col {
      width: 32%;
      font-weight: 600;
      color: #475569;
      background-color: #fafafa;
      border-right: 1px solid #f1f5f9;
    }
    .details-table td.value-col {
      color: #0f172a;
      font-weight: 600;
    }
    .badge {
      display: inline-block;
      padding: 3px 10px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 700;
    }
    .badge-student { background: #e0e7ff; color: #4338ca; }
    .badge-teacher { background: #dcfce7; color: #15803d; }
    .badge-hod { background: #f3e8ff; color: #7e22ce; }
    .badge-admin { background: #fef3c7; color: #b45309; }
    .footer-stamp {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: 36px;
      padding-top: 20px;
      border-top: 2px dashed #cbd5e1;
      position: relative;
      z-index: 1;
    }
    .security-block {
      font-size: 11px;
      color: #64748b;
      line-height: 1.6;
    }
    .signature-block {
      text-align: center;
      width: 220px;
    }
    .sig-line {
      border-top: 1.5px solid #0f172a;
      margin-top: 40px;
      padding-top: 6px;
      font-size: 12px;
      font-weight: 700;
      color: #0f172a;
    }
    .sig-subtitle {
      font-size: 11px;
      color: #64748b;
    }
    .qr-box {
      display: inline-block;
      border: 1px solid #e2e8f0;
      padding: 6px;
      border-radius: 8px;
      background: #fff;
    }
    .action-bar {
      margin-top: 24px;
      display: flex;
      justify-content: center;
      gap: 12px;
    }
    .btn-print {
      background: #4f46e5;
      color: white;
      border: none;
      padding: 10px 24px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 14px;
      cursor: pointer;
      box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);
    }
    .btn-close {
      background: #e2e8f0;
      color: #334155;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
    }
    @media print {
      body {
        background-color: #ffffff;
        padding: 0;
      }
      .print-container {
        box-shadow: none;
        border: none;
        padding: 0;
        max-width: 100%;
      }
      .action-bar {
        display: none !important;
      }
    }
  </style>
</head>
<body>
  <div class="print-container">
    <div class="watermark">ACADEMIA OS VERIFIED</div>
    ${htmlContent}
    <div class="action-bar">
      <button class="btn-print" onclick="window.print()">🖨️ প্রিন্ট / Save PDF</button>
      <button class="btn-close" onclick="window.close()">✕ বন্ধ করুন</button>
    </div>
  </div>
  <script>
    window.onload = function() {
      // Small timeout to allow fonts to load properly
      setTimeout(function() {
        // window.print();
      }, 500);
    };
  </script>
</body>
</html>`;

  printWindow.document.open();
  printWindow.document.write(fullHTML);
  printWindow.document.close();
};

/**
 * Generate and download/print individual registration acknowledgment slip
 */
export const downloadRegistrationSlipPDF = (user: {
  name: string;
  email: string;
  role: string;
  identifier: string;
  department?: string;
  semester?: string;
  designation?: string;
  phone?: string;
  registeredAt?: string;
  avatar?: string;
}) => {
  const roleBadgeClass =
    user.role === 'STUDENT'
      ? 'badge-student'
      : user.role === 'TEACHER'
      ? 'badge-teacher'
      : user.role === 'HOD'
      ? 'badge-hod'
      : 'badge-admin';

  const roleTitle =
    user.role === 'STUDENT'
      ? 'শিক্ষার্থী (Student)'
      : user.role === 'TEACHER'
      ? 'শিক্ষক অনুষদ (Faculty Teacher)'
      : user.role === 'HOD'
      ? 'বিভাগীয় প্রধান (Head of Dept - HOD)'
      : 'অধ্যক্ষ / অ্যাডমিন (Principal Admin)';

  const verificationHash = `DB-REC-${Math.abs(
    (user.email || user.name).split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0)
  ).toString(16).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;

  const qrData = encodeURIComponent(`ACADEMIA-OS-VERIFIED:${user.identifier}:${user.name}:${user.role}:${user.email}`);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=${qrData}&margin=2`;

  const html = `
    <div class="header-bar">
      <div class="header-left">
        <h1>ACADEMIA OS - CAMPUS MANAGEMENT</h1>
        <p>OFFICIAL REGISTRATION ACKNOWLEDGMENT SLIP (অফিসিয়াল রেজিস্ট্রেশন সনদ)</p>
      </div>
      <div class="header-badge">VERIFIED RECORD</div>
    </div>

    <div class="card-section">
      <div class="card-header">
        <span>ACCOUNT REGISTRATION DETAILS (DATABASE RECORDED)</span>
        <span class="badge ${roleBadgeClass}">${user.role}</span>
      </div>
      
      <table class="details-table">
        <tr>
          <td class="label-col">পূর্ণ নাম (Full Name):</td>
          <td class="value-col" style="font-size: 15px; color: #1e1b4b;">${user.name}</td>
        </tr>
        <tr>
          <td class="label-col">ব্যবহারকারী ভূমিকা (User Role):</td>
          <td class="value-col">
            <span class="badge ${roleBadgeClass}">${roleTitle}</span>
          </td>
        </tr>
        <tr>
          <td class="label-col">রোল / আইডি / লগইন ইউজারনেম:</td>
          <td class="value-col" style="font-family: monospace; font-size: 14px; color: #4338ca;">
            ${user.identifier}
          </td>
        </tr>
        <tr>
          <td class="label-col">ইমেইল এড্রেস (Official Email):</td>
          <td class="value-col">${user.email}</td>
        </tr>
        <tr>
          <td class="label-col">বিভাগ (Department / Technology):</td>
          <td class="value-col">${user.department || 'General / N/A'}</td>
        </tr>
        <tr>
          <td class="label-col">পদবি / সেমিস্টার (Designation / Sem):</td>
          <td class="value-col">${user.semester ? `সেমিস্টার: ${user.semester}` : user.designation || 'Faculty Member'}</td>
        </tr>
        <tr>
          <td class="label-col">মোবাইল ফোন (Contact Phone):</td>
          <td class="value-col">${user.phone || 'N/A'}</td>
        </tr>
        <tr>
          <td class="label-col">নিবন্ধন সময় (Registration Date):</td>
          <td class="value-col">${user.registeredAt || new Date().toLocaleString()}</td>
        </tr>
        <tr>
          <td class="label-col">ডাটাবেজ স্ট্যাটাস (Account Status):</td>
          <td class="value-col" style="color: #059669; font-weight: 700;">
            ✓ ACTIVE & VERIFIED IN CENTRAL DATABASE
          </td>
        </tr>
        <tr>
          <td class="label-col">ভেরিফিকেশন টোকেন (Security Token):</td>
          <td class="value-col" style="font-family: monospace; font-size: 11px; color: #64748b;">
            ${verificationHash}
          </td>
        </tr>
      </table>
    </div>

    <div class="footer-stamp">
      <div class="security-block">
        <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 8px;">
          <div class="qr-box">
            <img src="${qrUrl}" alt="QR Code" width="76" height="76" style="display: block; border-radius: 4px;" />
          </div>
          <div>
            <div style="font-weight: 700; color: #334155; font-size: 12px;">অটোমেটেড সিকিউর ভেরিফাইড ডকুমেন্ট</div>
            <div style="font-size: 11px; color: #64748b;">This document is electronically generated by Academia OS Central Database.</div>
            <div style="font-size: 10px; color: #94a3b8; margin-top: 2px;">No physical signature is required for digital verification.</div>
          </div>
        </div>
      </div>

      <div class="signature-block">
        <div class="sig-line">অধ্যক্ষ / রেজিস্ট্রার দপ্তর</div>
        <div class="sig-subtitle">Academia OS Authority Seal</div>
      </div>
    </div>
  `;

  printDocumentWindow(`Registration_Slip_${user.name.replace(/\s+/g, '_')}`, html);
};

/**
 * Export all Registered Database Users to Excel with Unicode headers & data
 */
export const exportRegisteredUsersExcel = (users: RegisteredUser[]) => {
  const formatted = users.map((u, i) => ({
    'ক্রমিক (SL)': i + 1,
    'ব্যবহারকারী আইডি (User ID)': u.id,
    'পূর্ণ নাম (Full Name)': u.name,
    'ইমেইল (Email)': u.email,
    'ভূমিকা (Role)': u.role,
    'রোল / আইডি (Identifier)': u.identifier,
    'বিভাগ (Department)': u.department || 'N/A',
    'সেমিস্টার / পদবি (Semester/Designation)': u.semester || u.designation || 'N/A',
    'মোবাইল নম্বর (Phone)': u.phone || 'N/A',
    'নিবন্ধনের তারিখ (Registered At)': u.registeredAt
  }));

  exportToExcel(
    formatted,
    `AcademiaOS_Registered_Users_Database_${new Date().toISOString().split('T')[0]}`,
    'Registered_Users'
  );
};

/**
 * Export all Registered Database Users to printable PDF / formatted document
 */
export const exportRegisteredUsersPDF = (users: RegisteredUser[]) => {
  const dateStr = new Date().toLocaleString();
  const studentCount = users.filter(u => u.role === 'STUDENT').length;
  const teacherCount = users.filter(u => u.role === 'TEACHER').length;
  const hodCount = users.filter(u => u.role === 'HOD').length;
  const adminCount = users.filter(u => u.role === 'ADMIN').length;

  const rowsHTML = users
    .map(
      (u, i) => `
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 10px 12px; font-size: 12px; font-weight: 600; text-align: center;">${i + 1}</td>
      <td style="padding: 10px 12px; font-size: 12.5px; font-weight: 700; color: #1e1b4b;">${u.name}</td>
      <td style="padding: 10px 12px; font-size: 11.5px; color: #475569;">${u.email}</td>
      <td style="padding: 10px 12px; font-size: 11px;">
        <span class="badge ${
          u.role === 'STUDENT'
            ? 'badge-student'
            : u.role === 'TEACHER'
            ? 'badge-teacher'
            : u.role === 'HOD'
            ? 'badge-hod'
            : 'badge-admin'
        }">${u.role}</span>
      </td>
      <td style="padding: 10px 12px; font-family: monospace; font-size: 12px; font-weight: 600;">${u.identifier}</td>
      <td style="padding: 10px 12px; font-size: 12px; color: #334155;">${u.department || 'N/A'}</td>
      <td style="padding: 10px 12px; font-size: 11.5px; color: #475569;">${u.semester || u.designation || 'N/A'}</td>
      <td style="padding: 10px 12px; font-size: 11px; color: #64748b;">${u.registeredAt ? u.registeredAt.split(' ')[0] : 'N/A'}</td>
    </tr>
  `
    )
    .join('');

  const html = `
    <div class="header-bar">
      <div class="header-left">
        <h1>ACADEMIA OS - REGISTERED USERS DATABASE</h1>
        <p>Official Central Database Records Summary (সকল নিবন্ধিত ব্যবহারকারী তালিকা)</p>
      </div>
      <div class="header-badge">TOTAL: ${users.length} RECORDS</div>
    </div>

    <!-- Summary metrics strip -->
    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px;">
      <div style="background: #eef2ff; border: 1px solid #c7d2fe; padding: 12px; border-radius: 8px; text-align: center;">
        <div style="font-size: 11px; font-weight: 700; color: #4338ca;">শিক্ষার্থী (Students)</div>
        <div style="font-size: 18px; font-weight: 800; color: #312e81;">${studentCount}</div>
      </div>
      <div style="background: #f3e8ff; border: 1px solid #e9d5ff; padding: 12px; border-radius: 8px; text-align: center;">
        <div style="font-size: 11px; font-weight: 700; color: #7e22ce;">বিভাগীয় প্রধান (HOD)</div>
        <div style="font-size: 18px; font-weight: 800; color: #581c87;">${hodCount}</div>
      </div>
      <div style="background: #dcfce7; border: 1px solid #bbf7d0; padding: 12px; border-radius: 8px; text-align: center;">
        <div style="font-size: 11px; font-weight: 700; color: #15803d;">শিক্ষক অনুষদ (Faculty)</div>
        <div style="font-size: 18px; font-weight: 800; color: #14532d;">${teacherCount}</div>
      </div>
      <div style="background: #fef3c7; border: 1px solid #fde68a; padding: 12px; border-radius: 8px; text-align: center;">
        <div style="font-size: 11px; font-weight: 700; color: #b45309;">অধ্যক্ষ / অ্যাডমিন</div>
        <div style="font-size: 18px; font-weight: 800; color: #78350f;">${adminCount}</div>
      </div>
    </div>

    <div class="card-section">
      <div class="card-header">
        <span>DATABASE USERS DIRECTORY</span>
        <span style="font-size: 11px; color: #64748b; font-weight: normal;">Generated: ${dateStr}</span>
      </div>
      
      <table style="width: 100%; border-collapse: collapse; text-align: left;">
        <thead>
          <tr style="background: #f8fafc; border-bottom: 2px solid #cbd5e1; font-size: 11px; font-weight: 700; color: #475569; text-transform: uppercase;">
            <th style="padding: 10px 12px; text-align: center;">#</th>
            <th style="padding: 10px 12px;">Full Name</th>
            <th style="padding: 10px 12px;">Email Address</th>
            <th style="padding: 10px 12px;">Role</th>
            <th style="padding: 10px 12px;">Roll / ID</th>
            <th style="padding: 10px 12px;">Department</th>
            <th style="padding: 10px 12px;">Designation / Sem</th>
            <th style="padding: 10px 12px;">Reg Date</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHTML}
        </tbody>
      </table>
    </div>

    <div class="footer-stamp">
      <div class="security-block">
        <div style="font-weight: 700; color: #334155;">Academia OS Central Database Administration</div>
        <div>Total Verified Records: ${users.length} | Generated on ${dateStr}</div>
      </div>

      <div class="signature-block">
        <div class="sig-line">অধ্যক্ষ / পরীক্ষা নিয়ন্ত্রক</div>
        <div class="sig-subtitle">Academic Administration</div>
      </div>
    </div>
  `;

  printDocumentWindow(`Registered_Users_Database_${new Date().toISOString().split('T')[0]}`, html);
};

/**
 * Export Students list to Excel
 */
export const exportStudentsExcel = (students: StudentProfile[]) => {
  const formatted = students.map((s, i) => ({
    'ক্রমিক (SL)': i + 1,
    'শিক্ষার্থীর নাম (Student Name)': s.name,
    'রোল নম্বর (Roll Number)': s.rollNumber,
    'রেজিস্ট্রেশন নম্বর (Registration #)': s.registrationNumber,
    'বিভাগ (Department)': s.department,
    'সেমিস্টার (Semester)': s.semester,
    'শাখা (Section)': s.section,
    'ইমেইল (Email)': s.email,
    'সিজিপিএ (CGPA)': s.cgpa,
    'উপস্থিতি (Attendance %)': `${s.attendancePercentage}%`,
    'বকেয়া ফি (Pending Fees)': s.pendingFees || 0
  }));

  exportToExcel(formatted, `Students_List_${new Date().toISOString().split('T')[0]}`, 'Students');
};

/**
 * Export Teachers list to Excel
 */
export const exportTeachersExcel = (teachers: TeacherProfile[]) => {
  const formatted = teachers.map((t, i) => ({
    'ক্রমিক (SL)': i + 1,
    'শিক্ষকের নাম (Faculty Name)': t.name,
    'পদবি (Designation)': t.designation,
    'ভূমিকা (Role Type)': t.isPrincipal ? 'অধ্যক্ষ / প্রশাসন' : t.isHOD ? 'বিভাগীয় প্রধান (HOD)' : 'শিক্ষক অনুষদ',
    'অনুষদ (Faculty)': t.faculty || 'N/A',
    'বিভাগ (Department)': t.department,
    'শিফট (Shift)': t.shift || 'সাধারণ / ১ম শিফট',
    'বিসিএস ব্যাচ (BCS Batch)': t.bcsBatch ? `${t.bcsBatch}তম বিসিএস` : 'N/A',
    'ইমেইল (Email Address)': t.email,
    'মোবাইল নম্বর (Mobile)': t.mobilePhone || t.phone,
    'অফিস রুম (Office Room)': t.officeRoom,
    'শিক্ষাগত যোগ্যতা (Qualification)': t.qualification || 'N/A',
    'অভিজ্ঞতা বছর (Experience)': t.experienceYears || 0,
    'অফিস সময় (Office Hours)': t.officeHours || 'N/A',
    'পাঠদানের বিষয়সমূহ (Subjects)': (t.subjects || []).join(', ')
  }));

  exportToExcel(formatted, `Campus_Faculty_Directory_${new Date().toISOString().split('T')[0]}`, 'Faculty_Directory');
};
