import type { Inventory } from '@/entities/inventory/@x/point';
import type { PointAllocator } from '@/entities/point/lib/use/point-allocator';
import { getDeliveryFeeFromProductCosiderFlg } from '@/entities/price/lib/calculator';

export class DeliveryFeeManager {
  private readonly inventory: Inventory;
  private readonly freeDelivery: boolean;

  constructor(inventory: Inventory, minOrderPrice: number) {
    this.inventory = inventory;
    this.freeDelivery = this.calcIsFreeDelivery(minOrderPrice);
  }

  // 최소 주문금액 이상 주문 시 배송비 무료가 적용되는 상품을 필터링 후 총 금액을 계산하여 반환합니다
  private getFreeDeliveryEligibleTotalPrice() {
    const eligibleProducts = this.inventory.filter(({ product }) => product.is_free_delivery);
    const eligibleTotalPrice = eligibleProducts.reduce(
      (acc, { product, quantity }) => acc + product.price * quantity,
      0,
    );

    return eligibleTotalPrice;
  }

  // 설정한 최소 주문금액과 총 결제 금액을 비교하여 배송비 무료 여부를 반환합니다
  private calcIsFreeDelivery(minOrderPrice: number) {
    const eligibleTotalPrice = this.getFreeDeliveryEligibleTotalPrice();

    return eligibleTotalPrice >= minOrderPrice;
  }

  public isFreeDelivery() {
    return this.freeDelivery;
  }

  /**
   * 주문 상품의 배송비를 배송비 무료 여부를 고려하여 계산하여 반환합니다.
   */
  public getOrderProductDeliveryFee(orderProduct: Inventory[number]) {
    const deliveryFee = getDeliveryFeeFromProductCosiderFlg({
      inventoryItem: orderProduct,
      freeDeliveryFlg: this.freeDelivery,
    });

    return deliveryFee;
  }

  /**
   * 주문 상품에서 사용적립금을 제외한 총 예상 결제금액에 대한 소계를 계산하여 반환합니다.
   * 결제의 총 금액은 소계 - 사용 적립금액 입니다.
   * 사용 적립금액 계산은 PointAllocator 클래스에서 처리합니다.
   *
   * @see {@link PointAllocator}
   */
  public getOrderProductSubtotal(orderProduct: Inventory[number]) {
    const { product, quantity } = orderProduct;
    const subtotal = product.price * quantity + this.getOrderProductDeliveryFee(orderProduct);

    return subtotal;
  }

  public getInventory() {
    return this.inventory;
  }
}
