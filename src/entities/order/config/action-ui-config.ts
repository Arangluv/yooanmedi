import { ORDER_ACTION, OrderAction } from '../constants/order-action';
import { ORDER_STATUS, ORDER_STATUS_NAME, OrderStatus } from '../constants/order-status';

export interface ActionUiConfig {
  action: OrderAction;
  buttonText: string;
  dialogTitle: (params: DialogTitleParams) => string;
  dialogDescription: string;
  dialogConfirmText: string;
}

type DialogTitleParams = {
  count: number;
  viewType: 'order-list' | 'order-detail';
};

const getDialogTitle = (
  display: {
    count: number;
    viewType: 'order-list' | 'order-detail';
  },
  targetStatus: OrderStatus,
) => {
  const unit = display.viewType === 'order-list' ? '주문' : '상품';
  return `${display.count}개의 ${unit}을 ${ORDER_STATUS_NAME[targetStatus]} 처리하시겠습니까?`;
};

export const PROCEED_ACTION_UI_CONFIG: Record<OrderStatus, ActionUiConfig | null> = {
  [ORDER_STATUS.PENDING]: {
    action: ORDER_ACTION.PROCEED,
    buttonText: `${ORDER_STATUS_NAME[ORDER_STATUS.PREPARING]} 처리`,
    dialogTitle: (display) => getDialogTitle(display, ORDER_STATUS.PREPARING),
    dialogDescription: '선택한 주문의 상태가 일괄 변경됩니다',
    dialogConfirmText: `${ORDER_STATUS_NAME[ORDER_STATUS.PREPARING]} 처리`,
  },
  [ORDER_STATUS.PREPARING]: {
    action: ORDER_ACTION.PROCEED,
    buttonText: `${ORDER_STATUS_NAME[ORDER_STATUS.SHIPPING]} 처리`,
    dialogTitle: (display) => getDialogTitle(display, ORDER_STATUS.SHIPPING),
    dialogDescription: '선택한 주문의 상태가 일괄 변경됩니다',
    dialogConfirmText: `${ORDER_STATUS_NAME[ORDER_STATUS.SHIPPING]} 처리`,
  },
  [ORDER_STATUS.SHIPPING]: {
    action: ORDER_ACTION.PROCEED,
    buttonText: `${ORDER_STATUS_NAME[ORDER_STATUS.DELIVERED]} 처리`,
    dialogTitle: (display) => getDialogTitle(display, ORDER_STATUS.DELIVERED),
    dialogDescription: '선택한 주문의 상태가 일괄 변경됩니다',
    dialogConfirmText: `${ORDER_STATUS_NAME[ORDER_STATUS.DELIVERED]} 처리`,
  },
  [ORDER_STATUS.DELIVERED]: null,
  [ORDER_STATUS.CANCEL_REQUEST]: null,
  [ORDER_STATUS.CANCELLED]: null,
};

export const CANCEL_ACTION_UI_CONFIG: Record<OrderStatus, ActionUiConfig | null> = {
  // todo:: only admin use를 어떻게 구분할 수 있을까 고민
  [ORDER_STATUS.PENDING]: {
    action: ORDER_ACTION.CANCEL_BEFORE_PAYMENT,
    buttonText: `${ORDER_STATUS_NAME[ORDER_STATUS.CANCELLED]} 처리`,
    dialogTitle: (display) => getDialogTitle(display, ORDER_STATUS.CANCELLED),
    dialogDescription: '선택한 주문의 상태가 일괄 변경됩니다',
    dialogConfirmText: `${ORDER_STATUS_NAME[ORDER_STATUS.CANCELLED]} 처리`,
  },
  [ORDER_STATUS.PREPARING]: {
    action: ORDER_ACTION.CANCEL_AFTER_PAYMENT,
    buttonText: `${ORDER_STATUS_NAME[ORDER_STATUS.CANCELLED]} 처리`,
    dialogTitle: (display) => getDialogTitle(display, ORDER_STATUS.CANCELLED),
    dialogDescription: '선택한 주문의 상태가 일괄 변경됩니다',
    dialogConfirmText: `${ORDER_STATUS_NAME[ORDER_STATUS.CANCELLED]} 처리`,
  },
  [ORDER_STATUS.SHIPPING]: {
    action: ORDER_ACTION.CANCEL_AFTER_PAYMENT,
    buttonText: `${ORDER_STATUS_NAME[ORDER_STATUS.CANCELLED]} 처리`,
    dialogTitle: (display) => getDialogTitle(display, ORDER_STATUS.CANCELLED),
    dialogDescription: '선택한 주문의 상태가 일괄 변경됩니다',
    dialogConfirmText: `${ORDER_STATUS_NAME[ORDER_STATUS.CANCELLED]} 처리`,
  },
  [ORDER_STATUS.DELIVERED]: {
    action: ORDER_ACTION.CANCEL_AFTER_PAYMENT,
    buttonText: `${ORDER_STATUS_NAME[ORDER_STATUS.CANCELLED]} 처리`,
    dialogTitle: (display) => getDialogTitle(display, ORDER_STATUS.CANCELLED),
    dialogDescription: '선택한 주문의 상태가 일괄 변경됩니다',
    dialogConfirmText: `${ORDER_STATUS_NAME[ORDER_STATUS.CANCELLED]} 처리`,
  },
  [ORDER_STATUS.CANCEL_REQUEST]: {
    action: ORDER_ACTION.APPROVE_CANCEL_REQUEST,
    buttonText: `${ORDER_STATUS_NAME[ORDER_STATUS.CANCELLED]} 처리`,
    dialogTitle: (display) => getDialogTitle(display, ORDER_STATUS.CANCELLED),
    dialogDescription: '선택한 주문의 상태가 일괄 변경됩니다',
    dialogConfirmText: `${ORDER_STATUS_NAME[ORDER_STATUS.CANCELLED]} 처리`,
  },
  [ORDER_STATUS.CANCELLED]: null,
};
