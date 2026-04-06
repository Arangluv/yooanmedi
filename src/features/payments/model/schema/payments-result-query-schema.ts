import { z } from 'zod';

const paymentsResultBaseQuerySchema = z.object({
  status: z.enum(['success', 'error']),
});

const paymentsResultSuccessQuerySchema = paymentsResultBaseQuerySchema.extend({
  status: z.literal('success'),
  amount: z.number(),
  approvalDate: z.string(),
  shopOrderNo: z.string(),
});

const paymentsResultErrorQuerySchema = paymentsResultBaseQuerySchema.extend({
  status: z.literal('error'),
  code: z.string().optional(),
  message: z.string().optional(),
});

export const paymentsResultQuerySchema = z.union([
  paymentsResultSuccessQuerySchema,
  paymentsResultErrorQuerySchema,
]);

export type PaymentsResultQuery = z.infer<typeof paymentsResultQuerySchema>;
