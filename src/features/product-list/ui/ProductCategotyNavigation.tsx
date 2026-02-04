'use client';

import { Tabs, Tab } from '@heroui/react';

import { useSearchQueryState, type ProductCategory } from '@/entities/product';

const ProductCategotyNavigation = ({ categories }: { categories: ProductCategory[] }) => {
  const { filters, updateCategory } = useSearchQueryState();

  const onTabClick = (key: number | null) => {
    updateCategory(key);
  };

  if (categories.length === 0) {
    return null;
  }

  return (
    <Tabs
      variant="underlined"
      key={'all'}
      size="lg"
      classNames={{
        tabList: 'p-0',
      }}
      defaultSelectedKey={String(filters.category) ?? 'all'}
    >
      <Tab title="전체" onClick={() => onTabClick(null)}></Tab>
      {categories.map((category) => (
        <Tab key={category.id} title={category.name} onClick={() => onTabClick(category.id)}></Tab>
      ))}
    </Tabs>
  );
};

export default ProductCategotyNavigation;
