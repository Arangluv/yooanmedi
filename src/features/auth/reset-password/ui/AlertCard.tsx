import { Info } from 'lucide-react';

export const ResetPasswordAlertCard = () => {
  return (
    <div className="bg-muted mb-4 flex w-full items-center gap-4 rounded-md p-4">
      <Info className="text-foreground-500 h-5 w-5" />
      <div className="flex flex-col gap-1">
        <span className="text-foreground-500 text-sm">
          비밀번호는 암호화되어 저장되기 때문에 재설정만 가능합니다
        </span>
      </div>
    </div>
  );
};
