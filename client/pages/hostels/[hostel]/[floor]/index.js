import {
  Button,
  Grid,
  HoverCard,
  Group,
  Text,
  Title,
  Blockquote,
  Box,
} from '@mantine/core'
import AppContext from '../../../../AppContext'
import { useContext, useEffect, useState } from 'react'
import Layout from '../../../../components/layouts/hostel_layout'
import './index.module.css'
import { useRouter } from 'next/router'

export default function Home() {
  const value = useContext(AppContext)
  const router = useRouter()
  const {hostel, floor} = router.query
  let globalData = value.state.globalData
  const { hostel_names } = globalData
  const [pods, setPods] = useState([])
  const [floorData, setFloorData] = useState(null)
  const [loading, setLoading] = useState(true)

  async function getFloorData() {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/hostel/${hostel}/${floor}`
    )
    if (res.status == 400){
      // router.push('/404')
      router.push('/hostels')
      return
    }
    const data = await res.json()
    setFloorData(data)
    setLoading(false)
  }

  useEffect(() => {
    if (!router.isReady) return
    getFloorData()
  }, [router.isReady])

  function search_room(room) {
    for (let i = 0; i < floorData.length; i++) {
      if (floor * 100 + floorData[i].room_number === room) {
        return return_room_button(floorData[i])
      }
    }
    return (
      <Group position="center">
        <Button disabled>{`${room}`}</Button>
      </Group>
    )
  }
  function return_room_button(room_owner_data) {
    return (
      <Group position="center">
        <HoverCard width={250} shadow="md">
          <HoverCard.Target>
            <Button
              component="a"
              href={`/hostels/${hostel}/${floor}/${room_owner_data.room_number}`}
            >
              {`${floor * 100 + room_owner_data.room_number}`}
            </Button>
          </HoverCard.Target>
          <HoverCard.Dropdown>
            <Blockquote
              cite={<Text fx="sm">{`- ${room_owner_data.name}`}</Text>}
            >
              <Text size={15}>{`${room_owner_data.quote}`}</Text>
            </Blockquote>
          </HoverCard.Dropdown>
        </HoverCard>
      </Group>
    )
  }
  useEffect(() => {
    let pods = []
    if (floorData) {
      for (let i = 0; i < 4; i++) {
        pods.push(
          <Grid columns={8} key={i}>
            <Grid.Col span={2} offset={2}>
              {search_room(floor * 100 + i * 8 + (i % 2 == 0 ? 5 : 1))}
            </Grid.Col>
            <Grid.Col span={2}>
              {search_room(floor * 100 + i * 8 + (i % 2 == 0 ? 6 : 2))}
            </Grid.Col>
            <Grid.Col span={2}></Grid.Col>
            <Grid.Col span={2}>
              {search_room(floor * 100 + i * 8 + (i % 2 == 0 ? 4 : 8))}
            </Grid.Col>
            <Grid.Col span={2} offset={4}>
              {search_room(floor * 100 + i * 8 + (i % 2 == 0 ? 7 : 3))}
            </Grid.Col>
            <Grid.Col span={2}>
              {search_room(floor * 100 + i * 8 + (i % 2 == 0 ? 3 : 4))}
            </Grid.Col>
            <Grid.Col span={2} offset={4}>
              {search_room(floor * 100 + i * 8 + (i % 2 == 0 ? 8 : 5))}
            </Grid.Col>
            <Grid.Col span={2} offset={2}>
              {search_room(floor * 100 + i * 8 + (i % 2 == 0 ? 2 : 6))}
            </Grid.Col>
            <Grid.Col span={2}>
              {search_room(floor * 100 + i * 8 + (i % 2 == 0 ? 1 : 7))}
            </Grid.Col>
            <Grid.Col span={2}></Grid.Col>
          </Grid>
        )
      }
    }
    setPods(pods)
  }, [floorData])

  return (
    <>
    {loading ?<></> :<>
      <Title align="center" mt={12} mb={24}>
        Welcome to {hostel_names[hostel?.charCodeAt(0) - 'A'.charCodeAt(0)]}{' '}
        floor {floor}
      </Title>
      <Box sx={{ position: 'relative' }}>
        <canvas id="floorCanvas">Hi</canvas>
        <Grid
          columns={4}
          sx={{ position: 'absolute', top: '0px', left: '0px' }}
        >
          <Grid.Col span={1}>{pods?.[0]}</Grid.Col>
          <Grid.Col span={1} offset={1}>
            {pods?.[2]}
          </Grid.Col>
          <Grid.Col span={1} offset={1}>
            {pods?.[1]}
          </Grid.Col>
          <Grid.Col span={1} offset={1}>
            {pods?.[3]}
          </Grid.Col>
        </Grid>
      </Box>
    </>}
    </>
  )
}

Home.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}
