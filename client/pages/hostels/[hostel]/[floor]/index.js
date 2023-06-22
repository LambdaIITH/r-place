import { Button, Grid, HoverCard, Group, Text } from '@mantine/core'
import { useRouter } from 'next/router'
import AppContext from '../../../../AppContext'
import { useContext, useEffect, useState } from 'react'
import Layout from '../../../../components/layouts/hostel_layout'
import './index.module.css'

export default function Home() {
  const router = useRouter()
  const value = useContext(AppContext)
  let globalData = value.state.globalData
  const { hostel_names } = globalData
  const { hostel, floor } = router.query
  const [pods, setPods] = useState([])
  const [floorData, setFloorData] = useState(null)

  async function getFloorData() {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/hostel/${hostel}/${floor}`
    )
    const data = await res.json()
    setFloorData(data)
  }

  useEffect(() => {
    if (!router.isReady) return
    getFloorData()
  }, [router.isReady])

  function search_room(room) {
    console.log(floorData)
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
        <HoverCard width={280} shadow="md">
          <HoverCard.Target>
            <Button
              component="a"
              href={`/hostels/${hostel}/${floor}/${room_owner_data.room_number}`}
            >
              {`${floor * 100 + room_owner_data.room_number}`}
            </Button>
          </HoverCard.Target>
          <HoverCard.Dropdown>
            <Text size="sm">
              {`${room_owner_data.name} : "${room_owner_data.quote}"`}
            </Text>
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
      <h1>
        Welcome to {hostel_names[hostel?.charCodeAt(0) - 'A'.charCodeAt(0)]}{' '}
        floor {floor}
      </h1>
      <div style={{ position: 'relative' }}>
        <canvas id="floorCanvas"></canvas>
        <Grid
          columns={2}
          sx={{ position: 'absolute', top: '0px', left: '0px' }}
        >
          <Grid.Col span={1}>
            {pods?.slice(0, 2).map((pod, index) =>
              index === 0 ? (
                <Grid columns={2} key={index}>
                  <Grid.Col span={1}>{pod}</Grid.Col>
                  <Grid.Col span={1}></Grid.Col>
                </Grid>
              ) : (
                <Grid columns={2} key={index}>
                  <Grid.Col span={1}></Grid.Col>
                  <Grid.Col span={1}>{pod}</Grid.Col>
                </Grid>
              )
            )}
          </Grid.Col>
          <Grid.Col span={1}>
            {pods?.slice(2, 4).map((pod, index) =>
              index === 0 ? (
                <Grid columns={2} key={index}>
                  <Grid.Col span={1}>{pod}</Grid.Col>
                  <Grid.Col span={1}></Grid.Col>
                </Grid>
              ) : (
                <Grid columns={2} key={index}>
                  <Grid.Col span={1}></Grid.Col>
                  <Grid.Col span={1}>{pod}</Grid.Col>
                </Grid>
              )
            )}
          </Grid.Col>
        </Grid>
      </div>
    </>
  )
}

Home.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}
