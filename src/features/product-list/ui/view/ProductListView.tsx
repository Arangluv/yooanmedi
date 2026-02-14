import { ProductItem } from '@/entities/product';

import ProductDefaultView from './ProductDefaultView';
import FavoritesView from './FavoritesView';
import ProductSearchResultView from './ProductSearchResultView';
import resolveViewState from '../../lib/resolve-view-state';

interface ProductListViewProps {
  products: ProductItem[];
  totalPages: number;
  totalProducts: number;
  condition: 'pn' | 'cn';
  keyword: string;
  opt: 'favorites' | null;
}

const ProductListView = ({
  products,
  totalPages,
  totalProducts,
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
          totalPages={totalPages}
          totalProducts={totalProducts}
          condition={condition}
          keyword={keyword}
        />
      );
    case 'DEFAULT':
      return <ProductDefaultView products={products} totalPages={totalPages} />;
  }
};

export default ProductListView;
