import { FindOption } from '@/shared';
import { CustomPriceRepository } from '../../core';
import { CustomPriceAdapter } from '../adapter/custom-price.adapter';
import { CustomPriceMapper } from '../../mapper';

export class CustomPriceApiRepository implements CustomPriceRepository {
  private adapter: ReturnType<typeof CustomPriceAdapter>;

  constructor(adapter: ReturnType<typeof CustomPriceAdapter>) {
    this.adapter = adapter;
  }

  async findMany(option: FindOption) {
    const result = await this.adapter.getCustomPrices(option);
    if (!result.ok) {
      throw result.error;
    }

    return CustomPriceMapper.entitiesToDomainList(result.data);
  }
}
