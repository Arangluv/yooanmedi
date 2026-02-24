import { DefaultServerCellComponentProps } from 'payload';

import { FLG_STATUS, FLG_STATUS_NAME, type FlgStatus } from '@/entities/order/constants/flg-status';
import { Badge } from '@/shared/ui/shadcn/badge';
import { cn } from '@/shared/lib/utils';

const FlgStatusCell = (props: DefaultServerCellComponentProps) => {
  const flgStatusCellData = props.cellData as FlgStatus;

  const colorMapper = {
    [FLG_STATUS.INIT_NORMAL]: 'bg-muted text-muted-foreground',
    [FLG_STATUS.NEED_PROCESS]: 'bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-300',
    [FLG_STATUS.COMPLETE]: 'bg-muted text-muted-foreground',
  };
  return (
    <Badge className={cn(colorMapper[flgStatusCellData], 'border text-base font-medium')}>
      {FLG_STATUS_NAME[flgStatusCellData]}
    </Badge>
  );
};

export default FlgStatusCell;
