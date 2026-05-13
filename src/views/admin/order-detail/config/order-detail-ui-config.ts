export type OrderInfomationCardType = 'progress' | 'cancelRequest' | 'cancelled';

interface OrderInfomationCardConfig {
  title: string;
  emptyContent: string;
  canItemCancel: boolean;
}

export const ORDER_DETAIL_UI_CONFIG: Record<OrderInfomationCardType, OrderInfomationCardConfig> = {
  progress: {
    title: '진행중인 주문',
    emptyContent: '진행중인 주문이 없습니다.',
    canItemCancel: true,
  },
  cancelRequest: {
    title: '주문취소 요청',
    emptyContent: '취소요청된 주문이 없습니다.',
    canItemCancel: false,
  },
  cancelled: {
    title: '취소된 주문',
    emptyContent: '취소된 주문이 없습니다.',
    canItemCancel: false,
  },
};
