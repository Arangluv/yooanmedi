import type { CollectionConfig } from 'payload';

export const Files: CollectionConfig = {
  slug: 'files',
  access: {
    read: () => true,
  },
  admin: {
    group: '파일 & 이미지',
  },
  labels: {
    singular: '파일',
    plural: '파일',
  },
  upload: {},
  fields: [],
};
