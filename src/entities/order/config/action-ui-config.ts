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
  [ORDER_STATUS.pending]: {
    action: ORDER_ACTION.PROCEED,
    buttonText: `${ORDER_STATUS_NAME[ORDER_STATUS.preparing]} 처리`,
    dialogTitle: (display) => getDialogTitle(display, ORDER_STATUS.preparing),
    dialogDescription: '선택한 주문의 상태가 일괄 변경됩니다',
    dialogConfirmText: `${ORDER_STATUS_NAME[ORDER_STATUS.preparing]} 처리`,
  },
  [ORDER_STATUS.preparing]: {
    action: ORDER_ACTION.PROCEED,
    buttonText: `${ORDER_STATUS_NAME[ORDER_STATUS.shipping]} 처리`,
    dialogTitle: (display) => getDialogTitle(display, ORDER_STATUS.shipping),
    dialogDescription: '선택한 주문의 상태가 일괄 변경됩니다',
    dialogConfirmText: `${ORDER_STATUS_NAME[ORDER_STATUS.shipping]} 처리`,
  },
  [ORDER_STATUS.shipping]: {
    action: ORDER_ACTION.PROCEED,
    buttonText: `${ORDER_STATUS_NAME[ORDER_STATUS.delivered]} 처리`,
    dialogTitle: (display) => getDialogTitle(display, ORDER_STATUS.delivered),
    dialogDescription: '선택한 주문의 상태가 일괄 변경됩니다',
    dialogConfirmText: `${ORDER_STATUS_NAME[ORDER_STATUS.delivered]} 처리`,
  },
  [ORDER_STATUS.delivered]: null,
  [ORDER_STATUS.cancel_request]: null,
  [ORDER_STATUS.cancelled]: null,
};

export const CANCEL_ACTION_UI_CONFIG_FOR_ADMIN: Record<OrderStatus, ActionUiConfig | null> = {
  [ORDER_STATUS.pending]: {
    action: ORDER_ACTION.CANCEL_BEFORE_PAYMENT,
    buttonText: `${ORDER_STATUS_NAME[ORDER_STATUS.cancelled]} 처리`,
    dialogTitle: (display) => getDialogTitle(display, ORDER_STATUS.cancelled),
    dialogDescription: '선택한 주문의 상태가 일괄 변경됩니다',
    dialogConfirmText: `${ORDER_STATUS_NAME[ORDER_STATUS.cancelled]} 처리`,
  },
  [ORDER_STATUS.preparing]: {
    action: ORDER_ACTION.CANCEL_AFTER_PAYMENT,
    buttonText: `${ORDER_STATUS_NAME[ORDER_STATUS.cancelled]} 처리`,
    dialogTitle: (display) => getDialogTitle(display, ORDER_STATUS.cancelled),
    dialogDescription: '선택한 주문의 상태가 일괄 변경됩니다',
    dialogConfirmText: `${ORDER_STATUS_NAME[ORDER_STATUS.cancelled]} 처리`,
  },
  [ORDER_STATUS.shipping]: {
    action: ORDER_ACTION.CANCEL_AFTER_PAYMENT,
    buttonText: `${ORDER_STATUS_NAME[ORDER_STATUS.cancelled]} 처리`,
    dialogTitle: (display) => getDialogTitle(display, ORDER_STATUS.cancelled),
    dialogDescription: '선택한 주문의 상태가 일괄 변경됩니다',
    dialogConfirmText: `${ORDER_STATUS_NAME[ORDER_STATUS.cancelled]} 처리`,
  },
  [ORDER_STATUS.delivered]: {
    action: ORDER_ACTION.CANCEL_AFTER_PAYMENT,
    buttonText: `${ORDER_STATUS_NAME[ORDER_STATUS.cancelled]} 처리`,
    dialogTitle: (display) => getDialogTitle(display, ORDER_STATUS.cancelled),
    dialogDescription: '선택한 주문의 상태가 일괄 변경됩니다',
    dialogConfirmText: `${ORDER_STATUS_NAME[ORDER_STATUS.cancelled]} 처리`,
  },
  [ORDER_STATUS.cancel_request]: {
    action: ORDER_ACTION.APPROVE_CANCEL_REQUEST,
    buttonText: `${ORDER_STATUS_NAME[ORDER_STATUS.cancelled]} 처리`,
    dialogTitle: (display) => getDialogTitle(display, ORDER_STATUS.cancelled),
    dialogDescription: '선택한 주문의 상태가 일괄 변경됩니다',
    dialogConfirmText: `${ORDER_STATUS_NAME[ORDER_STATUS.cancelled]} 처리`,
  },
  [ORDER_STATUS.cancelled]: null,
};

export const CANCEL_ACTION_UI_CONFIG_FOR_CLIENT: Record<OrderStatus, ActionUiConfig | null> = {
  [ORDER_STATUS.pending]: {
    action: ORDER_ACTION.CANCEL_BEFORE_PAYMENT,
    buttonText: `${ORDER_STATUS_NAME[ORDER_STATUS.cancelled]} 처리`,
    dialogTitle: (display) => getDialogTitle(display, ORDER_STATUS.cancelled),
    dialogDescription: '선택한 주문의 상태가 일괄 변경됩니다',
    dialogConfirmText: `${ORDER_STATUS_NAME[ORDER_STATUS.cancelled]} 처리`,
  },
  [ORDER_STATUS.preparing]: {
    action: ORDER_ACTION.CREATE_CANCEL_REQUEST,
    buttonText: `${ORDER_STATUS_NAME[ORDER_STATUS.cancelled]} 처리`,
    dialogTitle: (display) => getDialogTitle(display, ORDER_STATUS.cancelled),
    dialogDescription: '선택한 주문의 상태가 일괄 변경됩니다',
    dialogConfirmText: `${ORDER_STATUS_NAME[ORDER_STATUS.cancelled]} 처리`,
  },
  [ORDER_STATUS.shipping]: null,
  [ORDER_STATUS.delivered]: null,
  [ORDER_STATUS.cancel_request]: null,
  [ORDER_STATUS.cancelled]: null,
};
