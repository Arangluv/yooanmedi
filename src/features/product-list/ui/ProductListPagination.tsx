'use client';

import { Pagination } from '@heroui/react';

import { useSearchQueryState } from '@/entities/product';

export default function ProductListPagination({ totalPages }: { totalPages: number }) {
  const { filters, updatePage } = useSearchQueryState();

  return (
    <div className="flex w-full justify-center">
      <Pagination
        total={totalPages}
        showControls
        defaultValue={filters.page}
        page={filters.page}
        onChange={(page) => updatePage(page)}
        className="cursor-pointer"
      />
    </div>
  );
}
