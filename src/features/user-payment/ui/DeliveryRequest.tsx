'use client';

import { Textarea } from '@heroui/react';

interface DeliveryRequestProps {
  userRequest: string;
  setUserRequest: (request: string) => void;
}

const DeliveryRequest = ({ userRequest, setUserRequest }: DeliveryRequestProps) => {
  return (
    <div className="flex w-full flex-col gap-2">
      <span className="text-xl font-bold">배송 요청 사항</span>
      <Textarea
        placeholder="배송 및 기타 요청 사항이 있으면 입력해주세요."
        radius="sm"
        variant="bordered"
        rows={8}
        value={userRequest}
        onChange={(e) => setUserRequest(e.target.value)}
        classNames={{ inputWrapper: 'border-1 border-foreground-200' }}
      />
    </div>
  );
};

export default DeliveryRequest;
