import { Fragment } from 'react';
import Link from 'next/link';

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
  Folder,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@/shared/ui/shadcn/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/shared/ui/shadcn/collapsible';

const COLLECTION_BASE_URL = '/admin/collections';
const GLOBAL_BASE_URL = '/admin/globals';

const data = [
  {
    groupLabel: '유저',
    menu: [
      {
        label: '유저관리',
        icon: User,
        href: `${COLLECTION_BASE_URL}/users?breadcrumbs=유저관리`,
      },
      {
        label: '거래처별 가격',
        icon: ChartCandlestick,
        defaultOpen: true,
        submenu: [
          {
            label: '가격 설정',
            href: `${COLLECTION_BASE_URL}/users?breadcrumbs=거래처별 가격설정`,
          },
          {
            label: '가격 조회',
            href: `${COLLECTION_BASE_URL}/product-price?breadcrumbs=거래처별 가격조회`,
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
        href: `${COLLECTION_BASE_URL}/order?breadcrumbs=주문관리`,
      },
    ],
  },
  {
    groupLabel: '상품',
    menu: [
      {
        label: '상품 등록',
        icon: PackagePlus,
        href: `${COLLECTION_BASE_URL}/product/create?breadcrumbs=상품등록`,
      },
      {
        label: '상품 목록',
        icon: PackageSearch,
        href: `${COLLECTION_BASE_URL}/product?breadcrumbs=상품목록`,
      },
      {
        label: '상품 카테고리',
        icon: Grid2x2Check,
        href: `${COLLECTION_BASE_URL}/product-category?breadcrumbs=상품카테고리`,
      },
    ],
  },
  {
    groupLabel: '홈페이지',
    menu: [
      {
        label: '팝업 설정',
        icon: CopyPlus,
        href: `${GLOBAL_BASE_URL}/popup?breadcrumbs=팝업 설정`,
      },
      {
        label: '최소 주문 금액 설정',
        icon: Settings,
        href: `${GLOBAL_BASE_URL}/meta-setting?breadcrumbs=최소 주문 금액 설정`,
      },
      {
        label: '약관',
        icon: ReceiptText,
        defaultOpen: false,
        submenu: [
          {
            label: '이용약관',
            href: `${GLOBAL_BASE_URL}/terms?breadcrumbs=이용약관`,
          },
          {
            label: '개인정보 처리방침',
            href: `${GLOBAL_BASE_URL}/privacy-policy?breadcrumbs=개인정보 처리방침`,
          },
        ],
      },
      {
        label: '컨텐츠',
        icon: Folder,
        defaultOpen: false,
        submenu: [
          {
            label: '이미지',
            href: `${GLOBAL_BASE_URL}/terms?breadcrumbs=이미지`,
          },
          {
            label: '파일',
            href: `${GLOBAL_BASE_URL}/privacy-policy?breadcrumbs=파일`,
          },
        ],
      },
    ],
  },
];

const MainNav = () => {
  return (
    <Fragment>
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
                    defaultOpen={menu?.defaultOpen || false}
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
    </Fragment>
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
  defaultOpen = false,
  submenu,
}: {
  label: string;
  Icon: LucideIcon;
  defaultOpen?: boolean;
  submenu: {
    label: string;
    href: string;
  }[];
}) => {
  return (
    <Collapsible defaultOpen={defaultOpen}>
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton>
            {/* 아이콘 */}
            <Icon className="!size-[1em]" />
            <span>{label}</span>
            {/* 메뉴이름 */}
            <ChevronDown className="ml-auto !size-[1em]" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
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

export default MainNav;
