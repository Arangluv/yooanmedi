export const FLG_STATUS = {
  init_normal: 'INIT_NORMAL',
  need_process: 'NEED_PROCESS',
  complete: 'COMPLETE',
} as const;

export const FLG_STATUS_NAME = {
  [FLG_STATUS.init_normal]: '정상',
  [FLG_STATUS.need_process]: '처리필요',
  [FLG_STATUS.complete]: '완료',
} as const;

export type FlgStatus = (typeof FLG_STATUS)[keyof typeof FLG_STATUS];
export type FlgStatusKey = keyof typeof FLG_STATUS;
