'use client';

import { useEffect, useState } from 'react';
import { Form, Input, Select, SelectItem } from '@heroui/react';
import clsx from 'clsx';
import { Search } from 'lucide-react';
import {
  SEARCH_FIELD_KEY,
  SEARCH_FIELD_LABEL,
  type SearchFieldKey,
} from '../constant/search-field';
import { useSearchQueryState } from '../model/useSearchQueryState';

const searchKeywordCondition = SEARCH_FIELD_KEY.map((key) => ({
  key,
  label: SEARCH_FIELD_LABEL[key],
}));

const ProductSearchForm = () => {
  const { filters, updateKeyword, resetFilters } = useSearchQueryState();

  const [condition, setCondition] = useState<SearchFieldKey>(filters.condition);
  const [keyword, setKeyword] = useState<string>(filters.keyword);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const condition = formData.get('condition') as SearchFieldKey;
    const keyword = formData.get('keyword') as string;

    if (keyword.trim() === '') {
      resetFilters();
      return;
    }

    updateKeyword({ keyword, condition });
  };

  useEffect(() => {
    setCondition(filters.condition);
    setKeyword(filters.keyword);
  }, [filters]);

  return (
    <Form
      className="absolute top-1/2 left-1/2 flex w-[600px] -translate-x-1/2 -translate-y-1/2 flex-row gap-0"
      onSubmit={onSubmit}
    >
      <Select
        radius="sm"
        selectedKeys={[condition]}
        onChange={(e) => setCondition(e.target.value as SearchFieldKey)}
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
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
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
