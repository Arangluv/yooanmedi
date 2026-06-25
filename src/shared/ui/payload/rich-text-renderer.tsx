import clsx from 'clsx';
import { RichText } from '@payloadcms/richtext-lexical/react';
import { Term } from '../../types';

export const PayloadRichTextRenderer = ({ content }: { content: Term['content'] }) => {
  if (!content) {
    return null;
  }

  return (
    <RichText
      data={content}
      className={clsx(
        'flex h-full w-full flex-col gap-1',
        '[&>h1]:text-4xl [&>h1]:font-bold [&>h2]:text-2xl [&>h2]:font-bold md:[&>h2]:text-3xl lg:[&>h2]:text-3xl [&>h3]:text-xl [&>h3]:font-bold md:[&>h3]:text-2xl lg:[&>h3]:text-2xl [&>h4]:text-xl [&>h4]:font-bold',
        '[&>p]:my-[2px] [&>p]:text-[14px] [&>p]:leading-relaxed',
        '[&>ol]:flex [&>ol]:list-decimal [&>ol]:flex-col [&>ol]:gap-2 [&>ol]:pl-8',
        '[&>ul]:flex [&>ul]:list-disc [&>ul]:flex-col [&>ul]:gap-2 [&>ul]:pl-8',
        '[&>hr]:bg-foreground-600 block [&>hr]:my-3',
        '[&>p>a]:text-blue-400 [&>p>a]:underline [&>p>a]:hover:text-blue-500',
        '[&_table]:border- [&_table]:my-8 [&_table]:w-full [&_table]:border-collapse [&_table]:!border-none',
        '[&_table_td]:text-foreground-600 [&_table_td]:!border-none [&_table_td]:p-2',
        '[&_table_th]:text-brand [&_table_th]:!border-none [&_table_th]:p-2 [&_table_th]:text-start [&_table_th]:font-bold',
        '[&_table_tr]:!border-b [&_table_tr]:!py-4',
      )}
    />
  );
};
