'use client';

import { Moon, LogOut } from 'lucide-react';
import { useTheme, useAuth } from '@payloadcms/ui';
import { useRouter } from 'next/navigation';

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/shared/ui/shadcn/sidebar';

const SidebarFooter = () => {
  const { setTheme, theme } = useTheme();
  const { logOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logOut();
    router.refresh();
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>설정</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
              <Moon className="!size-[1em]" />
              다크모드
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout}>
              <LogOut className="!size-[1em]" />
              로그아웃
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default SidebarFooter;
