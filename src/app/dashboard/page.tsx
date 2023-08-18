"use client"
// dashboard/page.tsx
import { FC } from 'react';
import Content from './Content';
import dynamic from 'next/dynamic';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';

const DynamicContext = dynamic(() => import('./Content'), { ssr: false });

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

const Page: FC = () => {
  return <SessionProvider><QueryClientProvider client={queryClient} ><DynamicContext /></QueryClientProvider></SessionProvider>
};

export default Page;
