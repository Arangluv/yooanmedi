export const POINT_ACTION = {
  USE: 'USE',
  EARN: 'EARN',
  CANCEL_USE: 'CANCEL_USE',
  CANCEL_EARN: 'CANCEL_EARN',
} as const;

export type PointAction = (typeof POINT_ACTION)[keyof typeof POINT_ACTION];
