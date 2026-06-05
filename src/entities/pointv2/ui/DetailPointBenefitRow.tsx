import type { CartItem } from '@/entities/cart/@x/point';
import { PointCalculator } from '@/entities/point';
import { PointTransactionMapper } from '../mapper';

const DetailPointBenefitRow = ({ product }: Pick<CartItem, 'product'>) => {
  const SINGLE_PRODUCT_QUANTITY = 1;
  const willEarnPointForCard = PointCalculator.forCard(
    PointTransactionMapper.productToPointItem(product, SINGLE_PRODUCT_QUANTITY),
  );
  const willEarnPointForBankTransfer = PointCalculator.forCard(
    PointTransactionMapper.productToPointItem(product, SINGLE_PRODUCT_QUANTITY),
  );

  if (willEarnPointForCard === 0 && willEarnPointForBankTransfer === 0) {
    return null;
  }

  return (
    <div className="text-foreground-600 flex items-start gap-2 text-sm">
      <span className="text-foreground-700 block w-[100px] flex-shrink-0">결제혜택</span>
      <div className="flex flex-col gap-1">
        {willEarnPointForCard > 0 && (
          <span className="text-brandWeek">
            카드 결제시 <span className="font-bold">{willEarnPointForCard}원</span> 적립
          </span>
        )}
        {willEarnPointForBankTransfer > 0 && (
          <span className="text-brandWeek">
            무통장 입금시 <span className="font-bold">{willEarnPointForBankTransfer}원</span> 적립
          </span>
        )}
      </div>
    </div>
  );
};

export default DetailPointBenefitRow;
