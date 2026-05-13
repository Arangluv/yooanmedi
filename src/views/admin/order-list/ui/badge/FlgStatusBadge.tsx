import { DefaultServerCellComponentProps } from 'payload';

import { FLG_STATUS, FLG_STATUS_NAME, type FlgStatus } from '@/entities/order/constants/flg-status';
import { Badge } from '@/shared/ui/shadcn/badge';
import { cn } from '@/shared/lib/utils';

const FlgStatusCell = ({ flgStatus }: { flgStatus: FlgStatus }) => {
  const colorMapper = {
    [FLG_STATUS.init_normal]: 'bg-muted text-muted-foreground',
    [FLG_STATUS.need_process]: 'bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-300',
    [FLG_STATUS.complete]: 'bg-muted text-muted-foreground',
  };
  return (
    <Badge className={cn(colorMapper[flgStatus], 'border text-base font-medium')}>
      {FLG_STATUS_NAME[flgStatus]}
    </Badge>
  );
};

export default FlgStatusCell;
