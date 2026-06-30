import { TermsAdapter } from './terms.adapter';
import { TermsRepository } from '../core';
import { TermsMapper } from '../mapper';

export class TermsApiRepository implements TermsRepository {
  private readonly adapter: ReturnType<typeof TermsAdapter>;

  constructor(adapter: ReturnType<typeof TermsAdapter>) {
    this.adapter = adapter;
  }

  async getTermsOfUse() {
    const response = await this.adapter.getTermsOfUse();
    if (!response.ok) {
      throw response.error;
    }
    return TermsMapper.toDomain(response.data);
  }

  async getPrivacyPolicy() {
    const response = await this.adapter.getPrivacyPolicy();
    if (!response.ok) {
      throw response.error;
    }

    return TermsMapper.toDomain(response.data);
  }
}
