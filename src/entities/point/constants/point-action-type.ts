export const POINT_ACTION_TYPE = {
  USE: 'USE',
  EARN: 'EARN',
  CANCEL_USE: 'CANCEL_USE',
  CANCEL_EARN: 'CANCEL_EARN',
} as const;

export type PointActionType = (typeof POINT_ACTION_TYPE)[keyof typeof POINT_ACTION_TYPE];
