import { FieldGroup } from '@/shared/ui/shadcn';

export type FieldGroupWrapperProps = React.ComponentProps<'div'>;

export const FieldGroupWrapper = ({ children, ...restProps }: FieldGroupWrapperProps) => {
  return <FieldGroup {...restProps}>{children}</FieldGroup>;
};
