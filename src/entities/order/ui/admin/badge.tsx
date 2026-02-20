import { Badge } from '@/shared/ui/shadcn/badge';
import { cn } from '@/shared/lib/utils';
import { ORDER_STATUS, ORDER_STATUS_NAME } from '../../constants/order-status';

const OrderStatusBadge = ({
  orderStatus,
}: {
  orderStatus: (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];
}) => {
  const colorMapper = {
    [ORDER_STATUS.PENDING]: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300',
    [ORDER_STATUS.PREPARING]:
      'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
    [ORDER_STATUS.SHIPPING]: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
    [ORDER_STATUS.DELIVERED]: 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300',
    [ORDER_STATUS.CANCEL_REQUEST]: 'bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-300',
    [ORDER_STATUS.CANCELLED]: 'bg-gray-50 text-gray-700 dark:bg-gray-950 dark:text-gray-300',
  };

  return (
    <Badge className={cn(colorMapper[orderStatus], 'text-base font-medium')}>
      {ORDER_STATUS_NAME[orderStatus as keyof typeof ORDER_STATUS_NAME]}
    </Badge>
  );
};

export default OrderStatusBadge;
