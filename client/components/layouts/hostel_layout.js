import { AppShell, useMantineTheme, } from '@mantine/core';
import { Nav } from '../Header';

export default function Layout({ children }) {
  const theme = useMantineTheme();
  return (
    <>
      <AppShell
        styles={{
          main: {
            background:
              theme.colorScheme === 'dark'
                ? theme.colors.dark[8]
                : theme.colors.gray[0],
          },
        }}
        navbarOffsetBreakpoint="sm"
        header={<Nav />}
      >
          {children}
      </AppShell>
    </>
  )
}
