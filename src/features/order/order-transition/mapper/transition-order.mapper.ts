import { zodSafeParse } from '@/shared';
import { Order } from '@/entities/order';
import { TransitionConfigDefinition } from '../constants';
import { transitionOrderContextSchema } from '../schemas';

export class TransitionOrderMapper {
  public static toContext(order: Order, config: TransitionConfigDefinition) {
    return zodSafeParse(transitionOrderContextSchema, { order, ...config });
  }
}
