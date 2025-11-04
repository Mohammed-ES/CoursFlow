import { ReactNode } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { AdminProvider, useAdmin } from '../../context/AdminContext';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayoutContent = ({ children }: AdminLayoutProps) => {
  const { isSidebarCollapsed } = useAdmin();

  return (
    <div className="min-h-screen bg-neutral-offWhite dark:bg-secondary-main">
      <AdminSidebar />
      <AdminHeader />
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

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <AdminProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminProvider>
  );
};

export default AdminLayout;
