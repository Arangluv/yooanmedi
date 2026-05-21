import { FindOption } from '@/shared';
import { TransitionOrderContext } from '../schemas';

export class OrderDetailFindOption {
  public static getOrderProductListOption(context: TransitionOrderContext): FindOption {
    return {
      pagination: false,
      where: {
        order: { equals: context.order.id },
        orderProductStatus: { equals: context.transitionOrderProductStatus.from },
      },
    };
  }

  public static getOrderProductOption(context: TransitionOrderContext): FindOption {
    return {
      pagination: false,
      where: {
        order: { equals: context.order.id },
      },
    };
  }
}
