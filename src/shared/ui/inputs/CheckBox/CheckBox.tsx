import React, { useId } from 'react';
import { Checkbox as CheckboxPrimitive } from 'radix-ui';
import { FieldGroupWrapper } from '@/shared/ui/inputs';
import {
  Checkbox as ShadcnCheckBox,
  Field as ShadcnField,
  FieldContent as ShadcnFieldContent,
  FieldLabel as ShadcnFieldLabel,
  FieldDescription as ShadcnFieldDescription,
  FieldError as ShadcnFieldError,
} from '@/shared/ui/shadcn';
import { ControlledProps } from '@/shared/types';
import { Controller, FieldValues } from 'react-hook-form';

type InternalCheckBoxProps = React.ComponentProps<typeof CheckboxPrimitive.Root> & {
  isRequired?: boolean;
  fieldError?: React.ComponentProps<'div'> & { errors?: Array<{ message?: string }> | undefined };
  label: {
    content: React.ReactNode;
    props?: Omit<React.ComponentProps<typeof ShadcnFieldLabel>, 'children'>;
  };
  description?: {
    content: React.ReactNode;
    props?: Omit<React.ComponentProps<typeof ShadcnFieldDescription>, 'children'>;
  };
};

export type CheckBoxProps<Form extends FieldValues> = ControlledProps<Form> & InternalCheckBoxProps;

export const CheckBox = <Form extends FieldValues>(props: CheckBoxProps<Form>) => {
  const {
    id,
    name,
    control,
    isRequired = false,
    fieldError,
    className,
    label,
    description,
    ...restProps
  } = props;
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange } }) => (
        <FieldGroupWrapper className="flex-row">
          <ShadcnField orientation={'horizontal'}>
            <ShadcnCheckBox id={inputId} onCheckedChange={onChange} {...restProps} />
            <ShadcnFieldContent>
              <ShadcnFieldLabel htmlFor={inputId} {...label.props}>
                {label.content}
                {isRequired && <span className="text-destructive">*</span>}
              </ShadcnFieldLabel>
              {description && (
                <ShadcnFieldDescription {...description.props}>
                  {description.content}
                </ShadcnFieldDescription>
              )}
            </ShadcnFieldContent>
            <ShadcnFieldError {...fieldError} />
          </ShadcnField>
        </FieldGroupWrapper>
      )}
    />
  );
};
