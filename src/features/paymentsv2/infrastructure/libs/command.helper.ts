import {
  BaseError,
  generate15digitsNumberBasedOnDate,
  PAYMENTS_METHOD,
  PriceResolver,
} from '@/shared';
import { EasyPayMapper, EasyPayPaymentAuthenticationDto } from '@/entities/easypay';
import { PointAllocator } from '@/entities/point';
import { ProductRepository } from '@/entities/product';
import { PaymentFindOptions } from './payment.find-option';
import { BankTransferPaymentMapper, PGPaymentMapper } from '../../mapper';
import {
  BankTransferPaymentCommandDto,
  BankTransferPaymentRequestDto,
  PGPaymentCommandDto,
} from '../../dto';

export class PaymentCommandHelper {
  static toPaymentAuthResult(data: FormData) {
    let rowData = {} as any;
    data.forEach((value: any, key: string) => {
      rowData[key as string] = value;
    });

    return EasyPayMapper.toAuthenticationDto(rowData);
  }

  static async createPGCommandDto(
    dto: EasyPayPaymentAuthenticationDto,
    productRepository: ProductRepository,
  ): Promise<PGPaymentCommandDto> {
    // Populate product data to request orderList
    const productIds = dto.orderList.map((item) => item.product.id);
    const { products } = await productRepository.findMany(
      PaymentFindOptions.product.findMany(productIds),
    );
    const populatedProducts = dto.orderList.map((item) => {
      const product = products.find((product) => product.id === item.product.id);
      if (!product) {
        throw new BaseError({
          clientMsg: '결제 과정에서 문제가 발생했습니다',
          devMsg:
            'PGCommandDto를 생성하는 과정에서 문제가 발생했습니다. 상품정보를 찾을 수 없습니다',
          errorName: 'PGCommnadError',
        });
      }

      return {
        product: {
          ...product,
          price: item.product.price, // 매우 중요한 로직이다. 사용자에게 설정된 가격으로 결제되어야한다.
        },
        quantity: item.quantity,
      };
    });

    const priceItems = PGPaymentMapper.toPrcieItems(populatedProducts);
    const priceResolver = new PriceResolver(priceItems, dto.minOrderPrice);
    const pointAllocator = new PointAllocator(populatedProducts, dto.usedPoint);

    const orderItems = populatedProducts.map((item) => {
      const totalAmount =
        priceResolver.getItemSubTotal(item.product.id) -
        pointAllocator.getAllocatedPoint(item.product.id);
      const deliveryFee = priceResolver.getItemDeliveryFee(item.product.id);
      const calculatedUsedPoint = pointAllocator.getAllocatedPoint(item.product.id);

      return {
        ...item,
        totalAmount,
        deliveryFee,
        usedPoint: calculatedUsedPoint,
      };
    });

    const totalAmount = orderItems.reduce((acc, item) => acc + item.totalAmount, 0);
    return {
      user: {
        id: dto.userId,
        deliveryRequest: dto.deliveryRequest,
        usedPoint: dto.usedPoint,
      },
      paymentInfo: {
        orderList: orderItems,
        shopOrderNo: dto.shopOrderNo,
        totalAmount,
        authorizationId: dto.authorizationId,
        paymentMethod: PAYMENTS_METHOD.credit_card,
      },
      minOrderPrice: dto.minOrderPrice,
    };
  }

  static createBankTransferCommandDto(
    dto: BankTransferPaymentRequestDto,
  ): BankTransferPaymentCommandDto {
    const priceItems = BankTransferPaymentMapper.toPriceItems(dto.paymentInfo.orderList);
    const priceResolver = new PriceResolver(priceItems, dto.minOrderPrice);
    const pointAllocator = new PointAllocator(dto.paymentInfo.orderList, dto.user.usedPoint);

    const orderItems = dto.paymentInfo.orderList.map((item) => {
      const totalAmount =
        priceResolver.getItemSubTotal(item.product.id) -
        pointAllocator.getAllocatedPoint(item.product.id);
      const deliveryFee = priceResolver.getItemDeliveryFee(item.product.id);
      const calculatedUsedPoint = pointAllocator.getAllocatedPoint(item.product.id);

      return {
        ...item,
        totalAmount,
        deliveryFee,
        usedPoint: calculatedUsedPoint,
      };
    });

    return {
      user: dto.user,
      paymentInfo: {
        orderList: orderItems,
        shopOrderNo: generate15digitsNumberBasedOnDate(),
        totalAmount: dto.paymentInfo.totalAmount,
        paymentMethod: PAYMENTS_METHOD.bank_transfer,
      },
      minOrderPrice: dto.minOrderPrice,
    };
  }
}
