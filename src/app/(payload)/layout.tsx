/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import { payloadConfig } from '@/shared/server';
import '@payloadcms/next/css';
import type { ServerFunctionClient } from 'payload';
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts';
import { TanstackQueryProvider } from '../(frontend)/providers/tanstack-query-provider.jsx';
import React from 'react';
import { importMap } from './admin/importMap.js';
import './payloadStyles.css';
import './custom.scss';
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
    <TanstackQueryProvider>
      <NuqsProvider>{children}</NuqsProvider>
    </TanstackQueryProvider>
  </RootLayout>
);

export default Layout;
