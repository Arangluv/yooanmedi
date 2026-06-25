import { LoggerV2 } from '@/shared';
import {
  getPayload,
  PayloadAdapterResultManager,
  PayloadCmsErrorTranslator,
} from '@/shared/server';

export const TermsAdapter = () => ({
  getTermsOfUse: async () => {
    try {
      const payload = await getPayload();
      const termsOfUse = await payload.findGlobal({
        slug: 'terms',
      });

      return PayloadAdapterResultManager.ok(termsOfUse);
    } catch (error) {
      LoggerV2.error(error);
      const baseError = PayloadCmsErrorTranslator.toBaseError(
        error,
        '이용약관을 가져오는데 문제가 발생했습니다',
      );

      return PayloadAdapterResultManager.fail(baseError);
    }
  },

  getPrivacyPolicy: async () => {
    try {
      const payload = await getPayload();
      const termsOfUse = await payload.findGlobal({
        slug: 'privacy-policy',
      });

      return PayloadAdapterResultManager.ok(termsOfUse);
    } catch (error) {
      LoggerV2.error(error);
      const baseError = PayloadCmsErrorTranslator.toBaseError(
        error,
        '개인정보 처리방침을 가져오는데 문제가 발생했습니다',
      );

      return PayloadAdapterResultManager.fail(baseError);
    }
  },
});
