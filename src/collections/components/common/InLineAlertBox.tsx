import { cn } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';
import { CircleAlertIcon, CircleCheckIcon } from 'lucide-react';
import React from 'react';

const alertVariants = cva('flex w-full text-sm items-center gap-2 rounded-md px-4 py-2', {
  variants: {
    variant: {
      success: 'bg-green-50 text-green-500',
      error: 'bg-red-50 text-red-500',
    },
  },
});

const variantIconMapper = {
  success: <CircleCheckIcon className="h-4 w-4" />,
  error: <CircleAlertIcon className="h-4 w-4" />,
};

export default function InLineAlertBox({
  className,
  message,
  variant,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof alertVariants> & { message: string }) {
  return (
    <div className={cn(alertVariants({ variant }), className)} {...props}>
      {variantIconMapper[variant as keyof typeof variantIconMapper]}
      {message}
    </div>
  );
}
