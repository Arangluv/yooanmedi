'use client';

import { Pagination, PaginationContent, PaginationItem } from '@/shared/ui/shadcn/pagination';
import { Button } from '@/shared/ui/shadcn/button';
import useOrderListSearch from '../../model/useOrderListSearch';

const TablePagination = ({ totalPages }: { totalPages: number }) => {
  const { filters, updatePage } = useOrderListSearch();

  if (totalPages === 1) {
    return null;
  }

  return (
    <Pagination className="mt-8">
      <PaginationContent>
        {Array.from({ length: totalPages }).map((_, index) => (
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
