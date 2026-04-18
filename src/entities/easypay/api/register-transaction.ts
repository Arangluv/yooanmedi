import { RegisterTransactionServiceDto } from '../model/schemas/easypay.register-transaction.schema';

export const registerTransaction = async (dto: RegisterTransactionServiceDto) => {
  const res = await fetch(process.env.PAYMENTS_REGISTER_URL as string, {
    method: 'POST',
    body: JSON.stringify(dto),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return await res.json();
};
