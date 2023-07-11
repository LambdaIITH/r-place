import { Text, Box, Image } from '@mantine/core'
import AppContext from '../../../../AppContext'
import { useContext, useEffect, useState } from 'react'
import Layout from '../../../../components/layouts/hostel_layout'
import './index.module.css'
import { useRouter } from 'next/router'
import HostelFloorSkeleton from '../../../../components/skeletons/HostelFloor'
import Pods from '../../../../components/Pods'

export default function Home() {
  const value = useContext(AppContext)
  let globalData = value.state.globalData
  const { hostel_names } = globalData
  const router = useRouter()
  const { hostel, floor } = router.query
  const [loading, setLoading] = useState(true)

  // floorData is an array of objects containing the room number+owner and the quote
  const [floorData, setFloorData] = useState(null)

  async function getFloorData() {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/hostel/${hostel}/${floor}`
    )
    if (res.status == 400) {
      // router.push('/404')
      router.push('/hostels')
      return
    }
    const data = await res.json()
    setFloorData(data)
  }

  useEffect(() => {
    if (!router.isReady) return
    getFloorData()
  }, [router.isReady])

  useEffect(() => {
    if (floorData) {
      setLoading(false)
    }
  }, [floorData])
  
  return (
    <>
      {loading ? (
        <>
          <HostelFloorSkeleton loading={loading} />
        </>
      ) : (
        <>
          <Text
            variant="gradient"
            gradient={{ from: 'indigo', to: 'cyan', deg: 45 }}
            ta="center"
            sx={{
              fontSize: '3rem',
            }}
            fw={700}
          >
            Welcome to {hostel_names[hostel?.charCodeAt(0) - 'A'.charCodeAt(0)]}{' '}
            floor {floor}
          </Text>
          <Box
            sx={{
              position: 'relative',
              margin: '3rem auto',
              width: 800,

              '@media (max-width: 48em)': {
                transform: 'rotate(90deg)',
              },
            }}
          >
            <Image
              src={
                'https://res.cloudinary.com/dcpgsijmr/image/upload/v1687086660/r-place/hostel_without_bg_djzhu5.png'
              }
              maw={800}
              mx="auto"
              radius="md"
              alt={'hostels IITH'}
              sx={{
                position: 'absolute',
                top: '0px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 800,
                overflowX: 'scroll',
              }}
            />
            <Pods floorData={floorData} hostel={hostel} floor={floor} />
          </Box>
        </>
      )}
    </>
  )
}

Home.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}
