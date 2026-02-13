'use client';

import { useRouter } from 'next/navigation';
import { ScrollText } from 'lucide-react';

import TextWithIconAlignVertical from '@/shared/ui/TextWithIconAlignVertical';

const OrderLink = () => {
  const router = useRouter();

  return (
    <TextWithIconAlignVertical
      text="주문내역"
      icon={<ScrollText className="size-6" strokeWidth={1.5} />}
      onClick={() => router.push('/order/list')}
    />
  );
};

export default OrderLink;
