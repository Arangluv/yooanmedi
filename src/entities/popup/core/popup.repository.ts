import { Popup } from '../types';

export interface PopupRepository {
  getPopup: () => Promise<Popup>;
}
