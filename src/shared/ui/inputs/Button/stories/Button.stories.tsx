import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Search } from 'lucide-react';
import { Button } from '../index';

const meta: Meta<typeof Button> = {
  title: 'shared/ui/inputs/Button',
  component: Button,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Button>;

const text = '버튼 텍스트';

const COMMON_PROPS: Story['args'] = {
  children: text,
};

const VARIANTS = ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'] as const;
const TEXT_BUTTON_SIZES = ['xs', 'sm', 'default', 'lg'] as const;
const ICON_BUTTON_SIZES = ['icon-xs', 'icon', 'icon-lg'] as const;

export const AllVariants: Story = {
  render: () => {
    return (
      <div className="flex w-[100px] gap-4">
        {VARIANTS.map((variant) => (
          <Button variant={variant}>{variant}</Button>
        ))}
      </div>
    );
  },
};

export const SizesWithText: Story = {
  render: () => {
    return (
      <div className="flex w-[100px] gap-4">
        {TEXT_BUTTON_SIZES.map((size) => (
          <Button size={size}>{size}</Button>
        ))}
      </div>
    );
  },
};

export const SizesWithIcon: Story = {
  render: () => {
    return (
      <div className="flex w-[100px] gap-4">
        {ICON_BUTTON_SIZES.map((size) => (
          <Button size={size}>
            <Search />
          </Button>
        ))}
      </div>
    );
  },
};

export const WithLoading: Story = {
  args: {
    ...COMMON_PROPS,
    variant: 'default',
    isLoading: true,
  },
};

export const WithDisable: Story = {
  args: {
    ...COMMON_PROPS,
    variant: 'default',
    disabled: true,
  },
};

export const WithStartIcon: Story = {
  args: {
    ...COMMON_PROPS,
    variant: 'default',
    startIcon: <Search />,
  },
};

export const WithEndIcon: Story = {
  args: {
    ...COMMON_PROPS,
    variant: 'default',
    endIcon: <Search />,
  },
};

export const WithStartAndEndIcon: Story = {
  args: {
    ...COMMON_PROPS,
    variant: 'default',
    startIcon: <Search />,
    endIcon: <Search />,
  },
};
