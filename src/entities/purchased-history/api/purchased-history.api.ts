'use server';

import { BaseErrorManager, EndPointResult, EndPointResultManager, FindOption, LoggerV2 } from '@/shared';
import { PurchasedHistoryApiRepository, PurchasedHistoryAdapter } from '../infrastructure';
import { PurchasedHistory } from '../types';
import { PURCHASED_HISTORY_ERROR_MESSAGE } from '../constants';
import { GetPurchasedHistoriesRequestDto } from '../dto';
import { PurchasedHistoryFindOption } from '../libs';

export const getPurchasedHistories = async (
  dto: GetPurchasedHistoriesRequestDto,
): Promise<EndPointResult<PurchasedHistory[]>> => {
  try {
    const purchasedHistoryRepository = new PurchasedHistoryApiRepository(PurchasedHistoryAdapter());
    const option = PurchasedHistoryFindOption.list.build(dto);
    const histories = await purchasedHistoryRepository.findMany(option);
    return EndPointResultManager.okWithData({ data: histories });
  } catch (error) {
    LoggerV2.error(error);
    const message = BaseErrorManager.resolveClientMessage(error);
    return EndPointResultManager.fail(message ?? PURCHASED_HISTORY_ERROR_MESSAGE.fetchFail);
  }
};
