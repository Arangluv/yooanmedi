import type { CheckboxFieldServerComponent } from 'payload';
import CustomCheckboxFieldToggleField from './CustomCheckboxFieldToggleField';
import { clsx } from 'clsx';

const CustomCheckboxField: CheckboxFieldServerComponent = ({ clientField, path, field }) => {
  const { label, admin: { description = '' } = {} } = clientField;
  const isRequireMargin = field.admin?.custom?.isRequireMargin ?? false;
  const isFirstContent = field.admin?.custom?.isFirstContent ?? false;

  return (
    <div className={clsx('flex w-full flex-col', isFirstContent ? 'mt-12' : '')}>
      <div className={clsx('flex w-full max-w-1/2 items-center justify-between')}>
        <div className="flex flex-col gap-2">
          <span className="text-xl font-bold">{(label as string) || '라벨 없음'}</span>
          <span className="text-base leading-relaxed whitespace-pre-line text-neutral-500 dark:text-neutral-500">
            {(description as string) || '설명 없음'}
          </span>
        </div>
        <CustomCheckboxFieldToggleField path={path} />
      </div>
      {isRequireMargin && <div className="my-4" />}
    </div>
  );
};

export default CustomCheckboxField;
