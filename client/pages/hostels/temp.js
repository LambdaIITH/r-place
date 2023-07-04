

  import {
    Button,
    Grid,
    HoverCard,
    Group,
    Text,
    Title,
    Blockquote,
    Box,
    Image,
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
            <Grid  columns={8} key={i}>
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
        <Box sx={{ position: 'relative' }}>
          {/* <canvas id="floorCanvas">Hi</canvas> */}
          <Image
            src={'https://res.cloudinary.com/dcpgsijmr/image/upload/v1687086660/r-place/hostel_without_bg_djzhu5.png'}
            maw={1000}
            mx="auto"
            radius="md"
            alt={'hostels IITH'}
            sx={{ position: 'absolute', top: '0px', left: '50%', transform: 'translateX(-50%)' }}
          />
          <Grid
            columns={4}
            sx={{rowGap: '30px', width: '1000px', position: 'absolute', top: '3rem', left: '50%', transform: 'translateX(-50%)' }}
          >
            <Grid.Col sx={{marginLeft: '10px'}} span={1} >{pods?.[0]}</Grid.Col>
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

  const podStyles = {
    // 1st pod
    1: [{ top: '4.5rem', left: '.8rem', },
    { top: '7.5rem', left: '.8rem', },
    { top: '1rem', left: '4.5rem', transform: 'rotate(90deg)' },
    { top: '1rem', left: '7.3rem', transform: 'rotate(90deg)' },
    { top: '4.5rem', left: '11rem', },
    { top: '7.5rem', left: '11rem', },
    { top: '11rem', left: '4.5rem', transform: 'rotate(90deg)' },
    { top: '11rem', left: '7.3rem', transform: 'rotate(90deg)' }],
    // second pod
    2: [{ top: 'calc(4.5rem + 12rem)', left: 'calc(12rem + .8rem)', },
    { top: 'calc(7.5rem + 12rem)', left: 'calc(12rem + .8rem)', },
    { top: 'calc(1rem + 12rem)', left: 'calc(12rem + 4.5rem)', transform: 'rotate(90deg)' },
    { top: 'calc(1rem + 12rem)', left: 'calc(12rem + 7.3rem)', transform: 'rotate(90deg)' },
    { top: 'calc(4.5rem + 12rem)', left: 'calc(12rem + 11rem)', },
    { top: 'calc(7.5rem + 12rem)', left: 'calc(12rem + 11rem)', },
    { top: 'calc(11rem + 12rem)', left: 'calc(12rem + 4.5rem)', transform: 'rotate(90deg)' },
    { top: 'calc(11rem + 12rem)', left: 'calc(12rem + 7.3rem)', transform: 'rotate(90deg)' }],
    // third pod
    3: [{ top: '4.5rem', left: 'calc(24rem + .8rem)', },
    { top: '7.5rem', left: 'calc(24rem + .8rem)', },
    { top: '1rem' , left: 'calc(24rem + 4.5rem)', transform: 'rotate(90deg)' },
    { top: '1rem', left: 'calc(24rem + 7.3rem)', transform: 'rotate(90deg)' },
    { top: '4.5rem', left: 'calc(24rem + 11rem)', },
    { top: '7.5rem', left: 'calc(24rem + 11rem)', },
    { top: '11rem', left: 'calc(24rem + 4.5rem)', transform: 'rotate(90deg)' },
    { top: '11rem', left: 'calc(24rem + 7.3rem)', transform: 'rotate(90deg)' }],
    // fourth pod
    4: [{ top: 'calc(4.5rem + 12rem)', left: 'calc(35.6rem + .8rem)', },
    { top: 'calc(7.5rem + 12rem)', left: 'calc(35.6rem + .8rem)', },
    { top: 'calc(1rem + 12rem)', left: 'calc(35.6rem + 4.5rem)', transform: 'rotate(90deg)' },
    { top: 'calc(1rem + 12rem)', left: 'calc(35.6rem + 7.3rem)', transform: 'rotate(90deg)' },
    { top: 'calc(4.5rem + 12rem)', left: 'calc(35.6rem + 11rem)', },
    { top: 'calc(7.5rem + 12rem)', left: 'calc(35.6rem + 11rem)', },
    { top: 'calc(11rem + 12rem)', left: 'calc(35.6rem + 4.5rem)', transform: 'rotate(90deg)' },
    { top: 'calc(11rem + 12rem)', left: 'calc(35.6rem + 7.3rem)', transform: 'rotate(90deg)' }]}
  
  Home.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>
  }
  