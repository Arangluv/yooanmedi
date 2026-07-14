/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import '@payloadcms/next/css';
import './payloadStyles.css';
import React from 'react';
import type { ServerFunctionClient } from 'payload';
import { TanstackQueryProvider } from '@/app/providers/tanstack-query-provider';
import { NuqsProvider } from '@/shared';
import { payloadConfig } from '@/shared/server';
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts';
import { importMap } from './admin/importMap.js';

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
    <TanstackQueryProvider>
      <NuqsProvider>{children}</NuqsProvider>
    </TanstackQueryProvider>
  </RootLayout>
);

export default Layout;
