'use client';

import { Pagination } from '@heroui/react';
import { PAGE_SIZE } from '../config/product-list.config';
import { useSearchQueryState } from '../model/useSearchQueryState';

export default function ProductListPagination({ totalCount }: { totalCount: number }) {
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
