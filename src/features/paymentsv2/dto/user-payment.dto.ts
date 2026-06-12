import { z } from 'zod';
import { UserPaymentRequestDto, paymentOrderItemSchema } from '../schemas';

export type PaymentByPGRequestDto = z.infer<typeof UserPaymentRequestDto.pg>;
export type PaymentByBankTransferRequestDto = z.infer<typeof UserPaymentRequestDto.bankTransfer>;
export type PaymentOrderItemDto = z.infer<typeof paymentOrderItemSchema>;
