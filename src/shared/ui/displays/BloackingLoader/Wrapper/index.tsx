import { FC, HTMLProps } from 'react';

type Props = HTMLProps<HTMLDivElement> & {
  isLoading: boolean;
};

export const Wrapper: FC<Props> = (props) => {
  const { children, isLoading, ...restProps } = props;

  if (!isLoading) {
    return null;
  }

  return (
    <div
      className="border-red bg-foreground/15 fixed inset-0 z-999 flex h-full w-full items-center justify-center border-2"
      {...restProps}
    >
      {children}
    </div>
  );
};
