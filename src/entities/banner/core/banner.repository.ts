import { Banner } from '../types';

export interface BannerRepository {
  getBanner: () => Promise<Banner>;
}
