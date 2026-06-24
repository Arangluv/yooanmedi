import { CollectionConfig } from 'payload';
import { bannerImage } from './banner';
import { cart, cartItem } from './cart';
import { customPrice } from './custom-price';
import { favorites } from './favorites';
import { file, image } from './media';
import { order, orderProduct } from './order';
import { paymentHistory } from './payment-history';
import { pointTransaction } from './point-transaction';
import { product, productCategory } from './product';
import { recentPurchasedHistory } from './recent-purchased-history';
import { user } from './user';

export const Collections: Record<string, CollectionConfig> = {
  bannerImage,
  cart,
  cartItem,
  customPrice,
  favorites,
  file,
  image,
  order,
  orderProduct,
  paymentHistory,
  pointTransaction,
  product,
  productCategory,
  recentPurchasedHistory,
  user,
} as const;

export const getAllCollection = (): CollectionConfig[] => Object.values(Collections);
