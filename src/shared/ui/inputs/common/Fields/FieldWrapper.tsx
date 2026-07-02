import React from 'react';
import { type VariantProps } from 'class-variance-authority';
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  fieldVariants,
  Label,
} from '@/shared/ui/shadcn';

export interface FieldWrapperProps {
  field?: React.ComponentProps<'div'> & VariantProps<typeof fieldVariants>;
  label: React.ComponentProps<typeof Label> & {
    text: string;
  };
  description?: React.ComponentProps<'p'> & { text: string };
  fieldError?: React.ComponentProps<'div'> & { errors?: Array<{ message?: string }> | undefined };
  isRequired?: boolean;
  inputId: string;
  children: React.ReactNode;
}

export const FieldWrapper = (props: FieldWrapperProps) => {
  const { field, label, description, fieldError, inputId, isRequired, children } = props;

  const { text: labelText } = label;

  return (
    <Field {...field}>
      <FieldLabel aria-required={isRequired} htmlFor={inputId}>
        {labelText}
        {isRequired && <span className="text-destructive">*</span>}
      </FieldLabel>
      {children}
      {description && <FieldDescription {...description}>{description.text}</FieldDescription>}
      <FieldError {...fieldError} />
    </Field>
  );
};
