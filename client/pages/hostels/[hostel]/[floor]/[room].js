import Head from 'next/head'
import { useRouter } from 'next/router'
import { Carousel } from '@mantine/carousel'

export default function Home() {
  const router = useRouter()
  const { hostel, floor, room } = router.query
  const data = {
    hostel: hostel,
    floor: floor,
    room: room,
  }
  return (
    <>
      <Head>
        <title>r/IITH </title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <Carousel
          maw={320}
          mx="auto"
          withIndicators
          height={200}
          slideGap="md"
          align="start"
          loop
        >
            <Carousel.Slide sx={{backgroundColor:"green"}} >hostel {data.hostel} </Carousel.Slide>
            <Carousel.Slide sx={{backgroundColor:"yellow"}} >floor {data.floor} </Carousel.Slide>
            <Carousel.Slide sx={{backgroundColor:"blue"}} >room {data.room} </Carousel.Slide>
        </Carousel>
    </>
  )
}
