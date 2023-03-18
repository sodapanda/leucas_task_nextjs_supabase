import { useState } from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { MantineProvider, ColorScheme, ColorSchemeProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider, Session } from '@supabase/auth-helpers-react';
import { Tabs } from '@mantine/core';
import { useRouter } from 'next/router';

import '../globals.css';

export default function App({
  Component,
  pageProps,
}: AppProps<{
  initialSession: Session;
}>) {
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light');

  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(nextColorScheme);
  };

  const [supabase] = useState(() => createBrowserSupabaseClient());

  const [activeTab, setActiveTab] = useState<string | null>('/clock');
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Leucas Task</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <link rel="shortcut icon" href="/favicon.svg" />
      </Head>

      <SessionContextProvider supabaseClient={supabase} initialSession={pageProps.initialSession}>
        <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
          <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
            <NotificationsProvider>
              <div className="w-screen">
                <div className="w-full ml-auto mr-auto flex flex-col">
                  <Tabs
                    variant="outline"
                    radius="lg"
                    value={activeTab}
                    onTabChange={(value) => {
                      setActiveTab(value);
                      router.push(`${value}`);
                    }}
                  >
                    <Tabs.List>
                      <Tabs.Tab value="/clock">打卡</Tabs.Tab>
                      <Tabs.Tab value="/tasklist">任务</Tabs.Tab>
                      <Tabs.Tab value="/history">历史</Tabs.Tab>
                      <Tabs.Tab value="/account">个人</Tabs.Tab>
                      <Tabs.Tab value="/idea">idea</Tabs.Tab>
                      <Tabs.Tab value="/">login</Tabs.Tab>
                    </Tabs.List>
                  </Tabs>
                  <div className="w-full grow shrink-0">
                    <Component {...pageProps} />
                  </div>
                </div>
              </div>
            </NotificationsProvider>
          </MantineProvider>
        </ColorSchemeProvider>
      </SessionContextProvider>
    </>
  );
}
