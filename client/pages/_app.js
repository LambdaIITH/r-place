import React from 'react'
import { MantineProvider } from '@mantine/core'
import AppContext from '../AppContext'
import globalData from '../globaldata'
import { SessionProvider } from 'next-auth/react'
import { Notifications } from '@mantine/notifications'
import Head from 'next/head'

function MyApp({ Component, pageProps, session }) {
  const getLayout = Component.getLayout ?? ((page)=>page)
  return (
    <SessionProvider session={session}>
      <Head>
        <title>r/IITH </title>
        <meta name="description" content="IITH r/place" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          /** Put your mantine theme override here */
          colorScheme: 'light',
          fontFamily: 'monospace , sans-serif',
          headings: { fontFamily: 'monospace, sans-serif' },
        }}
      >
        <Notifications />
        <AppContext.Provider
          value={{
            state: {
              globalData: globalData,
            },
          }}
        >
          {getLayout(<Component {...pageProps} />)}
        </AppContext.Provider>
      </MantineProvider>
    </SessionProvider>
  )
}

export default MyApp
