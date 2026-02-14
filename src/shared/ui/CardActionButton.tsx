'use client';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/shadcn/tooltip';
import { cn } from '../lib/utils';

const CardActionButton = ({
  id,
  icon,
  description,
  onClick,
  className,
  isLoading,
}: {
  id?: string;
  icon: React.ReactNode;
  description: string;
  onClick: () => void;
  className?: string;
  isLoading?: boolean;
}) => {
  return (
    <Tooltip>
      <TooltipTrigger onClick={onClick} disabled={isLoading}>
        <div
          id={id}
          className={cn(
            'flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-black/20 transition-all duration-300',
            className,
          )}
        >
          {icon}
        </div>
      </TooltipTrigger>
      <TooltipContent>{description}</TooltipContent>
    </Tooltip>
  );
};

export default CardActionButton;
