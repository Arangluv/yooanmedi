import { Order as OrderEntity } from '../model/type';

export interface Order extends Pick<OrderEntity, 'id' | 'orderNo'> {}
