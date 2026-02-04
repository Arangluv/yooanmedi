import type { ProductItem as ProductItemType } from '@/entities/product/model/types';
import ProductItemCard from './ProductItemCard';

const ProductList = ({ products }: { products: ProductItemType[] }) => {
  return (
    <div className="mb-10 grid grid-cols-4 gap-x-4 gap-y-8">
      {products.map((item) => (
        <ProductItemCard key={item.id} product={item} />
      ))}
    </div>
  );
};

export default ProductList;
