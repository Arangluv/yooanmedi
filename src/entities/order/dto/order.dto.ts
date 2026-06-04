import { z } from 'zod';
import { createOrderSchemaForPG, createOrderSchemaForBankTransfer, updateOrderRequestSchema } from '../schemas';

export type CreateOrderRequestForPgDto = z.infer<typeof createOrderSchemaForPG>;
export type CreateOrderRequestForBankTransferDto = z.infer<typeof createOrderSchemaForBankTransfer>;
export type CreateOrderRequestDto = CreateOrderRequestForPgDto | CreateOrderRequestForBankTransferDto;
export type UpdateOrderRequestDto = z.infer<typeof updateOrderRequestSchema>;
