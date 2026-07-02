import { ReactNode } from 'react';
import { VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/core';
import { buttonVariants, Button as ShadcnButton } from '@shared/ui/shadcn';
import { LoadingSpinner } from '../../displays/LoadingSpinner';

export type ButtonVariant = VariantProps<typeof buttonVariants>;

export type ButtonProps = React.ComponentProps<'button'> & {
  asChild?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  isLoading?: boolean;
} & ButtonVariant;

export const Button = (props: ButtonProps) => {
  const { children, startIcon, endIcon, disabled, isLoading, className, ...restProps } = props;

  return (
    <ShadcnButton
      disabled={isLoading || disabled}
      {...restProps}
      className={cn(className, 'cursor-pointer')}
    >
      {isLoading && <LoadingSpinner />}
      {!isLoading && startIcon && <span>{startIcon}</span>}
      {children}
      {endIcon && <span>{endIcon}</span>}
    </ShadcnButton>
  );
};
