import { EndPointResult, EndPointResultManager, LoggerV2 } from '@/shared';
import { MetaSettingAdapter, MetaSettingApiRepository } from '../infrastructure';
import { MetaSetting } from '../types';

export type GetSiteMetaSettingApiResponse = EndPointResult<MetaSetting>;
export const getSiteMetaSettingApi = async () => {
  try {
    const repository = new MetaSettingApiRepository(MetaSettingAdapter());
    const metaSetting = await repository.getSiteMetaSetting();
    return EndPointResultManager.okWithData({ data: metaSetting });
  } catch (error) {
    LoggerV2.error(error);
    return EndPointResultManager.fail('배너데이터를 불러오는데 문제가 발생했습니다');
  }
};
