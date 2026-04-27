import { Product } from '@/entities/product';
import ProductDefaultView from './ProductDefaultView';
import FavoritesView from './FavoritesView';
import ProductSearchResultView from './ProductSearchResultView';
import { type SearchFieldKey } from '../../constant/search-field';
import resolveViewState from '../../lib/resolve-view-state';

interface ProductListViewProps {
  products: Product[];
  totalCount: number;
  condition: SearchFieldKey;
  keyword: string;
  opt: 'favorites' | null;
}

const ProductListView = ({
  products,
  totalCount,
  condition,
  keyword,
  opt,
}: ProductListViewProps) => {
  const viewState = resolveViewState({ keyword, opt });

  switch (viewState) {
    case 'FAVORITES':
      return <FavoritesView />;
    case 'SEARCH':
      return (
        <ProductSearchResultView
          products={products}
          totalCount={totalCount}
          condition={condition}
          keyword={keyword}
        />
      );
    case 'DEFAULT':
      return <ProductDefaultView products={products} totalCount={totalCount} />;
  }
};

export default ProductListView;
