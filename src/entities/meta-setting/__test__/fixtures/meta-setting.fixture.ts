import { MetaSettingEntity, MetaSetting } from '../../types';

const baseMetaSetting = {
  id: 1,
  min_order_price: 50000,
  updatedAt: '2026-02-20T03:12:58.992Z',
  createdAt: '2026-01-28T00:49:27.830Z',
  globalType: 'meta-setting',
};

export const createMetaSettingEntityFixture = (
  override?: Partial<MetaSettingEntity>,
): MetaSettingEntity => {
  return {
    ...baseMetaSetting,
    ...override,
  };
};

export const createMetaSettingFixture = (override?: Partial<MetaSetting>): MetaSetting => {
  return {
    id: baseMetaSetting.id,
    minOrderPrice: baseMetaSetting.min_order_price,
    ...override,
  };
};
