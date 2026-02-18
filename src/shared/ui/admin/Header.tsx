'use client';

import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';

import { SidebarTrigger } from '@/shared/ui/shadcn/sidebar';
import { Separator } from '@/shared/ui/shadcn/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/shared/ui/shadcn/breadcrumb';
import { useSearchParams } from 'next/navigation';

const AdminHeader = () => {
  const [externalHeader, setExternalHeader] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const element = document.querySelector('.app-header');
    if (element) {
      element.innerHTML = '';
      setExternalHeader(element as HTMLElement);
    }
  }, []);

  if (!externalHeader) {
    return null;
  }

  return createPortal(<CustomHeader />, externalHeader);
};

const CustomHeader = () => {
  const searchParams = useSearchParams();

  return (
    <div className="flex h-full items-center gap-3 px-[60px]">
      <SidebarTrigger className="size-8" />
      <Separator orientation="vertical" className="h-4 data-[orientation=vertical]:h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink className="text-lg" href="/admin">
              대시보드
            </BreadcrumbLink>
          </BreadcrumbItem>
          {searchParams.get('breadcrumbs') && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-lg">
                  {searchParams.get('breadcrumbs')}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default AdminHeader;
