import { MantineProvider } from "@mantine/core";
import AppContext from "../AppContext";
import globalData from "../globaldata";
import { SessionProvider } from "next-auth/react";
import { Notifications } from '@mantine/notifications';

function MyApp({ Component, pageProps, session }) {
  return (
    <SessionProvider session={session}>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          /** Put your mantine theme override here */
          colorScheme: "light",
          fontFamily: "monospace , sans-serif",
          headings: { fontFamily: "monospace, sans-serif" },
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
          <Component {...pageProps} />
        </AppContext.Provider>
      </MantineProvider>
    </SessionProvider>
  );
}

export default MyApp;
