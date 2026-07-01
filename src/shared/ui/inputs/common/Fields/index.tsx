import { VariantProps } from 'class-variance-authority';
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSeparator as ShadcnFieldSeparator,
  FieldSet,
  fieldVariants,
} from '../../../shadcn/field';

type FieldGroupProps = React.ComponentProps<'div'>;

export const FieldGroupWrapper = ({ className, children, ...restProps }: FieldGroupProps) => {
  return <FieldGroup className={className}>{children}</FieldGroup>;
};

type FieldSetProps = React.ComponentProps<'fieldset'> & { title: string; description?: string };

export const FieldSetWrapper = ({
  className,
  title,
  description,
  children,
  ...restProps
}: FieldSetProps) => {
  return (
    <FieldSet className={className} {...restProps}>
      <FieldLegend>{title}</FieldLegend>
      {description && <FieldDescription>{description}</FieldDescription>}
      {children}
    </FieldSet>
  );
};

export type FieldWrapperProps = React.ComponentProps<'div'> & {
  label: string;
  inputId: string;
  description?: string;
  isRequired?: boolean;
  error: any;
} & VariantProps<typeof fieldVariants>;

export const FieldWrapper = ({
  label,
  inputId,
  description,
  children,
  error,
  isRequired = false,
  ...restProps
}: FieldWrapperProps) => {
  return (
    <Field {...restProps}>
      <FieldLabel aria-required={isRequired} htmlFor={inputId}>
        {label}
        {isRequired && <span className="text-destructive">*</span>}
      </FieldLabel>
      {children}
      {description && <FieldDescription>{description}</FieldDescription>}
      <FieldError errors={[error]} />
    </Field>
  );
};

type FieldSeparatorProps = React.ComponentProps<'div'> & {
  children?: React.ReactNode;
};

export const FieldSeparator = (props: FieldSeparatorProps) => {
  return <ShadcnFieldSeparator {...props} />;
};
