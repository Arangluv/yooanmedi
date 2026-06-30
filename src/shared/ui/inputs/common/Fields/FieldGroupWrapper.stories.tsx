import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { FieldSetWrapper, FieldWrapper, FieldGroupWrapper, FieldSeparator } from './index';
import { Input } from '../../Input';

const meta: Meta<typeof FieldGroupWrapper> = {
  title: 'shared/ui/common/FieldGroupWrapper',
  component: FieldGroupWrapper,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof FieldGroupWrapper>;

export const Default: Story = {
  render: () => {
    return (
      <FieldGroupWrapper>
        <FieldSetWrapper title={'결제정보'} description="모든 결제정보는 안전하게 보관됩니다">
          <FieldGroupWrapper className="flex flex-row">
            <FieldWrapper label={'카드번호'}>
              <Input />
            </FieldWrapper>
            <FieldWrapper label={'카드명'}>
              <Input />
            </FieldWrapper>
          </FieldGroupWrapper>
          <FieldWrapper label={'소유자이름'} description="영문 대문자를 적어주세요">
            <Input />
          </FieldWrapper>
        </FieldSetWrapper>
        <FieldSeparator />
        <FieldSetWrapper title={'유저정보'} description="유저정보를 입력합니다">
          <FieldWrapper label={'상호명'}>
            <Input placeholder="상호명을 입력해주세요" />
          </FieldWrapper>
          <FieldWrapper label={'기관번호'} description="10자리 기관번호를 입력해주세요">
            <Input />
          </FieldWrapper>
        </FieldSetWrapper>
      </FieldGroupWrapper>
    );
  },
};
