import { orderTransitionUseCase } from '../core';
import { createUseTransitionOrder } from './useTransitionOrder';

export const useTransitionOrder = createUseTransitionOrder(orderTransitionUseCase);
