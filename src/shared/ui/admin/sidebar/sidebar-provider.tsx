import { User } from '@/payload-types';
import { SidebarInset, SidebarProvider } from '../../shadcn/sidebar';
import AdminSidebar from './sidebar';

const SidebarCustomProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
};

export default SidebarCustomProvider;
