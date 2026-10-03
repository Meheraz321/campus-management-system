import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { MobileNav } from './components/common/MobileNav';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { QRCodeModal } from './components/common/QRCodeModal';
import { AuthScreen } from './components/auth/AuthScreen';

// Admin Views
import { AdminDashboard } from './components/admin/AdminDashboard';
import { StudentManagement } from './components/admin/StudentManagement';
import { TeacherManagement } from './components/admin/TeacherManagement';
import { AcademicManagement } from './components/admin/AcademicManagement';
import { NoticeEventManagement } from './components/admin/NoticeEventManagement';
import { LeaveApprovals } from './components/admin/LeaveApprovals';
import { FeeManagement } from './components/admin/FeeManagement';
import { PushNotificationSender } from './components/admin/PushNotificationSender';
import { SystemSettingsLogs } from './components/admin/SystemSettingsLogs';
import { RegisteredUsersView } from './components/admin/RegisteredUsersView';
import { UserProfileView } from './components/common/UserProfileView';
import { Shield } from 'lucide-react';

// Principal Views
import { PrincipalDashboard } from './components/principal/PrincipalDashboard';

// Teacher Views
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { AttendanceMarker } from './components/teacher/AttendanceMarker';
import { AssignmentManager } from './components/teacher/AssignmentManager';
import { StudyMaterialUploader } from './components/teacher/StudyMaterialUploader';
import { ResultPublisher } from './components/teacher/ResultPublisher';
import { TeacherProfile } from './components/teacher/TeacherProfile';

// Student Views
import { StudentDashboard } from './components/student/StudentDashboard';
import { StudentAttendance } from './components/student/StudentAttendance';
import { StudentRoutineExams } from './components/student/StudentRoutineExams';
import { StudentAssignments } from './components/student/StudentAssignments';
import { StudentResults } from './components/student/StudentResults';
import { StudentFees } from './components/student/StudentFees';
import { StudentLeaveApp } from './components/student/StudentLeaveApp';

// Shared Views
import { ChatModule } from './components/common/ChatModule';
import { CampusInfoModule } from './components/common/CampusInfoModule';
import { PublicFacultyDirectory } from './components/common/PublicFacultyDirectory';

// Department Head (HOD) Views
import { DepartmentHeadDashboard } from './components/hod/DepartmentHeadDashboard';

const MainLayout: React.FC = () => {
  const { isAuthenticated, role, activeTab, setActiveTab } = useApp();

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  const renderContent = () => {
    switch (activeTab) {
      // General Dashboard Fallback
      case 'dashboard':
        if (role === 'ADMIN') return <AdminDashboard />;
        if (role === 'PRINCIPAL') return <PrincipalDashboard initialSubTab="overview" />;
        if (role === 'HOD') return <DepartmentHeadDashboard initialSubTab="overview" />;
        if (role === 'TEACHER') return <TeacherDashboard />;
        return <StudentDashboard />;

      // Principal Executive Views
      case 'dashboard_principal':
      case 'principal_dashboard':
        return <PrincipalDashboard initialSubTab="overview" />;
      case 'approvals_principal':
        return <PrincipalDashboard initialSubTab="approvals" />;
      case 'circulars_principal':
        return <PrincipalDashboard initialSubTab="circulars" />;
      case 'speech_principal':
        return <PrincipalDashboard initialSubTab="speech" />;
      case 'profile_principal':
        return <PrincipalDashboard initialSubTab="profile" />;

      // Department Head (HOD) Views
      case 'dashboard_hod':
        return <DepartmentHeadDashboard initialSubTab="overview" />;
      case 'faculty_hod':
        return <DepartmentHeadDashboard initialSubTab="faculty" />;
      case 'students_hod':
        return <DepartmentHeadDashboard initialSubTab="students" />;
      case 'routine_hod':
        return <DepartmentHeadDashboard initialSubTab="routine" />;
      case 'leaves_hod':
        return <DepartmentHeadDashboard initialSubTab="leaves" />;
      case 'notices_hod':
        return <DepartmentHeadDashboard initialSubTab="notices" />;
      case 'results_hod':
        return <DepartmentHeadDashboard initialSubTab="overview" />;

      // Admin Views
      case 'dashboard_admin':
        return <AdminDashboard />;
      case 'registered_users_db':
      case 'users_db':
        if (role !== 'ADMIN') {
          return (
            <div className="mx-auto max-w-xl p-8 text-center space-y-4 rounded-3xl border border-rose-200 bg-rose-50/50 dark:border-rose-900/50 dark:bg-rose-950/20 my-12 shadow-xl">
              <Shield className="h-12 w-12 text-rose-500 mx-auto" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Admin Access Only</h2>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                The Registered Users Database & Excel/PDF Export tools are restricted strictly to the Principal / Admin role.
              </p>
              <button
                onClick={() => setActiveTab('dashboard')}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition shadow-lg shadow-indigo-600/30"
              >
                Return to Workspace Dashboard
              </button>
            </div>
          );
        }
        return <RegisteredUsersView />;
      case 'students':
      case 'students_admin':
        return <StudentManagement />;
      case 'teachers':
      case 'teachers_admin':
        return <TeacherManagement />;
      case 'academic':
      case 'academics_admin':
        return <AcademicManagement />;
      case 'attendance_admin':
        return <AttendanceMarker />;
      case 'notices':
      case 'notices_admin':
        return <NoticeEventManagement />;
      case 'leaves_admin':
        return <LeaveApprovals />;
      case 'fees_admin':
        return <FeeManagement />;
      case 'push_notif':
      case 'push_notifications':
        return <PushNotificationSender />;
      case 'settings':
      case 'logs_admin':
        return <SystemSettingsLogs />;

      // Teacher Views
      case 'dashboard_teacher':
        return <TeacherDashboard />;
      case 'attendance_teacher':
        return <AttendanceMarker />;
      case 'assignments_teacher':
        return <AssignmentManager />;
      case 'materials_teacher':
      case 'materials_student':
        return <StudyMaterialUploader />;
      case 'routine_teacher':
        return <AcademicManagement />;
      case 'results_teacher':
        return <ResultPublisher />;
      case 'profile':
      case 'my_profile':
      case 'profile_teacher':
        return <UserProfileView />;

      // Student Views
      case 'dashboard_student':
        return <StudentDashboard />;
      case 'attendance_student':
        return <StudentAttendance />;
      case 'routine_student':
        return <StudentRoutineExams />;
      case 'assignments_student':
        return <StudentAssignments />;
      case 'results_student':
        return <StudentResults />;
      case 'fees_student':
        return <StudentFees />;
      case 'leaves_student':
      case 'leave_student':
        return <StudentLeaveApp />;

      // Shared Views
      case 'chat':
        return <ChatModule />;
      case 'directory':
      case 'faculty_directory':
        return <PublicFacultyDirectory />;
      case 'campus_info':
        return <CampusInfoModule />;

      default:
        if (role === 'ADMIN') return <AdminDashboard />;
        if (role === 'PRINCIPAL') return <PrincipalDashboard initialSubTab="overview" />;
        if (role === 'HOD') return <DepartmentHeadDashboard initialSubTab="overview" />;
        if (role === 'TEACHER') return <TeacherDashboard />;
        return <StudentDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100 pb-20 md:pb-0">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {renderContent()}
        </main>
      </div>
      <MobileNav />
      <GlobalSearchModal />
      <NotificationDrawer />
      <QRCodeModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
