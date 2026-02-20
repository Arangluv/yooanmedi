import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from '@/shared/ui/shadcn/empty';
import { ArchiveX } from 'lucide-react';

interface EmptyOrderInfoProps {
  title: string;
}

const EmptyOrderInfo = ({ title }: EmptyOrderInfoProps) => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ArchiveX strokeWidth={1.5} className="text-foreground/60 size-5" />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
      </EmptyHeader>
    </Empty>
  );
};

export default EmptyOrderInfo;
