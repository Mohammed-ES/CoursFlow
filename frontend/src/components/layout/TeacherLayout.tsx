import { ReactNode } from 'react';
import TeacherSidebar from './TeacherSidebar';
import TeacherHeader from './TeacherHeader';
import { TeacherProvider, useTeacher } from '../../context/TeacherContext';

interface TeacherLayoutProps {
  children: ReactNode;
}

const TeacherLayoutContent = ({ children }: TeacherLayoutProps) => {
  const { isSidebarCollapsed } = useTeacher();

  return (
    <div className="min-h-screen bg-neutral-offWhite dark:bg-secondary-main">
      <TeacherSidebar />
      <TeacherHeader />
      <main 
        className={`transition-all duration-300 mt-20 p-4 md:p-8 ${
          isSidebarCollapsed ? 'md:ml-[80px]' : 'md:ml-[280px]'
        }`}
      >
        <div className="max-w-full mx-auto">{children}</div>
      </main>
    </div>
  );
};

const TeacherLayout = ({ children }: TeacherLayoutProps) => {
  return (
    <TeacherProvider>
      <TeacherLayoutContent>{children}</TeacherLayoutContent>
    </TeacherProvider>
  );
};

export default TeacherLayout;
