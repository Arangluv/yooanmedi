'use client';

import { cn } from '../lib/utils';

const ExcelExportButton = ({ onClick, className }: { onClick: () => void; className?: string }) => {
  return (
    <button
      className={cn(
        'cursor-pointer rounded-sm bg-[#257449] p-2 text-sm text-white hover:bg-[#257449]/80',
        className,
      )}
      onClick={onClick}
    >
      엑셀 다운로드
    </button>
  );
};

export default ExcelExportButton;
