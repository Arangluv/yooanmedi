import { PopupAdapter } from './popup.adapter';
import { PopupRepository } from '../core';
import { PopupMapper } from '../mapper';

export class PopupApiRepository implements PopupRepository {
  private readonly adapter: ReturnType<typeof PopupAdapter>;

  constructor(adapter: ReturnType<typeof PopupAdapter>) {
    this.adapter = adapter;
  }

  async getPopup() {
    const response = await this.adapter.getPopup();
    if (!response.ok) {
      throw response.error;
    }

    return PopupMapper.toDomain(response.data);
  }
}
