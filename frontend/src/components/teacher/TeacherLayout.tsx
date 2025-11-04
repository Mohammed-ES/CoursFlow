import { ReactNode } from 'react';
import TeacherSidebar from './TeacherSidebar';
import TeacherHeader from './TeacherHeader';
import { TeacherProvider, useTeacher } from '../../context/TeacherContext';

interface TeacherLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

const TeacherLayoutContent = ({ children, title, subtitle }: TeacherLayoutProps) => {
  const { isSidebarCollapsed } = useTeacher();

  return (
    <div className="flex h-screen bg-neutral-lightGray/10 dark:bg-secondary-dark">
      {/* Sidebar */}
      <TeacherSidebar />

      {/* Main Content */}
      <div 
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
          isSidebarCollapsed ? 'ml-[80px]' : 'ml-[280px]'
        }`}
      >
        {/* Header */}
        <TeacherHeader title={title} subtitle={subtitle} />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

const TeacherLayout = ({ children, title, subtitle }: TeacherLayoutProps) => {
  return (
    <TeacherProvider>
      <TeacherLayoutContent title={title} subtitle={subtitle}>
        {children}
      </TeacherLayoutContent>
    </TeacherProvider>
  );
};

export default TeacherLayout;
