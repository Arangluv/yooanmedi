import { FindOption } from '@/shared';
import { TransitionOrderContext } from '../schemas';
import { PGTransitionOrderCommandDto, BankTransferTransitionOrderCommandDto } from '../dto';

// will remove
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

export const TransitionOrderFindOption = {
  orderProduct: {
    findMany: (
      commandDto: PGTransitionOrderCommandDto | BankTransferTransitionOrderCommandDto,
    ): FindOption => {
      return {
        pagination: false,
        where: {
          order: { equals: commandDto.order.id },
          orderProductStatus: { equals: commandDto.orderProductStatus.from },
        },
      };
    },
  },
};
