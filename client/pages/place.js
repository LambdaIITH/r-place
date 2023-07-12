import { useState, useEffect, useContext } from "react";
import {
  AppShell,
  Box,
  Drawer,
  MediaQuery,
  Title,
} from "@mantine/core";
import { Nav } from "../components/Header";
import Sidebar from "../components/Sidebar";
import Canvas from "../components/Canvas";
import { useDisclosure } from "@mantine/hooks";
import { IconX } from "@tabler/icons-react";
import AppContext from "../AppContext";
import { signIn, useSession } from "next-auth/react";
import { notifications } from '@mantine/notifications';
import PlaceCanvas from "../components/skeletons/PlaceCanvas";
import Pallete from "../components/Pallete";

export default function Place() {

  const [opened, setOpened] = useState(false)

  const { data: session } = useSession()
  const value = useContext(AppContext)
  let globalData = value.state.globalData
  let { colorPalette, gridSize, pollingInterval } = globalData

  // props for sidebar
  const [col, setCol] = useState(0)
  const [row, setRow] = useState(0)
  const [last_updated_by, setLastUpdatedBy] = useState('')

  // props for canvas
  const [chosen, setChosen] = useState('#ffffff') // from 14 color palette
  const [current, setCurrent] = useState('#ffffff') // current color of chosen pixel from canvas
  const [colors, setColors] = useState([])
  const [cooldown, setCooldown] = useState(0)

  // mobile devices - bottom drawer
  const [opened_d, { open: open_d, close: close_d }] = useDisclosure(false)

  // might break here, check what happens if pixel_logs table empty
  const [last_update, setLastUpdate] = useState(0)

  const [loading, setLoading] = useState(true)
  async function loadCanvas() {
    try {
      console.log('loading canvas')
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/grid/full_grid`,
        {
          method: 'GET',
        }
      )
      const temp = await response.json()
      const colors = []
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          colors.push(temp.grid[i][j])
        }
      }
      setColors(colors)
      setLastUpdate(temp['last update'])
      setLoading(false)
    } catch (err) {
      console.log(err)
    }
  }
  async function postPixel() {
    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL
        }/grid/pixel/${row}/${col}/${colorPalette.indexOf(chosen)}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': 'http://127.0.0.1:3000',
            Authorization: `${session?.id_token}`,
          },
        }
      )
      const temp = await response.json()
      if (response.status === 498) {
        signIn()
      }
      else if (response.status === 429) {
        setCooldown(temp.cooldown)
      } 
      else if (response.status === 500){
        notifications.show({
          id: 'hello-there',
          withCloseButton: true,
          onClose: () => console.log('unmounted'),
          onOpen: () => console.log('mounted'),
          autoClose: 5000,
          title: 'Pixel update failed.',
          message: `Invalid user.`,
          color: 'red',
          icon: <IconX />,
          className: 'my-notification-class',
          loading: false,
        })
      }
      else {
        setNew()
      }

    } catch (err) {
      console.log(err)
    }
  }
  async function getUpdates(colors) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/grid/updates/${last_update}`,
        {
          method: 'GET',
        }
      )
      const temp = await response.json()
      const updates = temp.updates
      const newColors = [...colors]
      for (let i = 0; i < updates.length; i++) {
        newColors[updates[i].row * gridSize + updates[i].col] = updates[i].color
      }
      setColors(newColors)
      setLastUpdate(temp['last update'])
    } catch (err) {
      console.log(err)
    }
  }

  async function getPixelHistory() {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/grid/pixel/${row}/${col}/history`,
        {
          method: 'GET',
        }
      )
      const temp = await response.json()
      setLastUpdatedBy(temp[0]?.email.replace('@iith.ac.in', ''))
    } catch (err) {
      console.log(err)
      setLastUpdatedBy('None ㋡')
    }
  }

  function setNew() {
    const newColors = [...colors]
    newColors[row * gridSize + col] = colorPalette.indexOf(chosen)
    setColors(newColors)
    setCurrent(chosen)
  }

  useEffect(() => {
    loadCanvas()
  }, [])

  useEffect(() => {
    getPixelHistory()
  }, [row, col])

  useEffect(() => {
    const interval = setInterval(() => {
      getUpdates(colors)
      console.log('getting updates')
    }, pollingInterval)
    return () => clearInterval(interval)
  }, [colors])

  useEffect(() => {
    if (cooldown != 0) {
      notifications.show({
        id: 'hello-there',
        withCloseButton: true,
        onClose: () => console.log('unmounted'),
        onOpen: () => console.log('mounted'),
        autoClose: 5000,
        title: 'Pixel update failed.',
        message: `Please try again after ${
          Math.floor(cooldown * 100) / 100
        } seconds.`,
        color: 'red',
        icon: <IconX />,
        className: 'my-notification-class',
        loading: false,
      })
    }
  }, [cooldown])

  return (
    <>
      <MediaQuery smallerThan="lg" styles={{ display: 'none' }}>
        <AppShell
          styles={{
            main: {
              background: '#f0f0f0',
            },
          }}
          navbarOffsetBreakpoint="sm"
          asideOffsetBreakpoint="sm"
          aside={
            <Sidebar
              opened={opened}
              chosen={chosen}
              col={col}
              row={row}
              current={current}
              postPixel={postPixel}
              last_updated_by={last_updated_by}
            />
          }
          header={<Nav setOpened={setOpened} setChosen={setChosen} />}
        >
          {loading ? (
            <PlaceCanvas loading={loading} />
          ) : (
            <Canvas
              setCol={setCol}
              setRow={setRow}
              setCurrent={setCurrent}
              colors={colors}
              
            />
          )}
        </AppShell>
      </MediaQuery>
      <MediaQuery largerThan="lg" styles={{ display: 'none' }}>
        <AppShell
          styles={{
            main: {
              background: '#f0f0f0',
            },
          }}
          header={<Nav setOpened={setOpened} setChosen={setChosen} />}
        >
          {loading ? (
            <PlaceCanvas loading={loading} />
          ) : (
            <Box
              sx={{
                height: '100vh',
                // overflow: "auto",
                width: '100%',
                // backgroundColor: "rgba(0,0,0,0.2)",
              }}
            >
              <Box
                sx={{
                  height: '20%',
                }}
              >
                <Canvas
                  setCol={setCol}
                  setRow={setRow}
                  setCurrent={setCurrent}
                  colors={colors}
                  paletteOpen={open_d}
                />
              </Box>

              <Drawer
                opened={opened_d}
                onClose={close_d}
                size="550px"
                position="bottom"
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '2rem',
                  }}
                >
                  <Title
                    variant="gradient"
                    gradient={{ from: '#D6336C', to: '#AE3EC9', deg: 45 }}
                    order={2}
                    sx={{ textAlign: 'center' }}
                  >
                    Pallete
                  </Title>
                  <Pallete setChosen={setChosen} />
                  <Sidebar
                    opened={opened}
                    chosen={chosen}
                    col={col}
                    row={row}
                    current={current}
                    postPixel={postPixel}
                    last_updated_by={last_updated_by}
                  />
                </Box>
              </Drawer>
            </Box>
          )}
        </AppShell>
      </MediaQuery>
    </>
  )
}
