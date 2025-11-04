import { ReactNode } from 'react';
import StudentSidebar from '../student/StudentSidebar';
import StudentHeader from '../student/StudentHeader';
import { StudentProvider, useStudent } from '../../context/StudentContext';

interface StudentLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

const StudentLayoutContent = ({ children, title, subtitle }: StudentLayoutProps) => {
  const { isSidebarCollapsed } = useStudent();

  return (
    <div className="flex h-screen bg-neutral-lightGray/10 dark:bg-secondary-dark">
      {/* Sidebar */}
      <StudentSidebar />

      {/* Main Content */}
      <div 
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
          isSidebarCollapsed ? 'ml-[80px]' : 'ml-[280px]'
        }`}
      >
        {/* Header */}
        <StudentHeader title={title} subtitle={subtitle} />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

const StudentLayout = ({ children, title, subtitle }: StudentLayoutProps) => {
  return (
    <StudentProvider>
      <StudentLayoutContent title={title} subtitle={subtitle}>
        {children}
      </StudentLayoutContent>
    </StudentProvider>
  );
};

export default StudentLayout;
