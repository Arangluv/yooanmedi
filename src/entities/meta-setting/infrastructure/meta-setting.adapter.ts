import {
  getPayload,
  PayloadAdapterResultManager,
  PayloadCmsErrorTranslator,
} from '@/shared/server';

export const MetaSettingAdapter = () => ({
  getSiteMetaSetting: async () => {
    try {
      const payload = await getPayload();
      const metaSetting = await payload.findGlobal({
        slug: 'meta-setting',
      });
      return PayloadAdapterResultManager.ok(metaSetting);
    } catch (error) {
      const baseError = PayloadCmsErrorTranslator.toBaseError(
        error,
        '사이트 메타데이터를 가져오는데 문제가 발생했습니다',
      );
      return PayloadAdapterResultManager.fail(baseError);
    }
  },
});
