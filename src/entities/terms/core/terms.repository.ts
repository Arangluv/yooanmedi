import { Terms } from '../types';

export interface TermsRepository {
  getTermsOfUse: () => Promise<Terms>;
  getPrivacyPolicy: () => Promise<Terms>;
}
