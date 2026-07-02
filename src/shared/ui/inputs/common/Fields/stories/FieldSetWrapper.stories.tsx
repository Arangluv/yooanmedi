import { Meta, StoryObj } from '@storybook/nextjs-vite';
import { FieldSetWrapper, Input, FieldGroupWrapper, FieldSeparator } from '@/shared/ui/inputs';

const meta: Meta<typeof FieldSetWrapper> = {
  title: 'shared/ui/inputs/common/FieldSetWrapper',
  component: FieldSetWrapper,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof FieldSetWrapper>;

export const Default: Story = {
  render: () => {
    return (
      <FieldSetWrapper label={{ text: '필드셋 라벨' }} description={{ text: '필드셋 설명 텍스트' }}>
        <FieldGroupWrapper>
          <Input label={{ text: 'Input1' }} />
          <Input label={{ text: 'Input2' }} />
          <Input label={{ text: 'Input3' }} />
        </FieldGroupWrapper>
      </FieldSetWrapper>
    );
  },
};

export const NoDescription: Story = {
  render: () => {
    return (
      <FieldSetWrapper label={{ text: '필드셋 라벨' }}>
        <FieldGroupWrapper>
          <Input label={{ text: 'Input1' }} />
          <Input label={{ text: 'Input2' }} />
          <Input label={{ text: 'Input3' }} />
        </FieldGroupWrapper>
      </FieldSetWrapper>
    );
  },
};

export const WithSeparator: Story = {
  render: () => {
    return (
      <FieldSetWrapper label={{ text: '필드셋 라벨' }} description={{ text: '필드셋 설명 텍스트' }}>
        <FieldGroupWrapper>
          <Input label={{ text: 'Input1' }} />
          <Input label={{ text: 'Input2' }} />
          <Input label={{ text: 'Input3' }} />
        </FieldGroupWrapper>
        <FieldSeparator />
        <FieldGroupWrapper>
          <Input label={{ text: 'Input1' }} />
          <Input label={{ text: 'Input2' }} />
          <Input label={{ text: 'Input3' }} />
        </FieldGroupWrapper>
      </FieldSetWrapper>
    );
  },
};
