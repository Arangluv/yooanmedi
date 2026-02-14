'use client';

import { Tabs, Tab } from '@heroui/react';

import {
  ProductSearchParamsType,
  useSearchQueryState,
  type ProductCategory,
} from '@/entities/product';
import { useEffect, useState } from 'react';

const ProductCategotyNavigation = ({ categories }: { categories: ProductCategory[] }) => {
  const { filters, updateCategory, updateFavorites } = useSearchQueryState();
  const [selectedKey, setSelectedKey] = useState<string>(keyResolver(filters));

  const onTabClick = (key: number | null) => {
    updateCategory(key);
  };

  useEffect(() => {
    setSelectedKey(keyResolver(filters));
  }, [filters]);

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
      selectedKey={selectedKey}
      onSelectionChange={(key) => setSelectedKey(key as string)}
    >
      <Tab key="all" title="전체" onClick={() => onTabClick(null)}></Tab>
      {categories.map((category) => (
        <Tab key={category.id} title={category.name} onClick={() => onTabClick(category.id)}></Tab>
      ))}
      {/* 이 탭은 카테고리 탭과 분리되어야 하지만 요구사항으로 인해 통합 */}
      <Tab title="관심상품" key="favorites" onClick={() => updateFavorites()}></Tab>
    </Tabs>
  );
};

const keyResolver = (filters: ProductSearchParamsType) => {
  if (filters.opt) return filters.opt;
  if (filters.category) return String(filters.category);
  return 'all';
};

export default ProductCategotyNavigation;
