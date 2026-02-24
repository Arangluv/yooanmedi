import { DefaultServerCellComponentProps } from 'payload';

import { ORDER_STATUS_NAME, type OrderStatus } from '@/entities/order/constants/order-status';
import { Badge } from '@/shared/ui/shadcn/badge';
import OrderStatusBadge from '@/entities/order/ui/admin/badge';

const OrderStatusCell = (props: DefaultServerCellComponentProps) => {
  const orderStatusCellData = props.cellData as OrderStatus;

  return <OrderStatusBadge orderStatus={orderStatusCellData} />;
};

export default OrderStatusCell;
