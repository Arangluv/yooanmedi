'use client';

import { Sidebar, SidebarContent } from '@/shared/ui/shadcn/sidebar';
import { useAuth } from '@payloadcms/ui';

import { Separator } from '../../shadcn/separator';

import './admin-sidebar.scss';
import MainNav from './main-nav';
import SidebarFooter from './footer';
import SidebarAdminHeader from './header';

const AdminSidebar = () => {
  const { user } = useAuth();

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <Sidebar className="admin-sidebar font-medium" collapsible="icon">
      <SidebarAdminHeader />
      <SidebarContent>
        <MainNav />
        <Separator className="my-4" />
        <SidebarFooter />
      </SidebarContent>
    </Sidebar>
  );
};

export default AdminSidebar;
