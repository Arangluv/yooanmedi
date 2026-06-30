import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Input } from './index';
import { Search } from 'lucide-react';

const meta: Meta<typeof Input> = {
  title: 'shared/ui/inputs/Input',
  component: Input,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Input>;

const COMMON_PROPS: Story['args'] = {
  type: 'text',
  placeholder: '입력해주세요',
};

export const Default: Story = {
  args: {
    ...COMMON_PROPS,
  },
};

export const Password: Story = {
  args: {
    ...COMMON_PROPS,
    type: 'password',
  },
};

export const WithDisabled: Story = {
  args: {
    ...COMMON_PROPS,
    disabled: true,
  },
};

export const WithInlineStartContent: Story = {
  args: {
    ...COMMON_PROPS,
    groupContents: {
      inlineStart: <Search />,
    },
  },
};

export const WithInlineEndContent: Story = {
  args: {
    ...COMMON_PROPS,
    groupContents: {
      inlineEnd: <Search />,
    },
  },
};

export const WithBlockStartContent: Story = {
  args: {
    ...COMMON_PROPS,
    groupContents: {
      blockStart: (
        <div className="flex items-center gap-2">
          <Search className="text-foreground/30 size-4" />
          <span className="text-foreground/30 text-sm">result</span>
        </div>
      ),
    },
  },
};

export const WithBlockEndContent: Story = {
  args: {
    ...COMMON_PROPS,
    groupContents: {
      blockEnd: (
        <div className="flex items-center gap-2">
          <span className="text-foreground/30 text-sm">0 / 200</span>
        </div>
      ),
    },
  },
};
