'use client';

import { Pagination, PaginationContent, PaginationItem } from '@/shared/ui/shadcn/pagination';
import { Button } from '@/shared/ui/shadcn/button';
import useOrderListSearch from '../../model/useOrderListSearch';
import { SHOW_ORDER_LIST_COUNT } from '../../config/admin-order-list.config';

const TablePagination = ({ totalCount }: { totalCount: number }) => {
  const { filters, updatePage } = useOrderListSearch();
  const totalPage = Math.ceil(totalCount / SHOW_ORDER_LIST_COUNT);

  if (totalPage === 1) {
    return null;
  }

  return (
    <Pagination className="mt-8 shrink-0">
      <PaginationContent>
        {Array.from({ length: totalPage }).map((_, index) => (
          <PaginationItem key={index}>
            <Button
              variant={filters.page === index + 1 ? 'outline' : 'ghost'}
              size="icon"
              onClick={() => updatePage(index + 1)}
            >
              {index + 1}
            </Button>
          </PaginationItem>
        ))}
      </PaginationContent>
    </Pagination>
  );
};

export default TablePagination;
