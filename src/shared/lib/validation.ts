import type { Image } from '@/payload-types';

/**
 * Payload Image 타입이 UI에 렌더링 가능한 타입인지 검사합니다.
 * ture인 경우 image.url이 반드시 존재합니다.
 */
export const isPayloadImageRenderable = (
  image: Image | null | undefined | number,
): image is Image & { url: string } => {
  if (!image) return false;
  if (typeof image === 'number') return false;
  if (!image.url) return false;

  return true;
};
