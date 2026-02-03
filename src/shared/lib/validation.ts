import type { Image } from '@/payload-types';

export const isPayloadImageRenderable = (
  image: Image | null | undefined | number,
): image is Image & { url: string } => {
  if (!image) return false;
  if (typeof image === 'number') return false;
  if (!image.url) return false;

  return true;
};
