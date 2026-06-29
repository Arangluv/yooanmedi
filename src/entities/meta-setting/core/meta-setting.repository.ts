import { MetaSetting } from '../types';

export interface MetaSettingRepository {
  getSiteMetaSetting: () => Promise<MetaSetting>;
}
