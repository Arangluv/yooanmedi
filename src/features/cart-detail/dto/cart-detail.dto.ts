import { z } from 'zod';
import { customPricedCartItemSchema } from '../schemas';

export type CustomPricedCartItemDto = z.infer<typeof customPricedCartItemSchema>;
export type SaveCartChangeRequestDto = Array<CustomPricedCartItemDto>;
export type DeleteCartItemToCartRequestDto = CustomPricedCartItemDto;
