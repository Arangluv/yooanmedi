import {
  EasypayPartialCancelEntity,
  EasypayTotalCancelEntity,
} from '../model/schemas/easypay.cancel.schema';

export const paymentCancelRequest = async (
  data: EasypayPartialCancelEntity | EasypayTotalCancelEntity,
) => {
  const response = await fetch(process.env.PAYMENTS_CANCEL_URL as string, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return await response.json();
};
