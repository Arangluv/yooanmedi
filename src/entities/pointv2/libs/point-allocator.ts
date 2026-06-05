import { DeliveryFeeManager } from '@/entities/cart';

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
    const cartItems = this.deliveryFeeManager.getCartItems();
    const totalPriceWithoutDeliveryFee = cartItems.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0,
    );

    let remainingWeightSum = 100;

    cartItems.forEach((item, idx) => {
      const orderProductPrice = item.product.price * item.quantity;
      const weight =
        idx === cartItems.length - 1
          ? remainingWeightSum
          : this.calculateWeight(totalPriceWithoutDeliveryFee, orderProductPrice);

      ratioMap.set(item.product.id, weight);
      remainingWeightSum -= weight;
    });

    return ratioMap;
  }

  private createPointMap() {
    const pointMap = new Map<number, number>();
    const cartItems = this.deliveryFeeManager.getCartItems();

    cartItems.forEach((item) => {
      const ratio = this.ratioMap.get(item.product.id);
      if (!ratio) throw new Error('주문 상품의 가중치가 존재하지 않습니다');

      const point = Math.floor((this.usedPoint * ratio) / 100);
      const productPrice = item.product.price * item.quantity;
      pointMap.set(item.product.id, Math.min(point, productPrice));
    });

    const distributedPointSum = Array.from(pointMap.values()).reduce((acc, p) => acc + p, 0);
    let remainingPoint = this.usedPoint - distributedPointSum;

    // 1원씩 순서대로 분배 (floor로 생긴 잔여 포인트는 소액이므로 순회로 처리)
    for (const item of cartItems) {
      if (remainingPoint <= 0) break;

      const productPrice = item.product.price * item.quantity;
      const alreadyAllocated = pointMap.get(item.product.id)!;
      const canReceive = productPrice - alreadyAllocated; // 더 받을 수 있는 한도

      if (canReceive <= 0) continue;

      const toAllocate = Math.min(remainingPoint, canReceive);
      pointMap.set(item.product.id, alreadyAllocated + toAllocate);
      remainingPoint -= toAllocate;
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
