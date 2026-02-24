import { DefaultServerCellComponentProps } from 'payload';

import { formatNumberWithCommas } from '@/shared/lib/fomatters';

const PriceCell = (props: DefaultServerCellComponentProps) => {
  const priceCellData = props.cellData as number;

  return (
    <div className="text-right text-base font-medium">
      {formatNumberWithCommas(priceCellData)}원
    </div>
  );
};

export default PriceCell;
