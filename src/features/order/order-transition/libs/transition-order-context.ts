import { Order } from '@/entities/order';
import { TRANSITIONS_ORDER_CONFIG } from '../constants';
import { TransitionOrderResolver } from './transition-order-resolver';
import { TransitionOrderContext } from '../schemas';
import { TransitionOrderMapper } from '../mapper';

export const createTransitionOrderContext = (order: Order): TransitionOrderContext => {
  const transitionKey = TransitionOrderResolver.getTransitionKeyByCurrentOrderStatus(order);
  const transitionConfig = TRANSITIONS_ORDER_CONFIG[transitionKey];
  return TransitionOrderMapper.toContext(order, transitionConfig);
};
