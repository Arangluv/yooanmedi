import { CustomPrice } from '../types';

export class CustomPriceUtil {
  static toMapKeyedByProductId(curtomPrices: CustomPrice[]) {
    const map = new Map<number, CustomPrice>();
    curtomPrices.forEach((item) => {
      map.set(item.product, item);
    });
    return map;
  }
}
