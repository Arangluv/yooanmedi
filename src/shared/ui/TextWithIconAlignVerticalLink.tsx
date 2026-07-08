// todo :: refactor
import Link from 'next/link';

export const TextWithIconAlignVerticalLink = ({
  text,
  icon,
  href,
}: {
  text: string;
  icon: React.ReactNode;
  href: string;
}) => {
  return (
    <Link
      href={href}
      prefetch={false}
      className="hover:bg-muted flex cursor-pointer flex-col items-center gap-1 rounded-lg p-1"
    >
      <span className="text-foreground/90">{icon}</span>
      <span className="text-foreground/90 text-[13px]">{text}</span>
    </Link>
  );
};
