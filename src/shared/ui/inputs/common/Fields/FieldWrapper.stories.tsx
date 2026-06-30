import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { FieldWrapper } from './index';
import { Input } from '../../Input';

const meta: Meta<typeof FieldWrapper> = {
  title: 'shared/ui/common/FieldWrapper',
  component: FieldWrapper,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof FieldWrapper>;

export const Default: Story = {
  render: () => {
    return (
      <FieldWrapper label={'상호명'} description="사용하시고 싶은 상호명을 적어주세요">
        <Input placeholder="상호명을 입력해주세요" />
      </FieldWrapper>
    );
  },
};
