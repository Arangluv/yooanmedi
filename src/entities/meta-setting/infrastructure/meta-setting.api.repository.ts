import { MetaSettingAdapter } from './meta-setting.adapter';
import { MetaSettingRepository } from '../core';
import { MetaSettingMapper } from '../mapper';

export class MetaSettingApiRepository implements MetaSettingRepository {
  private readonly adapter: ReturnType<typeof MetaSettingAdapter>;

  constructor(adapter: ReturnType<typeof MetaSettingAdapter>) {
    this.adapter = adapter;
  }

  async getSiteMetaSetting() {
    const response = await this.adapter.getSiteMetaSetting();
    if (!response.ok) {
      throw response.error;
    }
    return MetaSettingMapper.toDomain(response.data);
  }
}
