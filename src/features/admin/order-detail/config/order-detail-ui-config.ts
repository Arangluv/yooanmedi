export type OrderInfomationCardType = 'progress' | 'cancelRequest' | 'cancelled';

interface OrderInfomationCardConfig {
  title: string;
  canItemCancel: boolean;
}

export const ORDER_DETAIL_UI_CONFIG: Record<OrderInfomationCardType, OrderInfomationCardConfig> = {
  progress: {
    title: '진행중인 주문',
    canItemCancel: true,
  },
  cancelRequest: {
    title: '주문취소 요청',
    canItemCancel: false,
  },
  cancelled: {
    title: '취소된 주문',
    canItemCancel: false,
  },
};
