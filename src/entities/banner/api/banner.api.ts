import { EndPointResult, EndPointResultManager, LoggerV2 } from '@/shared';
import { BannerAdapter, BannerApiRepository } from '../infrastructure';
import { Banner } from '../types';

export type GetBannerApiResponse = EndPointResult<Banner>;
export const getBannerApi = async () => {
  try {
    const repository = new BannerApiRepository(BannerAdapter());
    const banner = await repository.getBanner();
    return EndPointResultManager.okWithData({ data: banner });
  } catch (error) {
    LoggerV2.error(error);
    return EndPointResultManager.fail('배너데이터를 불러오는데 문제가 발생했습니다');
  }
};
