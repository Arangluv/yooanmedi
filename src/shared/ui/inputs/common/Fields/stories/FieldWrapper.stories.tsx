import { Meta, StoryObj } from '@storybook/nextjs-vite';
import { FieldWrapper } from '@/shared/ui/inputs';
import { Input } from '@/shared/ui/shadcn';

const meta: Meta<typeof FieldWrapper> = {
  title: 'shared/ui/inputs/common/FieldWrapper',
  component: FieldWrapper,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof FieldWrapper>;

const COMMON_PROPS: Story['args'] = {
  children: <Input />,
  label: { text: '라벨텍스트' },
};

export const Default: Story = {
  args: {
    ...COMMON_PROPS,
  },
};

export const WithRequired: Story = {
  args: {
    ...COMMON_PROPS,
    isRequired: true,
  },
};

export const WithDescription: Story = {
  args: {
    ...COMMON_PROPS,
    description: {
      text: '필드 설명 테스트',
    },
  },
};

export const WithErros: Story = {
  args: {
    ...COMMON_PROPS,
    fieldError: {
      errors: [{ message: '필드에러 메세지' }],
    },
  },
};

const VARIANTS = ['vertical', 'horizontal', 'responsive'] as const;

export const AllVariants: Story = {
  render: () => {
    return (
      <div className="flex flex-col gap-4">
        {VARIANTS.map((orientation) => (
          <FieldWrapper inputId="id" field={{ orientation }} label={{ text: orientation }}>
            <Input />
          </FieldWrapper>
        ))}
      </div>
    );
  },
};
