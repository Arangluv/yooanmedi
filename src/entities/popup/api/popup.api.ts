'use server';

import { EndPointResult, EndPointResultManager, LoggerV2 } from '@/shared';
import { PopupAdapter, PopupApiRepository } from '../infrastructure';
import { Popup } from '../types';

export type GetPopupApiResponse = EndPointResult<Popup>;

export const getPopup = async (): Promise<GetPopupApiResponse> => {
  try {
    const popupRepository = new PopupApiRepository(PopupAdapter());
    const popup = await popupRepository.getPopup();
    return EndPointResultManager.okWithData({ data: popup });
  } catch (error) {
    LoggerV2.error(error);
    return EndPointResultManager.fail('팝업을 불러오는데 문제가 발생했습니다');
  }
};
