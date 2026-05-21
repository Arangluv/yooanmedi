import { orderTransitionUseCase } from '../services';
import { createUseTransitionOrder } from './useTransitionOrder';

export const useTransitionOrder = createUseTransitionOrder(orderTransitionUseCase);
