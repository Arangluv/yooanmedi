export const FLG_STATUS = {
  INIT_NORMAL: 'INIT_NORMAL',
  NEED_PROCESS: 'NEED_PROCESS',
  COMPLETE: 'COMPLETE',
} as const;

export const FLG_STATUS_NAME = {
  [FLG_STATUS.INIT_NORMAL]: '정상',
  [FLG_STATUS.NEED_PROCESS]: '처리필요',
  [FLG_STATUS.COMPLETE]: '완료',
} as const;
