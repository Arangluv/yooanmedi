import React from 'react';
import { FieldSeparator as ShadcnFieldSeparator } from '@/shared/ui/shadcn';

export type FieldSeparatorProps = React.ComponentProps<'div'>;

export const FieldSeparator = (props: FieldSeparatorProps) => {
  return <ShadcnFieldSeparator {...props} />;
};
