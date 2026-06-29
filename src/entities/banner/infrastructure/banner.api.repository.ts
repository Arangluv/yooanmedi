import { BannerAdapter } from './banner.adapter';
import { BannerRepository } from '../core';
import { BannerMapper } from '../mapper';

export class BannerApiRepository implements BannerRepository {
  private readonly adapter: ReturnType<typeof BannerAdapter>;

  constructor(adapter: ReturnType<typeof BannerAdapter>) {
    this.adapter = adapter;
  }

  async getBanner() {
    const response = await this.adapter.getBanner();
    if (!response.ok) {
      throw response.error;
    }
    return BannerMapper.toDomain(response.data);
  }
}
