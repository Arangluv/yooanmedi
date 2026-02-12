import { ArchiveX } from 'lucide-react';
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from '@/collections/components/shadcn';

export type TableEmptyProps = {
  title: string;
  description: string;
};

export default function TableEmpty({ title, description }: TableEmptyProps) {
  return (
    <Empty className="border-none">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ArchiveX strokeWidth={1.5} className="text-foreground/60" />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
