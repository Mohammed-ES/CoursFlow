import { createContext, useContext, useState, ReactNode } from 'react';

interface TeacherContextType {
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

const TeacherContext = createContext<TeacherContextType | undefined>(undefined);

export const useTeacher = () => {
  const context = useContext(TeacherContext);
  if (!context) {
    throw new Error('useTeacher must be used within TeacherProvider');
  }
  return context;
};

export const TeacherProvider = ({ children }: { children: ReactNode }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <TeacherContext.Provider value={{ isSidebarCollapsed, toggleSidebar }}>
      {children}
    </TeacherContext.Provider>
  );
};
