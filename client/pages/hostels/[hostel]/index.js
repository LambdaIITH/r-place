import {
  Stack,
  Box,
  Button,
  AppShell,
  useMantineTheme,
  Text,
} from '@mantine/core'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Nav } from '../../../components/Header'
export default function Home() {
  const router = useRouter()
  const { hostel } = router.query
  const theme = useMantineTheme()

  return (
    <>
      <Head>
        <title>r/IITH </title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

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
        <Text
          variant="gradient"
          gradient={{ from: 'indigo', to: 'cyan', deg: 45 }}
          sx={{ fontFamily: 'Greycliff CF, sans-serif' }}
          ta="center"
          fz="xl"
          fw={700}
        >
          Welcome to IITH hostel {hostel}
        </Text>
        <Box
          sx={{
            alignItems: 'center',
            width: '200px',
            margin: 'auto',
            padding: '30px 10px 30px 10px',
            border: '1px solid #ccc',
          }}
        >
          <Stack spacing="xs">
            <Button component="a" href={`/hostels/${hostel}/1`}>
              Floor 1
            </Button>
            <Button component="a" href={`/hostels/${hostel}/2`}>
              Floor 2
            </Button>
            <Button component="a" href={`/hostels/${hostel}/3`}>
              Floor 3
            </Button>
            <Button component="a" href={`/hostels/${hostel}/4`}>
              Floor 4
            </Button>
            <Button component="a" href={`/hostels/${hostel}/5`}>
              Floor 5
            </Button>
            <Button component="a" href={`/hostels/${hostel}/6`}>
              Floor 6
            </Button>
          </Stack>
        </Box>
      </AppShell>
    </>
  )
}
