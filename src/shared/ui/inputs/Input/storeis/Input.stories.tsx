import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Input } from '../index';
import { Search } from 'lucide-react';

const meta: Meta<typeof Input> = {
  title: 'shared/ui/inputs/Input',
  component: Input,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Input>;

const COMMON_PROPS: Story['args'] = {
  label: { content: '라벨텍스트' },
};

export const Default: Story = {
  args: {
    ...COMMON_PROPS,
  },
};

export const WithDescription: Story = {
  args: {
    ...COMMON_PROPS,
    description: {
      content: 'input 설명',
    },
  },
};

export const WithDisabled: Story = {
  args: {
    ...COMMON_PROPS,
    disabled: true,
    value: 'input value',
  },
};

export const WithReadOnly: Story = {
  args: {
    ...COMMON_PROPS,
    readOnly: true,
    value: 'input value',
  },
};

export const WithInlineStartIcon: Story = {
  args: {
    ...COMMON_PROPS,
    value: 'input value',
    groupContents: {
      inlineStart: <Search />,
    },
  },
};

export const WithInlineEndIcon: Story = {
  args: {
    ...COMMON_PROPS,
    value: 'input value',
    groupContents: {
      inlineEnd: <Search />,
    },
  },
};

export const WithBlockStart: Story = {
  args: {
    ...COMMON_PROPS,
    value: 'input value',
    groupContents: {
      blockStart: (
        <div className="flex items-center gap-2">
          <Search className="size-4" />
          <span>검색하기</span>
        </div>
      ),
    },
  },
};

export const WithBlockEnd: Story = {
  args: {
    ...COMMON_PROPS,
    value: 'input value',
    groupContents: {
      blockEnd: (
        <div className="flex items-center gap-2">
          <span>0 / 120</span>
        </div>
      ),
    },
  },
};
