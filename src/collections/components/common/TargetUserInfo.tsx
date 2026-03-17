'use client';

import useUserInfo from '@/app/(payload)/context/useUserInfo';

const TargetUserInfo = () => {
  const user = useUserInfo((state) => state.user);
  const { hosipital_name, ceo_name, email } = user;

  return (
    <div className="bg-card border-border flex h-[110px] w-full shrink-0 flex-col justify-center gap-4 rounded-md border p-4">
      <span className="text-lg font-bold">고객 정보</span>
      <div className="flex items-center justify-between">
        <TargetCard title="상호명" value={hosipital_name} />
        <TargetCard title="대표자명" value={ceo_name} />
        <TargetCard title="이메일" value={email} />
      </div>
    </div>
  );
};

const TargetCard = ({ title, value }: { title: string; value: string }) => {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-muted-foreground">{title}</span>
      <span className="text-foreground font-medium">{value}</span>
    </div>
  );
};

export default TargetUserInfo;
