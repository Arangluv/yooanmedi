'use server';

import {
  createAdminCancelOrderUseCase,
  createClientCancelOrderUseCase,
} from '../../infrastructure';

export const adminCancelOrderUseCase = createAdminCancelOrderUseCase();
export const clientCancelOrderUseCase = createClientCancelOrderUseCase();
