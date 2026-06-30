import { LoggerV2 } from '@/shared';
import {
  getPayload,
  PayloadAdapterResultManager,
  PayloadCmsErrorTranslator,
} from '@/shared/server';
import { GetPopupResponse } from '../types';

export const PopupAdapter = () => ({
  getPopup: async (): Promise<GetPopupResponse> => {
    try {
      const payload = await getPayload();
      const popup = await payload.findGlobal({
        slug: 'popup',
      });
      return PayloadAdapterResultManager.ok(popup);
    } catch (error) {
      LoggerV2.error(error);
      const baseError = PayloadCmsErrorTranslator.toBaseError(
        error,
        '팝업 데이터를 가져오는데 문제가 발생했습니다',
      );
      return PayloadAdapterResultManager.fail(baseError);
    }
  },
});
