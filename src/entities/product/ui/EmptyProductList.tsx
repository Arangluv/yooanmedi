import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from '@/shared/ui/shadcn/empty';

import { PackageSearch } from 'lucide-react';

const EmptyProductList = ({ title, description }: { title: string; description: string }) => {
  return (
    <div className="h-[260px] w-full">
      <Empty className="bg-muted">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <PackageSearch className="text-foreground size-5" strokeWidth={1.5} />
          </EmptyMedia>
          <EmptyTitle className="text-foreground">{title}</EmptyTitle>
          <EmptyDescription>{description}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
};

export default EmptyProductList;
