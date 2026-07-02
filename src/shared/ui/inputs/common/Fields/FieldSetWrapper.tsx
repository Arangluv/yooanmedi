import React from 'react';
import { FieldSet, FieldLegend, FieldDescription } from '@/shared/ui/shadcn';

export type FieldSetProps = React.ComponentProps<'fieldset'> & {
  label: React.ComponentProps<'legend'> & { variant?: 'legend' | 'label'; text: string };
  description?: React.ComponentProps<'p'> & { text: string };
  children: React.ReactNode;
};

export const FieldSetWrapper = (props: FieldSetProps) => {
  const { label, description, children, ...restProps } = props;
  const { text: labelText, ...labelRestProps } = label;

  return (
    <FieldSet {...restProps}>
      <FieldLegend {...labelRestProps}>{labelText}</FieldLegend>
      {description && <FieldDescription {...description}>{description.text}</FieldDescription>}
      {children}
    </FieldSet>
  );
};
