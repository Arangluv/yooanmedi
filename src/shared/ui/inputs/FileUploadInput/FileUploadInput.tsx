import React, { useId } from 'react';
import { Upload as UploadIcon } from 'lucide-react';
import {
  Field as ShadcnField,
  FieldLabel as ShadcnFieldLabel,
  FieldDescription as ShadcnFieldDescription,
  FieldError as ShadcnFieldError,
} from '@/shared/ui/shadcn';
import { UploadedFileItem } from './UploadedFileItem';

export type FileUploadInputProps = {
  isRequired: boolean;
  onChange: (value: File | null) => void;
  value: File | null | undefined;
  disabled: boolean;
  fieldError?: React.ComponentProps<'div'> & { errors?: Array<{ message?: string }> | undefined };
  fieldLabel: {
    content: string;
    props?: Omit<React.ComponentProps<typeof ShadcnFieldLabel>, 'children'>;
  };
  description?: {
    content: string;
    props?: Omit<React.ComponentProps<typeof ShadcnFieldDescription>, 'children'>;
  };
};

export const FileUploadInput = (props: FileUploadInputProps) => {
  const {
    value,
    onChange,
    isRequired = false,
    disabled,
    fieldError,
    fieldLabel,
    description,
  } = props;
  const inputId = useId();

  const onDelete = () => {
    onChange?.(null);
  };

  return (
    <ShadcnField>
      <ShadcnFieldLabel {...fieldLabel.props} htmlFor={inputId}>
        {fieldLabel.content}
        {isRequired && <span className="text-destructive">*</span>}
      </ShadcnFieldLabel>
      {description && (
        <ShadcnFieldDescription {...description.props}>
          {description.content}
        </ShadcnFieldDescription>
      )}
      <ShadcnFieldError {...fieldError} />
      <ShadcnFieldLabel
        {...fieldLabel.props}
        htmlFor={inputId}
        className="text-muted-foreground hover:bg-muted flex h-[160px] cursor-pointer items-center justify-center rounded-md border-1 border-dotted"
      >
        <UploadIcon className="size-4" />
        <span>파일 업로드</span>
      </ShadcnFieldLabel>
      <input
        id={inputId}
        type="file"
        className="hidden"
        disabled={disabled}
        onChange={(e) => {
          const file = e.target.files?.[0];
          onChange?.(file!);
          e.target.value = ''; // 같은 파일 재선택 가능하도록 value 초기화
        }}
      />
      {value && <UploadedFileItem file={value} onChange={onDelete} />}
    </ShadcnField>
  );
};
