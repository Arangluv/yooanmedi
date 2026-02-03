'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import { SearchParamsType } from '@/entities/product/model/types';

import { Form, Input, Select, SelectItem } from '@heroui/react';
import clsx from 'clsx';
import { Search } from 'lucide-react';

import { generateQueryStringForSearch } from '@/entities/product/lib/generate-query-for-search';
import {
  KEYWORD_SEARCH_CONDITION_KEY,
  KEYWORD_SEARCH_CONDITION_LABEL,
} from '@/entities/product/constant/search-keyword-condition';

const ProductSearchForm = () => {
  // useSearchParams -> SearchParamsType으로 변경해주는 유틸 함수가 필요할거같다.
  // 혹은 nuqs 라이브러리를 사용하자
  const searchParams = useSearchParams();
  const router = useRouter();

  const searchKeywordCondition = KEYWORD_SEARCH_CONDITION_KEY.map((key) => ({
    key,
    label: KEYWORD_SEARCH_CONDITION_LABEL[key],
  }));

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const condition = formData.get('condition') as string;
    const keyword = formData.get('keyword') as string;

    const query = generateQueryStringForSearch({
      searchParams,
      condition,
      keyword,
    }) as SearchParamsType;
    router.push(`/order?${query}`);
  };

  return (
    <Form
      className="absolute top-1/2 left-1/2 flex w-[600px] -translate-x-1/2 -translate-y-1/2 flex-row gap-0"
      onSubmit={onSubmit}
    >
      <Select
        // TODO : Refactoring
        defaultSelectedKeys={[searchParams?.get('condition') ?? searchKeywordCondition[0].key]}
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
        defaultValue={searchParams?.get('keyword') ?? ''}
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
