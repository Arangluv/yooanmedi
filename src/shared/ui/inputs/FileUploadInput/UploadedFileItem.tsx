import { VariantProps } from 'class-variance-authority';
import { Trash, File } from 'lucide-react';
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  itemVariants,
  ItemMedia,
  Button,
} from '@/shared/ui/shadcn';

export type UploadedFileItemProps = React.ComponentProps<'div'> &
  VariantProps<typeof itemVariants> & { file: File; onChange: () => void };

export const UploadedFileItem = ({ file, onChange }: UploadedFileItemProps) => {
  const { size, name } = file;

  return (
    <Item variant={'outline'}>
      <ItemMedia>
        <File className="text-muted-foreground size-4" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{name}</ItemTitle>
        <ItemDescription>{(size / 1024 / 1024).toFixed(2)} MB</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={(e) => {
            e.stopPropagation();
            onChange();
          }}
        >
          <Trash />
        </Button>
      </ItemActions>
    </Item>
  );
};
