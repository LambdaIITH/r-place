import { MantineProvider } from "@mantine/core";
import AppContext from "../AppContext";
import globalData from "../globaldata";

function MyApp({ Component, pageProps }) {
  return (
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
  );
}

export default MyApp;
