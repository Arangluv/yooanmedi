'use client';

import Link from 'next/link';
import { useAuth } from '@payloadcms/ui';

import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from '@/shared/ui/shadcn/sidebar';
import { Item, ItemMedia, ItemContent, ItemTitle, ItemDescription } from '@/shared/ui/shadcn/item';
import { Avatar, AvatarFallback } from '@/shared/ui/shadcn/avatar';

const SidebarAdminHeader = () => {
  const { user } = useAuth();
  const { open } = useSidebar();

  if (!user) {
    return null;
  }

  return (
    <SidebarHeader>
      <SidebarMenu>
        {open && (
          <SidebarMenuItem>
            <Item asChild>
              <Link href="/admin" prefetch={false} className="flex items-center gap-4">
                <ItemMedia>
                  <Avatar>
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      YM
                    </AvatarFallback>
                  </Avatar>
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{user.username}</ItemTitle>
                  <ItemDescription>관리자</ItemDescription>
                </ItemContent>
              </Link>
            </Item>
          </SidebarMenuItem>
        )}
      </SidebarMenu>
    </SidebarHeader>
  );
};

export default SidebarAdminHeader;
