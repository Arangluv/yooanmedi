import type { ProductItem as ProductItemType } from '@/entities/product/model/types';
import ProductItem from './ProductItem';

const ProductList = ({ products }: { products: ProductItemType[] }) => {
  return (
    <div className="mb-10 grid grid-cols-4 gap-x-4 gap-y-8">
      {products.map((item) => (
        <ProductItem key={item.id} product={item} />
      ))}
    </div>
  );
};

export default ProductList;
