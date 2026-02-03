import type { ProductItem } from '../model/types';
import { getPointWhenUsingBankTransfer, getPointWhenUsingCard } from '../lib/get-max-point';

const DetailPointBenefitRow = ({ product }: { product: ProductItem }) => {
  const willEarnPointForCard = getPointWhenUsingCard(product);
  const willEarnPointForBankTransfer = getPointWhenUsingBankTransfer(product);

  if (willEarnPointForCard === 0 && willEarnPointForBankTransfer === 0) {
    return null;
  }

  return (
    <div className="text-foreground-600 flex items-start gap-2 text-sm">
      <span className="text-foreground-700 block w-[100px] flex-shrink-0">결제혜택</span>
      <div className="flex flex-col gap-1">
        {Number(willEarnPointForCard) > 0 && (
          <span className="text-brandWeek">
            카드 결제시 <span className="font-bold">{willEarnPointForCard}원</span> 적립
          </span>
        )}
        {Number(willEarnPointForBankTransfer) > 0 && (
          <span className="text-brandWeek">
            무통장 입금시 <span className="font-bold">{willEarnPointForBankTransfer}원</span> 적립
          </span>
        )}
      </div>
    </div>
  );
};

export default DetailPointBenefitRow;