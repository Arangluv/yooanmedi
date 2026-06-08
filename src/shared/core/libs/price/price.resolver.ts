import { calcItemPrice } from './price.calculator';
import { PriceItemDto } from './price.dto';
import { ResolvedPriceItem } from './price.type';
import { calcDeliveryFee } from './price.calculator';
import { resolvedPriceItemSchema } from './price.schema';
import { ZodSchemaParser } from '../zod';
import { BaseError } from '../errors';

export class PriceResolver {
  private readonly priceMap: Map<number, ResolvedPriceItem>;

  constructor(dto: PriceItemDto[], minOrderPrice: number) {
    this.priceMap = this.toResolvedItem(dto, minOrderPrice);
  }

  public getItemPrice(id: number) {
    const priceItem = this.priceMap.get(id);
    if (!priceItem) {
      throw new BaseError({
        clientMsg: '상품 가격정보를 가져오는데 문제가 발생했습니다',
        errorName: 'PriceNotFoundError',
      });
    }
    return priceItem.price * priceItem.quantity;
  }

  public getTotalPrice() {
    const priceItems = [...this.priceMap.values()];
    return priceItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }

  public getItemDeliveryFee(id: number) {
    const priceItem = this.priceMap.get(id);
    if (!priceItem) {
      throw new Error();
    }

    return priceItem.deliveryFee;
  }

  public getTotalDeliveryFee() {
    const priceItems = [...this.priceMap.values()];
    return priceItems.reduce((acc, item) => acc + item.deliveryFee, 0);
  }

  public getItemSubTotal(id: number) {
    const priceItem = this.priceMap.get(id);
    if (!priceItem) {
      throw new BaseError({
        clientMsg: '상품 가격정보를 가져오는데 문제가 발생했습니다',
        errorName: 'PriceNotFoundError',
      });
    }

    return this.getItemDeliveryFee(id) + this.getItemPrice(id);
  }

  public getSubTotal() {
    return this.getTotalPrice() + this.getTotalDeliveryFee();
  }

  private toResolvedItem(
    dto: PriceItemDto[],
    minOrderPrice: number,
  ): Map<number, ResolvedPriceItem> {
    const priceMap = new Map();
    const isFreeDelivery = this.calcIsFreeDelivery(dto, minOrderPrice);
    dto.forEach((item) => {
      if (priceMap.get(item.id)) {
        throw new Error('asd');
      }
      const resolvedItem = ZodSchemaParser.safeParseOrThrow(resolvedPriceItemSchema, {
        data: {
          id: item.id,
          price: item.product.price,
          deliveryFee: calcDeliveryFee(item, isFreeDelivery),
          quantity: item.quantity,
        },
        errorMsg: '잘못된 priceItem 타입입니다',
      });

      priceMap.set(item.id, resolvedItem);
    });
    return priceMap;
  }

  private calcIsFreeDelivery(items: PriceItemDto[], minOrderPrice: number): boolean {
    const filteredItems = items.filter(({ product }) => product.is_free_delivery);
    const eligibleTotal = filteredItems.reduce((acc, item) => acc + calcItemPrice(item), 0);

    return eligibleTotal >= minOrderPrice;
  }
}
