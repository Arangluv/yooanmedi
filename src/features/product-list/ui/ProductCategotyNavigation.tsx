'use client';

// TODO : refactoring

import { useRouter, useSearchParams } from 'next/navigation';

import { Tabs, Tab } from '@heroui/react';

import type { ProductCategory } from '@/entities/product/model/types';
import { generateQueryString } from '@/entities/product/lib/generate-query-string';

const ProductCategotyNavigation = ({ categories }: { categories: ProductCategory[] }) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const onTabClick = (key: string) => {
    const query = generateQueryString({
      searchParams,
      category: key,
    }) as any;

    router.push(`/order?${query}`);
  };

  if (categories.length === 0) {
    return null;
  }

  return (
    <Tabs
      variant="underlined"
      size="lg"
      classNames={{
        tabList: 'p-0',
      }}
      defaultSelectedKey={searchParams?.get('category') ?? 'all'}
    >
      <Tab key="all" title="전체" onClick={() => onTabClick('all')}></Tab>
      {categories.map((category) => (
        <Tab
          key={category.id}
          title={category.name}
          onClick={() => onTabClick(String(category.id))}
        ></Tab>
      ))}
    </Tabs>
  );
};

export default ProductCategotyNavigation;
