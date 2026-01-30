'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@collections/components/shadcn';
import CustomDialogFooter from './DialogFooter';
import ProductDataTable from './UserListViewTable';
import ProductPriceSetSection from './ProductPriceSetSection';

const DialogProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Dialog>
      {children}
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
        <CustomDialogFooter />
      </DialogContent>
    </Dialog>
  );
};

const ProductSection = () => {
  return (
    <div className="flex h-full w-[60%] flex-col gap-4 rounded-md">
      <ProductDataTable />
    </div>
  );
};

const SettingSection = () => {
  return (
    <div className="flex h-full w-[40%] flex-col gap-4 rounded-md bg-white">
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
      <div className="flex flex-col gap-1">
        <span className="text-lg font-bold">가격 설정</span>
        <span className="text-foreground/80 text-sm">
          선택된 상품의 가격을 변경할 수 있으며{' '}
          <span className="text-brand font-medium">
            선택되지 않은 상품의 가격은 기존 가격으로 유지
          </span>
          됩니다.
        </span>
      </div>
      <ProductPriceSetSection />
    </div>
  );
};

export default DialogProvider;
