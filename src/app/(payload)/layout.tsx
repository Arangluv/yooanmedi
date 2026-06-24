/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import { payloadConfig } from '@/shared/server';
import '@payloadcms/next/css';
import type { ServerFunctionClient } from 'payload';
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts';
import QueryProvider from '../(frontend)/query-provider';
import React from 'react';
import { importMap } from './admin/importMap.js';
import './payloadStyles.css';
import './custom.scss';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { NuqsProvider } from '@/shared';

type Args = {
  children: React.ReactNode;
};

const serverFunction: ServerFunctionClient = async function (args) {
  'use server';
  return handleServerFunctions({
    ...args,
    config: payloadConfig,
    importMap,
  });
};

const Layout = ({ children }: Args) => (
  <RootLayout config={payloadConfig} importMap={importMap} serverFunction={serverFunction}>
    <QueryProvider>
      <NuqsProvider>{children}</NuqsProvider>
      <ReactQueryDevtools />
    </QueryProvider>
  </RootLayout>
);

export default Layout;
