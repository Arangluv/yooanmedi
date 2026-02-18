import { SquareMenu } from 'lucide-react';
import { Empty, EmptyDescription, EmptyMedia, EmptyHeader, EmptyTitle } from '../shadcn/empty';

const DashBoard = () => {
  return (
    <div className="h-[calc(100vh-var(--app-header-height))] w-full px-[60px] py-[30px]">
      <Empty className="border-border h-full border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <SquareMenu className="text-foreground size-8" strokeWidth={1.5} />
          </EmptyMedia>
          <EmptyTitle>유안메디팜 관리자 대시보드입니다</EmptyTitle>
          <EmptyDescription>왼쪽 메뉴에서 원하는 메뉴를 선택해주세요.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
};

export default DashBoard;
