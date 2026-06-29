import {
  getPayload,
  PayloadAdapterResultManager,
  PayloadCmsErrorTranslator,
} from '@/shared/server';

export const BannerAdapter = () => ({
  getBanner: async () => {
    try {
      const payload = await getPayload();
      const banner = await payload.findGlobal({
        slug: 'banner',
      });
      return PayloadAdapterResultManager.ok(banner);
    } catch (error) {
      const baseError = PayloadCmsErrorTranslator.toBaseError(
        error,
        '배너 데이터를 가져오는데 문제가 발생했습니다',
      );
      return PayloadAdapterResultManager.fail(baseError);
    }
  },
});
