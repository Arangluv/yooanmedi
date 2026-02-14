type ResolveViewStateProps = {
  keyword: string;
  opt: 'favorites' | null;
};

type ProductListViewState = 'FAVORITES' | 'SEARCH' | 'DEFAULT';

const resolveViewState = ({ keyword, opt }: ResolveViewStateProps): ProductListViewState => {
  if (opt === 'favorites') return 'FAVORITES';
  if (keyword) return 'SEARCH';
  return 'DEFAULT';
};

export default resolveViewState;
