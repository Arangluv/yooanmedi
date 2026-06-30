import { ForwardedRef, ReactNode } from 'react';
import { VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/core';
import { buttonVariants, Button as ShadcnButton } from './shadcn.button';
import { LoadingSpinner } from '../../displays/LoadingSpinner';

export type ButtonVariant = VariantProps<typeof buttonVariants>;

type InternalButtonProps = React.ComponentProps<'button'> & {
  asChild?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  isLoading?: boolean;
} & ButtonVariant;

export type ButtonProps = InternalButtonProps & { ref?: ForwardedRef<HTMLButtonElement> };

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
