'use client'

import { RichText } from '@payloadcms/richtext-lexical/react'
import clsx from 'clsx'

export function ContentRenderer({ content }: { content: any }) {
  return (
    <RichText
      data={content}
      className={clsx(
        'w-full h-full flex flex-col gap-1',
        '[&>h1]:text-4xl [&>h1]:font-bold [&>h2]:text-2xl md:[&>h2]:text-3xl lg:[&>h2]:text-3xl [&>h2]:font-bold [&>h3]:text-xl md:[&>h3]:text-2xl lg:[&>h3]:text-2xl [&>h3]:font-bold [&>h4]:text-xl [&>h4]:font-bold',
        '[&>p]:leading-relaxed [&>p]:my-[2px] [&>p]:text-[14px]',
        '[&>ol]:list-decimal [&>ol]:pl-8 [&>ol]:flex [&>ol]:flex-col [&>ol]:gap-2',
        '[&>ul]:list-disc [&>ul]:pl-8 [&>ul]:flex [&>ul]:flex-col [&>ul]:gap-2',
        '[&>hr]:my-3 [&>hr]:bg-foreground-600 block',
        '[&>p>a]:text-blue-400 [&>p>a]:underline [&>p>a]:hover:text-blue-500',
        '[&_table]:my-8 [&_table]:w-full [&_table]:border-collapse [&_table]:!border-none [&_table]:border-',
        '[&_table_td]:!border-none [&_table_td]:p-2 [&_table_td]:text-foreground-600',
        '[&_table_th]:!border-none [&_table_th]:text-start [&_table_th]:p-2 [&_table_th]:font-bold [&_table_th]:text-brand',
        '[&_table_tr]:!border-b [&_table_tr]:!py-4',
      )}
    />
  )
}
