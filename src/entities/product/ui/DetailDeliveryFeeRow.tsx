import type { Product } from '../model/schemas/product.schema';

type DetailDeliveryFeeRowProps = {
  label: string;
  value: string;
  product: Product;
};

const DetailDeliveryFeeRow = ({ label, value, product }: DetailDeliveryFeeRowProps) => {
  const isCostPerUnit = product.is_cost_per_unit;

  return (
    <div className="text-foreground-600 flex items-start gap-2 text-sm">
      <span className="text-foreground-700 block w-[100px] flex-shrink-0">{label}</span>
      <span className="text-foreground-600 flex items-center gap-1">
        <span>{value}</span>
        <span className="text-brandWeek text-sm font-bold">{isCostPerUnit ? '(수량 당)' : ''}</span>
      </span>
    </div>
  );
};

export default DetailDeliveryFeeRow;
