import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Header } from '../components/Header';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { useState } from 'react';

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <div>
      <Head>
        <title>E-Mod</title>
        <meta charSet="UTF-8" />
        <meta name="keywords" content="e-mod, automation" />
        <meta name="author" content="E-MoD" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <Header />

      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </div>
  );
}
