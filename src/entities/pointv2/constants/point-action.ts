export const POINT_ACTION = {
  use: 'USE',
  earn: 'EARN',
  cancel_use: 'CANCEL_USE',
  cancel_earn: 'CANCEL_EARN',
} as const;

export type PointAction = (typeof POINT_ACTION)[keyof typeof POINT_ACTION];
