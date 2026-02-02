'use client';

import { Pagination } from '@heroui/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { generateQueryString } from '@/app/(frontend)/(page)/order/utils';
import { SearchParamsType } from '../../_type';

export default function ProductListPagination({ totalPages }: { totalPages: number }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleChange = (page: number) => {
    const query = generateQueryString({
      searchParams,
      page: String(page),
    }) as SearchParamsType;

    router.push(`/order?${query}`, { scroll: false });
  };

  return (
    <div className="flex w-full justify-center">
      <Pagination
        total={totalPages}
        showControls
        defaultValue={Number(searchParams.get('page')) || 1}
        page={1}
        onChange={handleChange}
        className="cursor-pointer"
      />
    </div>
  );
}
