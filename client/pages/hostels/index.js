import Head from 'next/head'
import { useRouter } from 'next/router'
import {
  Button,
  Box,
  createStyles,
  rem,
  Grid,
  AppShell,
  useMantineTheme,
  Modal,
  Group,
  Stack,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useState, useContext } from 'react'
import { Nav } from '../../components/Header'
import AppContext from '../../AppContext'
const useStyles = createStyles((theme) => ({
  button: {
    display: 'block',
    lineHeight: 1,
    padding: `${rem(8)} ${rem(12)}`,
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color: theme.colors.green[9],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,
    backgroundColor: theme.colors.green[0],
    '&:hover': {
      display: 'block',
      backgroundColor: theme.colors.green[2],
    },
  },
}))
export default function Home() {
  const theme = useMantineTheme()
  const { classes, cx } = useStyles()
  const value = useContext(AppContext);
  let globalData = value.state.globalData;
  const { hostels } = globalData
  const initVisibility = Array(hostels.length).fill(false)
  const [visibility, setVisibility] = useState(initVisibility)

  const handleHover = (index, value) => {
    let temp = [...visibility]
    temp[index] = value
    setVisibility(temp)
  }
  const [opened, { open, close }] = useDisclosure(false)
  const [hostel, setHostel] = useState(0)
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
        <h1>Welcome to IITH</h1>
        <Box
          sx={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            padding: '10px',
          }}
        >
          <Grid columns={24}>
            {visibility.map((item, index) => {
              return (
                <>
                  {index < 8 ? (
                    <>
                      <Grid.Col
                        key={index}
                        span={3}
                      >
                        <Box
                          onMouseEnter={() => handleHover(index, true)}
                          onMouseLeave={() => handleHover(index, false)}
                          sx={{alignContent: 'center', justifyContent: 'center'}}
                        >
                        <Button
                          style={{
                            visibility: visibility[index]
                              ? 'visible'
                              : 'hidden',
                              margin:'0 auto',
                              display: 'block',
                          }}
                          className={classes.button}
                          onClick={() => {
                            open()
                            setHostel(index<4?hostels[index]:hostels[11-index])
                          }}
                        >
                          Hostel {index<4?hostels[index]:hostels[11-index]}
                        </Button>
                        </Box>
                      </Grid.Col>
                      {(index + 1) % 4 == 0 ? (
                        <Grid.Col span={24}></Grid.Col>
                      ) : (
                        <Grid.Col span={3}></Grid.Col>
                      )}
                    </>
                  ) : null}
                </>
              )
            })}
          </Grid>

          <Grid columns={10}>
            {visibility.slice(8, 10).map((item, index) => {
              return (
                <Grid.Col
                  key={index}
                  span={3}
                  offset={2}
                  onMouseEnter={() => handleHover(index + 8, true)}
                  onMouseLeave={() => handleHover(index + 8, false)}
                >
                  <Button
                    style={{
                      visibility: visibility[index + 8] ? 'visible' : 'visible',
                    }}
                    className={classes.button}
                    onClick={() => {
                      open()
                      setHostel(hostels[index + 8])
                    }}
                  >
                    Hostel {hostels[index + 8]}
                  </Button>
                </Grid.Col>
              )
            })}
          </Grid>
          <Modal opened={opened} onClose={close} title="Floor Number" centered>
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
              {Array.from(Array(6),(x,i)=>i).map((item, index) => {
                return (
                  <Button component="a" href={`/hostels/${hostel}/${index+1}`}>
                    {index+1}
                  </Button>
                )
              })}
              </Stack>
            </Box>
          </Modal>
        </Box>
      </AppShell>
    </>
  )
}
