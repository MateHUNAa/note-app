"use client"

// profile/[id]/page.tsx
import { FC } from 'react';
import dynamic from 'next/dynamic';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';

interface PageProps {
     params: {
          id: string
     }
}

const DynamicContext = dynamic(() => import('./content'), { ssr: false });

const queryClient = new QueryClient({
     defaultOptions: {
          queries: {
               refetchOnWindowFocus: false,
               retry: false,
          },
     },
});


const Page: FC<PageProps> = (props) => {
     return (
         <SessionProvider>
             <QueryClientProvider client={queryClient}>
                 <DynamicContext id={props.params.id}  /> 
             </QueryClientProvider>
         </SessionProvider>
     );
};

export default Page;
