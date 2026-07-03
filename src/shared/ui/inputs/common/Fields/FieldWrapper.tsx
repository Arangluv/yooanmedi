import React from 'react';
import { type VariantProps } from 'class-variance-authority';
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError as ShadcnFieldError,
  fieldVariants,
  Label,
} from '@/shared/ui/shadcn';

export interface FieldWrapperProps {
  label: {
    content: React.ReactNode;
    props?: React.ComponentProps<typeof Label>;
  };
  description?: {
    content: React.ReactNode;
    props?: React.ComponentProps<'p'>;
  };
  field?: React.ComponentProps<'div'> & VariantProps<typeof fieldVariants>;
  fieldError?: React.ComponentProps<'div'> & { errors?: Array<{ message?: string }> | undefined };
  isRequired?: boolean;
  inputId: string;
  children: React.ReactNode;
}

export const FieldWrapper = (props: FieldWrapperProps) => {
  const {
    field,
    label: { content: labelContent, props: labelProps },
    description,
    fieldError,
    inputId,
    isRequired,
    children,
  } = props;

  return (
    <Field {...field}>
      <FieldLabel aria-required={isRequired} htmlFor={inputId} {...labelProps}>
        {labelContent}
        {isRequired && <span className="text-destructive">*</span>}
      </FieldLabel>
      {children}
      {description && (
        <FieldDescription {...description.props}>{description.content}</FieldDescription>
      )}
      <ShadcnFieldError {...fieldError} />
    </Field>
  );
};
