'use client';

import { useSearchParams } from 'next/navigation';

import { Form, Input, Select, SelectItem } from '@heroui/react';
import clsx from 'clsx';
import { Search } from 'lucide-react';

import {
  KEYWORD_SEARCH_CONDITION_KEY,
  KEYWORD_SEARCH_CONDITION_LABEL,
  generateQueryStringForSearch,
  useSearchQueryState,
} from '@/entities/product';
import type { KeywordSearchConditionKey, SearchParamsType } from '@/entities/product';
import { useEffect } from 'react';

const ProductSearchForm = () => {
  const { filters, updateKeyword } = useSearchQueryState();
  const searchKeywordCondition = KEYWORD_SEARCH_CONDITION_KEY.map((key) => ({
    key,
    label: KEYWORD_SEARCH_CONDITION_LABEL[key],
  }));

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const condition = formData.get('condition') as KeywordSearchConditionKey;
    const keyword = formData.get('keyword') as string;

    updateKeyword({ keyword, condition });
    // 더 이상 컴포넌트 별로 상태를 관리할 필요가 없다
    // const query = generateQueryStringForSearch({
    //   searchParams,
    //   condition,
    //   keyword,
    // }) as SearchParamsType;
    // router.push(`/order?${query}`);
  };

  return (
    <Form
      className="absolute top-1/2 left-1/2 flex w-[600px] -translate-x-1/2 -translate-y-1/2 flex-row gap-0"
      onSubmit={onSubmit}
    >
      <Select
        defaultSelectedKeys={[filters.condition ?? searchKeywordCondition[0].key]}
        radius="sm"
        name="condition"
        variant="bordered"
        aria-label="검색 조건"
        classNames={{
          base: 'w-[20%]',
          trigger:
            'border-1 border-brandWeek rounded-r-none border-r-0 text-sm data-[hover=true]:border-brandWeekWeek data-[open=true]:border-brandWeekWeek',
        }}
        renderValue={(items: any) => {
          return <span className="text-foreground-700 text-sm">{items[0].textValue}</span>;
        }}
      >
        {searchKeywordCondition.map((item) => (
          <SelectItem key={item.key} classNames={{ title: 'text-sm text-foreground-800' }}>
            {item.label}
          </SelectItem>
        ))}
      </Select>
      <Input
        radius="sm"
        name="keyword"
        disableAnimation={true}
        variant="bordered"
        aria-label="검색어"
        defaultValue={filters.keyword}
        classNames={{
          base: 'w-[80%]',
          inputWrapper: clsx(
            'border-1 border-brandWeek rounded-l-none border-l-0',
            'data-[hover=true]:border-brandWeekWeek',
            'group-data-[focus=true]:border-brandWeekWeek',
          ),
        }}
        placeholder="검색어를 입력해주세요."
        endContent={
          <button type="submit">
            <Search className="text-brandWeek h-5 w-5 cursor-pointer" />
          </button>
        }
      />
    </Form>
  );
};

export default ProductSearchForm;
