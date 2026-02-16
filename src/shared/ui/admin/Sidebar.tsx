'use client';

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarGroupContent,
  SidebarMenuButton,
  SidebarMenuSubButton,
  SidebarMenuAction,
  SidebarRail,
} from '@/shared/ui/shadcn/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/shared/ui/shadcn/collapsible';
import { Avatar, AvatarFallback } from '@/shared/ui/shadcn/avatar';
import { Item, ItemContent, ItemMedia, ItemTitle, ItemDescription } from '@/shared/ui/shadcn/item';
import {
  ChevronDown,
  ChartCandlestick,
  User,
  ShoppingCart,
  PackageSearch,
  PackagePlus,
  Grid2x2Check,
  CopyPlus,
  Settings,
  ReceiptText,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';

import './admin-sidebar.scss';

const COLLECTION_BASE_URL = '/admin/collections';
const GLOBAL_BASE_URL = '/admin/globals';

const data = [
  {
    groupLabel: '유저',
    menu: [
      {
        label: '유저관리',
        icon: User,
        href: `${COLLECTION_BASE_URL}/users`,
      },
      {
        label: '거래처별 가격',
        icon: ChartCandlestick,
        submenu: [
          {
            label: '가격 설정',
            href: `${COLLECTION_BASE_URL}/users`,
          },
          {
            label: '가격 조회',
            href: `${COLLECTION_BASE_URL}/product-price`,
          },
        ],
      },
    ],
  },
  {
    groupLabel: '주문',
    menu: [
      {
        label: '주문관리',
        icon: ShoppingCart,
        href: `${COLLECTION_BASE_URL}/order`,
      },
    ],
  },
  {
    groupLabel: '상품',
    menu: [
      {
        label: '상품 등록',
        icon: PackagePlus,
        href: `${COLLECTION_BASE_URL}/product/create`,
      },
      {
        label: '상품 목록',
        icon: PackageSearch,
        href: `${COLLECTION_BASE_URL}/product`,
      },
      {
        label: '상품 카테고리',
        icon: Grid2x2Check,
        href: `${COLLECTION_BASE_URL}/product-category`,
      },
    ],
  },
  {
    groupLabel: '홈페이지',
    menu: [
      {
        label: '팝업 설정',
        icon: CopyPlus,
        href: `${GLOBAL_BASE_URL}/popup`,
      },
      {
        label: '최소 주문 금액 설정',
        icon: Settings,
        href: `${GLOBAL_BASE_URL}/meta-setting`,
      },
      {
        label: '약관',
        icon: ReceiptText,
        submenu: [
          {
            label: '이용약관',
            href: `${GLOBAL_BASE_URL}/terms`,
          },
          {
            label: '개인정보 처리방침',
            href: `${GLOBAL_BASE_URL}/privacy-policy`,
          },
        ],
      },
    ],
  },
];

const AminSidebar = () => {
  return (
    <Sidebar className="admin-sidebar font-medium">
      <SidebarHeader className="">
        {/* 로그인 한 관리자 정보 */}
        <Item className="items-center">
          <ItemMedia>
            <Avatar>
              <AvatarFallback className="bg-primary text-primary-foreground">YM</AvatarFallback>
            </Avatar>
          </ItemMedia>
          <ItemContent>
            <ItemTitle>yooanmedi</ItemTitle>
            <ItemDescription>관리자</ItemDescription>
          </ItemContent>
        </Item>
      </SidebarHeader>
      <SidebarContent>
        {data.map((item) => (
          <SidebarGroup key={item.groupLabel}>
            <SidebarGroupLabel>{item.groupLabel}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.menu.map((menu) =>
                  menu.submenu ? (
                    <MultiMenuItem
                      key={menu.label}
                      label={menu.label}
                      Icon={menu.icon}
                      submenu={menu.submenu}
                    />
                  ) : (
                    <SigleMenuItem
                      key={menu.label}
                      label={menu.label}
                      Icon={menu.icon}
                      href={menu.href}
                    />
                  ),
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
};

const SigleMenuItem = ({
  label,
  Icon,
  href,
}: {
  label: string;
  Icon: LucideIcon;
  href: string;
}) => {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link href={href}>
          {/* 아이콘 */}
          <Icon className="!size-[1em]" />
          {/* 메뉴이름 */}
          <span>{label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

const MultiMenuItem = ({
  label,
  Icon,
  submenu,
}: {
  label: string;
  Icon: LucideIcon;
  submenu: {
    label: string;
    href: string;
  }[];
}) => {
  return (
    <Collapsible defaultOpen>
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton>
            {/* 아이콘 */}
            <Icon className="!size-[1em]" />
            {/* 메뉴이름 */}
            <span>{label}</span>
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <SidebarMenuAction>
          <ChevronDown className="!size-[1em]" />
        </SidebarMenuAction>
        {/* 하위 메뉴 */}
        <CollapsibleContent>
          <SidebarMenuSub>
            {submenu.map((item) => (
              <SidebarMenuSubItem key={item.label}>
                <SidebarMenuSubButton asChild>
                  <Link href={item.href}>
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
};

export default AminSidebar;
