import React from 'react';
import { FieldSet, FieldLegend, FieldDescription } from '@/shared/ui/shadcn';

export type FieldSetProps = React.ComponentProps<'fieldset'> & {
  label: {
    content: React.ReactNode;
    props?: React.ComponentProps<'legend'> & { variant?: 'legend' | 'label'; text: string };
  };
  description?: {
    content: React.ReactNode;
    props?: React.ComponentProps<'p'>;
  };
  children: React.ReactNode;
};

export const FieldSetWrapper = (props: FieldSetProps) => {
  const {
    label: { content: labelContent, props: labelProps },
    description,
    children,
    ...restProps
  } = props;

  return (
    <FieldSet {...restProps}>
      <FieldLegend {...labelProps}>{labelContent}</FieldLegend>
      {description && (
        <FieldDescription {...description.props}>{description.content}</FieldDescription>
      )}
      {children}
    </FieldSet>
  );
};
