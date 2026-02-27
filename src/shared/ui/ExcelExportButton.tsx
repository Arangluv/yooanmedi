'use client';

import { cn } from '../lib/utils';
import { Button } from '@/shared/ui/shadcn/button';

const ExcelExportButton = ({ onClick, className }: { onClick: () => void; className?: string }) => {
  return (
    <Button
      className="cursor-pointer bg-[#257449] text-white hover:bg-[#257449]/80"
      onClick={onClick}
    >
      엑셀 다운로드
    </Button>
  );
};

export default ExcelExportButton;
