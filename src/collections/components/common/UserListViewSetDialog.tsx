'use client';

import type { ListViewClientProps } from 'payload';
import { DefaultListView } from '@payloadcms/ui';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
  Button,
} from '@collections/components/shadcn';
import ProductDataTable from './UserListViewTable';

const UserListViewSetDialog = (props: ListViewClientProps) => {
  return (
    <Dialog>
      <DefaultListView
        viewType={props.viewType}
        Description={props.Description}
        BeforeList={props.BeforeList}
        BeforeListTable={props.BeforeListTable}
        AfterListTable={props.AfterListTable}
        AfterList={props.AfterList}
        collectionSlug={props.collectionSlug}
        columnState={props.columnState}
        disableBulkDelete={props.disableBulkDelete}
        disableBulkEdit={props.disableBulkEdit}
        enableRowSelections={props.enableRowSelections}
        hasCreatePermission={props.hasCreatePermission}
        newDocumentURL={props.newDocumentURL}
        renderedFilters={props.renderedFilters}
        Table={props.Table}
      />
      <DialogContent
        className="!w-full sm:!max-w-[768px] md:!max-w-[1024px] lg:!max-w-[1400px]"
        showCloseButton={false}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="!gap-1">
          <DialogTitle>
            <span className="text-2xl font-bold">거래처별 가격 조정</span>
          </DialogTitle>
          <DialogDescription className="text-[14px] font-light">
            거래처별 가격을 설정할 수 있습니다.
          </DialogDescription>
        </DialogHeader>
        {/* Main Content */}
        <div className="mt-4 flex h-[70vh] w-full gap-8">
          <ProductSection />
          <SettingSection />
        </div>
        {/* Divider */}
        <div className="h-px w-full bg-neutral-200"></div>
        <DialogFooter className="px-2">
          <DialogClose asChild>
            <Button variant="default" size="lg">
              닫기
            </Button>
          </DialogClose>
          <Button variant="default" size="lg" className="bg-brand hover:bg-brand/90 text-white">
            저장
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const ProductSection = () => {
  return (
    <div className="flex h-full w-[70%] flex-col gap-4 rounded-md">
      <div className="flex flex-col">
        <span className="text-xl font-bold">
          등록된 상품 <span className="text-foreground/60 text-sm">(총 100개의 상품)</span>
        </span>
      </div>
      <ProductDataTable />
    </div>
  );
};

const SettingSection = () => {
  return (
    <div className="flex h-full w-[30%] flex-col gap-4 rounded-md bg-white">
      {/* 변경하는 타켓 정보 */}
      <TargetInfo />
      <UpdateOverview />
    </div>
  );
};

const TargetInfo = () => {
  const TargetCard = ({ title, value }: { title: string; value: string }) => {
    return (
      <div className="flex flex-col gap-1">
        <span className="text-foreground/60">{title}</span>
        <span className="font-medium">{value}</span>
      </div>
    );
  };
  return (
    <div className="flex w-full shrink-0 flex-col gap-4 rounded-md border border-neutral-200 p-4">
      <span className="text-lg font-bold">고객 정보</span>
      <div className="flex items-center justify-between">
        <TargetCard title="병원명" value="인천병원" />
        <TargetCard title="대표자명" value="김인천" />
        <TargetCard title="이메일" value="yooanmedi@gmail.com" />
      </div>
    </div>
  );
};

const UpdateOverview = () => {
  return (
    <div className="flex h-full w-full flex-col gap-4 overflow-y-auto rounded-md border border-neutral-200 p-4">
      <span className="text-lg font-bold">가격 설정</span>
    </div>
  );
};

export default UserListViewSetDialog;
