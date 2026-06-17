'use client';

import { Pagination } from '@heroui/react';
import { useSearchQueryState } from '../hooks';

export default function ProductListPagination({ totalCount }: { totalCount: number }) {
  const PAGE_SIZE = 12;
  const { filters, updatePage } = useSearchQueryState();

  return (
    <div className="flex w-full justify-center">
      <Pagination
        className="cursor-pointer"
        total={Math.ceil(totalCount / PAGE_SIZE)}
        defaultValue={filters.page}
        page={filters.page}
        onChange={(page) => updatePage(page)}
        showControls
      />
    </div>
  );
}
