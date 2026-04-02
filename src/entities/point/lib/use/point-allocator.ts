import { DeliveryFeeManager } from '@/entities/inventory/lib/delivery-fee-manager';

export class PointAllocator {
  private readonly deliveryFeeManager: DeliveryFeeManager;
  private readonly usedPoint: number;
  private ratioMap: Map<number, number>;
  private pointMap: Map<number, number>;

  constructor(deliveryFeeManager: DeliveryFeeManager, usedPoint: number) {
    this.deliveryFeeManager = deliveryFeeManager;
    this.usedPoint = usedPoint;
    this.ratioMap = this.createRatioMap();
    this.pointMap = this.createPointMap();
  }

  /**
   * 주문 상품의 구매금액이 전체 구매금액에 얼만큼 비례하는지 ratio를 계산하여 반환합니다.
   * 최소 1%를 보장하여 사용포인트 히스토리를 만들 수 있도록 합니다.
   */
  private createRatioMap() {
    const ratioMap = new Map<number, number>();
    const inventory = this.deliveryFeeManager.getInventory();
    const totalPriceWithoutDeliveryFee = inventory.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0,
    );

    let remainingWeightSum = 100;

    inventory.forEach((item, idx) => {
      const orderProductPrice = item.product.price * item.quantity;
      const weight =
        idx === inventory.length - 1
          ? remainingWeightSum
          : this.calculateWeight(totalPriceWithoutDeliveryFee, orderProductPrice);

      ratioMap.set(item.product.id, weight);
      remainingWeightSum -= weight;
    });

    return ratioMap;
  }

  private createPointMap() {
    const pointMap = new Map<number, number>();
    const inventory = this.deliveryFeeManager.getInventory();

    // 1. 가중치에 비례하여 포인트를 분배합니다.
    inventory.forEach((item) => {
      const ratio = this.ratioMap.get(item.product.id);

      if (!ratio) {
        throw new Error('주문 상품의 가중치가 존재하지 않습니다');
      }

      const point = Math.floor((this.usedPoint * ratio) / 100);
      pointMap.set(item.product.id, point);
    });

    const distributedPointSum = Array.from(pointMap.values()).reduce(
      (acc, point) => acc + point,
      0,
    );
    const remainingPoint = this.usedPoint - distributedPointSum;

    // 2. 분배 후 남은 포인트가 있으면 가중치가 가장 큰 상품에 추가합니다
    if (remainingPoint > 0) {
      const weights = Array.from(this.ratioMap.values());
      const orderProducutIds = Array.from(this.ratioMap.keys());

      const maxWeightIndex = weights.indexOf(Math.max(...weights));
      const maxWeightId = orderProducutIds[maxWeightIndex];

      pointMap.set(maxWeightId, pointMap.get(maxWeightId)! + remainingPoint);
    }

    return pointMap;
  }

  private calculateWeight(totalPriceWithoutDeliveryFee: number, orderProductPrice: number) {
    const minWeight = 1;
    const weight = Math.floor((orderProductPrice / totalPriceWithoutDeliveryFee) * 100);

    return Math.max(minWeight, weight);
  }

  public getAllocatedPoint(productId: number) {
    const point = this.pointMap.get(productId);

    if (point === undefined) {
      throw new Error('분배된 포인트가 존재하지 않습니다');
    }

    return point;
  }
}
