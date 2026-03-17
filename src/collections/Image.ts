import type { CollectionConfig } from 'payload';

export const Image: CollectionConfig = {
  slug: 'image',
  access: {
    read: () => true,
  },
  admin: {
    group: '파일 & 이미지',
  },
  lockDocuments: false,
  labels: {
    singular: '이미지',
    plural: '이미지',
  },
  upload: {
    mimeTypes: [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/vnd.microsoft.icon',
      'image/x-icon',
      'image/avif',
      'image/svg+xml',
    ],
    formatOptions: {
      format: 'webp',
      options: {
        quality: 75,
      },
    },
  },
  hooks: {
    beforeChange: [
      ({ data, req }) => {
        // 파일명 정리: 특수문자 제거 및 URL-safe하게 변환
        if (data?.filename) {
          // 파일 확장자 분리
          const ext = data.filename.split('.').pop() || '';
          const nameWithoutExt =
            data.filename.substring(0, data.filename.lastIndexOf('.')) || data.filename;

          // 파일명 정리: 한글, 공백, 특수문자 처리
          const sanitized = nameWithoutExt
            .normalize('NFD') // 유니코드 정규화
            .replace(/[\u0300-\u036f]/g, '') // 조합 문자 제거
            .replace(/[^\w\s-]/g, '') // 영문, 숫자, 공백, 하이픈만 유지
            .replace(/\s+/g, '-') // 공백을 하이픈으로
            .replace(/-+/g, '-') // 연속된 하이픈 제거
            .toLowerCase()
            .trim();

          // 타임스탬프 추가로 중복 방지
          const timestamp = Date.now();
          data.filename = `${sanitized}-${timestamp}.${ext}`;
        }
        return data;
      },
    ],
  },
  fields: [],
};
