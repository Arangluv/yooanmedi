import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { FieldSetWrapper, FieldWrapper, FieldGroupWrapper, FieldSeparator } from './index';
import { Input } from '../../Input';

const meta: Meta<typeof FieldSetWrapper> = {
  title: 'shared/ui/common/FieldSetWrapper',
  component: FieldSetWrapper,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof FieldSetWrapper>;

export const Default: Story = {
  render: () => {
    return (
      <FieldSetWrapper title={'유저정보'} description="유저정보를 입력합니다">
        <FieldWrapper label={'상호명'} description="사용하시고 싶은 상호명을 적어주세요">
          <Input placeholder="상호명을 입력해주세요" />
        </FieldWrapper>
        <FieldWrapper label={'상호명'} description="사용하시고 싶은 상호명을 적어주세요">
          <Input placeholder="상호명을 입력해주세요" />
        </FieldWrapper>
        <FieldWrapper label={'상호명'} description="사용하시고 싶은 상호명을 적어주세요">
          <Input placeholder="상호명을 입력해주세요" />
        </FieldWrapper>
      </FieldSetWrapper>
    );
  },
};

export const WithGroup: Story = {
  render: () => {
    return (
      <FieldSetWrapper title={'유저정보'} description="유저정보를 입력합니다">
        <FieldGroupWrapper className="flex flex-row">
          <FieldWrapper
            isRequired={true}
            label={'상호명'}
            description="사용하시고 싶은 상호명을 적어주세요"
          >
            <Input placeholder="상호명을 입력해주세요" />
          </FieldWrapper>
          <FieldWrapper label={'상호명'} description="사용하시고 싶은 상호명을 적어주세요">
            <Input placeholder="상호명을 입력해주세요" />
          </FieldWrapper>
        </FieldGroupWrapper>
        <FieldSeparator />
        <FieldWrapper label={'상호명'} description="사용하시고 싶은 상호명을 적어주세요">
          <Input placeholder="상호명을 입력해주세요" />
        </FieldWrapper>
      </FieldSetWrapper>
    );
  },
};
