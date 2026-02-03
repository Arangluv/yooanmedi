import { SearchX } from 'lucide-react';

const EmptySearchResult = () => {
  return (
    <div className="mb-8 flex h-[300px] w-full flex-col items-center justify-center gap-4 rounded-lg bg-neutral-50 p-4">
      <SearchX className="text-foreground-200 h-[100px] w-[100px]" strokeWidth={1.5} />
      <span className="text-foreground-700 text-2xl leading-none font-bold">
        검색 결과가 없습니다.
      </span>
      <span className="text-foreground-600 text-sm">다른 검색어를 입력해주세요.</span>
    </div>
  );
};

export default EmptySearchResult;
