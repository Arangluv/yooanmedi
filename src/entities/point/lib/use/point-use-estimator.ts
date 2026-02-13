import type { Inventory } from '@/entities/inventory/@x/point';
import { getDeliveryFeeFromProductCosiderFlg } from '@/entities/price/lib/calculator';

export class PointUseEstimator {
  private readonly inventory: Inventory;
  private readonly usedPoint: number;
  private readonly isFreeDelivery: boolean;
  private readonly originalPrice: number;
  private remainingWeightSum: number;
  private remainingPoint: number;
  private usedPointMap: Map<number, { totalPrice: number; weight: number; usedPoint: number }>;

  constructor(inventory: Inventory, usedPoint: number, isFreeDelivery: boolean) {
    this.inventory = inventory;
    this.usedPoint = usedPoint;
    this.isFreeDelivery = isFreeDelivery;
    this.originalPrice = this.getOriginalPrice();
    this.remainingWeightSum = 100;
    this.remainingPoint = usedPoint;
    this.usedPointMap = this.createPriceMap();
    this.estimate();
  }

  private createPriceMap(): Map<number, { totalPrice: number; weight: number; usedPoint: number }> {
    const usedPointMap = new Map<
      number,
      { totalPrice: number; weight: number; usedPoint: number }
    >();

    this.inventory.forEach((item, idx) => {
      const productDeliveryFee = getDeliveryFeeFromProductCosiderFlg({
        inventoryItem: item,
        freeDeliveryFlg: this.isFreeDelivery,
      });
      const totalPrice = item.product.price * item.quantity + productDeliveryFee;

      if (this.usedPoint === 0) {
        usedPointMap.set(item.product.id, {
          totalPrice,
          weight: 0,
          usedPoint: 0,
        });
        return;
      }

      const weight =
        idx === this.inventory.length - 1
          ? this.remainingWeightSum
          : this.getWeight(item.product.price * item.quantity);

      const usedPoint = this.calculateUsedPoint(weight);
      const usablePoint = this.checkGetablePoint(totalPrice, usedPoint);

      usedPointMap.set(item.product.id, {
        totalPrice,
        weight,
        usedPoint: usablePoint,
      });
    });

    return usedPointMap;
  }

  private getOriginalPrice() {
    return this.inventory.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  }

  private getWeight(price: number) {
    const weight = Math.floor((price / this.originalPrice) * 100);
    this.remainingWeightSum -= weight;

    // 최소 weight를 보장해줘야함
    return Math.max(1, weight);
  }

  private calculateUsedPoint(weight: number) {
    const point = Math.max(1, Math.floor((this.usedPoint * weight) / 100));

    this.remainingPoint -= point;

    return point;
  }

  private checkGetablePoint(totalPrice: number, point: number) {
    if (point > totalPrice) {
      // 초과된 금액은 남은 포인트에 추가
      this.remainingPoint += point - totalPrice;
      return totalPrice;
    }

    return point;
  }

  // 남은 잔여 포인트가 있을때 가중치를 고려하여 추가 분배한다.
  private normalizeUsedPointMap(maxStep: number) {
    if (this.remainingPoint === 0 || maxStep === 4) {
      return;
    }

    // step 1. find totalPrice - usedPoint > 0
    const targets = Array.from(this.usedPointMap.entries()).filter(([_, value]) => {
      return value.totalPrice - value.usedPoint > 0;
    });

    // step 2. 새로운 분배 가중치 계산
    const TOTAL_WEIGHT_SUM = targets.reduce((acc, [_, value]) => acc + value.weight, 0);

    // step 3. 새로운 분배 포인트를 계산
    const newMap = new Map<number, { usedPoint: number }>();

    targets.forEach(([key, value]) => {
      const weight = Math.floor((value.weight / TOTAL_WEIGHT_SUM) * 100);
      const calculatedRedistributePoint = Math.max(
        1,
        Math.floor((this.remainingPoint * weight) / 100),
      );

      const maximumRedistributePoint = value.totalPrice - value.usedPoint;
      const redistributablePoint = Math.min(calculatedRedistributePoint, maximumRedistributePoint);

      const newUsedPoint = Math.min(redistributablePoint, this.remainingPoint);

      this.remainingPoint -= newUsedPoint;

      newMap.set(key, { usedPoint: newUsedPoint });
    });

    newMap.forEach((value, key) => {
      this.usedPointMap.set(key, {
        ...this.usedPointMap.get(key)!,
        usedPoint: value.usedPoint + this.usedPointMap.get(key)!.usedPoint,
      });
    });

    // 남은 포인트가 있으면 정규화 함수를 재귀 호출
    this.normalizeUsedPointMap(maxStep + 1);
  }

  private estimate() {
    if (this.remainingPoint < 0) {
      throw new Error('사용 포인트 계산에 문제가 발생했습니다');
    }

    if (this.usedPoint !== 0 && this.remainingPoint !== 0) {
      this.normalizeUsedPointMap(0);
    }
  }

  public getUsedPoint(productId: number) {
    const target = this.usedPointMap.get(productId);

    if (!target) {
      throw new Error('사용 포인트 계산에 문제가 발생했습니다');
    }

    return target.usedPoint;
  }
}
