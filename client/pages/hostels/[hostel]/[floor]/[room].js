import { useRouter } from 'next/router'
import { Carousel } from '@mantine/carousel'
import Layout from '../../../../components/layouts/hostel_layout'

export default function Room() {
  const router = useRouter()
  const { hostel, floor, room } = router.query
  const data = {
    hostel: hostel,
    floor: floor,
    room: room,
  }

  return (
    <>
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
    </>
  )
}

Room.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}
