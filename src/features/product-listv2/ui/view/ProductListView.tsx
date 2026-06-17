import { Product } from '@/entities/product';
import ProductDefaultView from './ProductDefaultView';
import FavoritesView from './FavoritesView';
import ProductSearchResultView from './ProductSearchResultView';
import { ProductListSearchFieldKey } from '../../constants';

interface ProductListViewProps {
  products: Product[];
  totalCount: number;
  condition: ProductListSearchFieldKey;
  keyword: string;
  opt: 'favorites' | null;
}

export const ProductListView = ({
  products,
  totalCount,
  condition,
  keyword,
  opt,
}: ProductListViewProps) => {
  if (opt === 'favorites') {
    return <FavoritesView />;
  }

  if (keyword) {
    return (
      <ProductSearchResultView
        products={products}
        totalCount={totalCount}
        condition={condition}
        keyword={keyword}
      />
    );
  }

  return <ProductDefaultView products={products} totalCount={totalCount} />;
};
