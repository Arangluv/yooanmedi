import { Empty, EmptyMedia, EmptyHeader, EmptyTitle, EmptyDescription } from '@/shared';
import { ArchiveX } from 'lucide-react';

const OrderListEmpty = () => {
  return (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ArchiveX strokeWidth={1.5} className="text-foreground/60 size-5" />
        </EmptyMedia>
        <EmptyTitle>주문내역이 없습니다.</EmptyTitle>
        <EmptyDescription>해당 기간 혹은 검색조건에 맞는 주문내역이 없습니다.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
};

export default OrderListEmpty;
