import Head from 'next/head'
import { useRouter } from 'next/router'
import { Carousel } from '@mantine/carousel'
import { AppShell, useMantineTheme } from '@mantine/core'
import { Nav } from '../../../../components/Header'
export default function Home() {
  const router = useRouter()
  const { hostel, floor, room } = router.query
  const data = {
    hostel: hostel,
    floor: floor,
    room: room,
  }
  const theme = useMantineTheme()
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
        <Carousel
          maw={320}
          mx="auto"
          withIndicators
          height={200}
          slideGap="md"
          align="start"
          loop
        >
          <Carousel.Slide sx={{ backgroundColor: 'green' }}>
            hostel {data.hostel}{' '}
          </Carousel.Slide>
          <Carousel.Slide sx={{ backgroundColor: 'yellow' }}>
            floor {data.floor}{' '}
          </Carousel.Slide>
          <Carousel.Slide sx={{ backgroundColor: 'blue' }}>
            room {data.room}{' '}
          </Carousel.Slide>
        </Carousel>
      </AppShell>
    </>
  )
}
