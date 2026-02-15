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
import TargetUserInfo from './TargetUserInfo';

const DialogProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Dialog>
      {children}
      <DialogContent
        className="bg-background border-border !w-full !max-w-[1400px] border"
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
        <div className="mt-4 flex min-h-[650px] w-full gap-4">
          <ProductSection />
          <SettingSection />
        </div>
        {/* Divider */}
        <div className="bg-border h-px w-full"></div>
        <CustomDialogFooter />
      </DialogContent>
    </Dialog>
  );
};

const ProductSection = () => {
  return (
    <div className="bg-card border-border flex h-full w-[60%] flex-col gap-4 rounded-md border p-4">
      <ProductDataTable />
    </div>
  );
};

const SettingSection = () => {
  return (
    <div className="bg-background flex h-full w-[40%] flex-col gap-4 rounded-md">
      <TargetUserInfo />
      <ProductPriceSetSection />
    </div>
  );
};

export default DialogProvider;
