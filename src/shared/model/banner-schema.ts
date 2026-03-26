import { z } from 'zod';

const bannerImageSchema = z.object({
  id: z.string(),
  image: z
    .object({
      url: z.string(),
    })
    .nullable(),
});

export const bannerSchema = z.array(bannerImageSchema).transform((items) =>
  items.map((item) => {
    return {
      id: item.id,
      url: item.image?.url ?? null,
    };
  }),
);

export type Banner = z.infer<typeof bannerSchema>;
