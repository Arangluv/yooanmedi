import type { Inventory } from '@/entities/inventory/@x/point';
import { getDeliveryFeeFromProductCosiderFlg } from '@/entities/price/lib/calculator';

export class PointUseEstimator {
  private readonly inventory: Inventory;
  private readonly usedPoint: number;
  private readonly isFreeDelivery: boolean;
  private readonly originalPrice: number;
  private remainingWeightSum: number;
  private remainingPoint: number;
  private usedPointMap: Map<number, { totalPrice: number; usedPoint: number }>;

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

  private createPriceMap(): Map<number, { totalPrice: number; usedPoint: number }> {
    const usedPointMap = new Map<number, { totalPrice: number; usedPoint: number }>();

    this.inventory.forEach((item, idx) => {
      const productDeliveryFee = getDeliveryFeeFromProductCosiderFlg({
        inventoryItem: item,
        freeDeliveryFlg: this.isFreeDelivery,
      });
      const totalPrice = item.product.price * item.quantity + productDeliveryFee;
      const weight =
        idx === this.inventory.length - 1
          ? this.remainingWeightSum
          : this.getWeight(item.product.price * item.quantity);

      const usedPoint = this.calculateUsedPoint(weight);
      const usablePoint = this.checkGetablePoint(totalPrice, usedPoint);

      usedPointMap.set(item.product.id, {
        totalPrice,
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

    return weight;
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

  // 남은 잔여 포인트가 있는 경우 재분배한다.
  private normalizeUsedPointMap() {
    if (this.remainingPoint === 0) {
      return;
    }

    for (const [key, value] of this.usedPointMap.entries()) {
      if (this.remainingPoint === 0) {
        break;
      }
      const { totalPrice, usedPoint } = value;
      const subtractPrice = totalPrice - usedPoint;

      if (subtractPrice > 0) {
        const additionalUsedPoint = Math.min(subtractPrice, this.remainingPoint);
        this.usedPointMap.set(key, { ...value, usedPoint: usedPoint + additionalUsedPoint });

        this.remainingPoint -= additionalUsedPoint;
      }
    }
  }

  private estimate() {
    if (this.remainingPoint < 0) {
      throw new Error('사용 포인트 계산에 문제가 발생했습니다');
    }

    this.normalizeUsedPointMap();
  }

  public getUsedPoint(productId: number) {
    const target = this.usedPointMap.get(productId);
    if (!target) {
      throw new Error('사용 포인트 계산에 문제가 발생했습니다');
    }

    return target.usedPoint;
  }
}
