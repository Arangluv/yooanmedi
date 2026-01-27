'use client';

import * as React from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import { Label as LabelPrimitive } from 'radix-ui';
import { cn } from '@/lib/utils';

function Label({ className, ...props }: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        'flex cursor-pointer items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
}

function Switch({
  className,
  size = 'default',
  checked,
  onCheckedChange,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: 'sm' | 'default';
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      checked={checked}
      onCheckedChange={onCheckedChange}
      className={cn(
        'peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input cursor-pointer',
        'focus-visible:border-ring focus-visible:ring-ring/50',
        'dark:data-[state=unchecked]:bg-input/80',
        'group/switch inline-flex shrink-0 items-center rounded-full border border-transparent shadow-xs',
        'transition-all outline-none focus-visible:ring-[3px]',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'data-[size=default]:h-[1.15rem] data-[size=default]:w-8',
        'data-[size=sm]:h-3.5 data-[size=sm]:w-6',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          'bg-background',
          'dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-foreground cursor-pointer',
          'pointer-events-none block rounded-full ring-0 transition-transform',
          'group-data-[size=default]/switch:size-6 group-data-[size=sm]/switch:size-3',
          'data-[state=checked]:translate-x-[calc(100%+4px)] data-[state=unchecked]:translate-x-0',
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Label, Switch };
