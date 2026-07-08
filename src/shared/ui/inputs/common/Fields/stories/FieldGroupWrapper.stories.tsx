import { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Input, FieldGroupWrapper } from '@/shared/ui/inputs';

const meta: Meta<typeof FieldGroupWrapper> = {
  title: 'shared/ui/inputs/common/FieldGroupWrapper',
  component: FieldGroupWrapper,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof FieldGroupWrapper>;

export const Default: Story = {
  render: () => {
    return (
      <FieldGroupWrapper>
        <Input label={{ content: 'Input1' }}></Input>
        <Input label={{ content: 'Input2' }}></Input>
      </FieldGroupWrapper>
    );
  },
};

export const Horizontal: Story = {
  render: () => {
    return (
      <FieldGroupWrapper className="flex-row">
        <Input label={{ content: 'Input1' }}></Input>
        <Input label={{ content: 'Input2' }}></Input>
      </FieldGroupWrapper>
    );
  },
};
