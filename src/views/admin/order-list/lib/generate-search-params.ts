import { parseAsInteger, parseAsStringLiteral, createLoader } from 'nuqs/server';
import { ORDER_STATUS, type OrderStatus } from '@/entities/order';

const searchParams = {
  orderStatus: parseAsStringLiteral<OrderStatus | 'all'>(Object.values(ORDER_STATUS)).withDefault(
    'all',
  ),
  page: parseAsInteger.withDefault(1),
};

export const generateSearchParams = createLoader(searchParams);
export type AdminOrderListSearchParams = Awaited<ReturnType<typeof generateSearchParams>>;
