import { FC } from 'react';
import Link from 'next/link';
import { ScrollText, User } from 'lucide-react';
import { BrandLogo } from '@/shared';
import { TextWithIconAlignVerticalLink } from '@/shared/ui';
import { CartDetailModalOpenTextButton } from '@/features/cart-detail';

export const LoginHeader: FC = () => {
  return (
    <header className="border-foreground-200 flex w-full items-center justify-center border-b-1 py-6">
      <div className="flex w-5xl items-center justify-between">
        <Link href="/order" prefetch={false}>
          <BrandLogo width={140} height={40} className="h-[40px] w-[140px]" />
        </Link>
        <div className="flex gap-2">
          <CartDetailModalOpenTextButton />
          <TextWithIconAlignVerticalLink
            text="주문내역"
            icon={<ScrollText className="size-6" strokeWidth={1.5} />}
            href={'/order/list'}
          />
          <TextWithIconAlignVerticalLink
            text="마이페이지"
            icon={<User className="size-6" strokeWidth={1.5} />}
            href={'/mypage/info'}
          />
        </div>
      </div>
    </header>
  );
};
