import { Banner, BannerEntity } from '../../types';

const baseBannerFixture = {
  id: 1,
  items: [
    {
      id: '69c248a75ca98ee526b3cde1',
      image: {
        id: 3,
        updatedAt: '2026-03-24T08:17:50.027Z',
        createdAt: '2026-03-24T08:17:49.616Z',
        url: '/api/banner-image/file/main_banner-1774340269735.webp',
        thumbnailURL: null,
        filename: 'main_banner-1774340269735.webp',
        mimeType: 'image/webp',
        filesize: 93256,
        width: 1200,
        height: 480,
        focalX: 50,
        focalY: 50,
      },
    },
    {
      id: '69c4a8824f52eb5857dfb0a3',
      image: {
        id: 9,
        updatedAt: '2026-03-26T03:31:24.968Z',
        createdAt: '2026-03-26T03:31:24.560Z',
        url: '/api/banner-image/file/-850x360-1774495884674.webp',
        thumbnailURL: null,
        filename: '-850x360-1774495884674.webp',
        mimeType: 'image/webp',
        filesize: 123952,
        width: 850,
        height: 360,
        focalX: 50,
        focalY: 50,
      },
    },
  ],
  updatedAt: '2026-03-31T04:04:48.894Z',
  createdAt: '2026-03-24T08:06:19.267Z',
  globalType: 'banner',
};

export const createBannerEntityFixture = (override?: Partial<BannerEntity>): BannerEntity => {
  return {
    ...baseBannerFixture,
    ...override,
  };
};

export const createBannerFixture = (override?: Partial<Banner>): Banner => {
  return {
    id: baseBannerFixture.id,
    items: baseBannerFixture.items,
    ...override,
  };
};
