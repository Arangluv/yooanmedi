import { v4 as uuidv4 } from 'uuid';

export const generateRandomShopTransactionId = () => {
  const uuid = uuidv4();

  return uuid.split('-').join('').toUpperCase();
};
