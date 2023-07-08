import {
  Button,
  Box,
  createStyles,
  rem,
  Modal,
  Stack,
  Text,
  Image,
  BackgroundImage,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useState, useContext, useEffect } from 'react'
import AppContext from '../../AppContext'
import Layout from '../../components/layouts/hostel_layout'
import HostelMapSkeleton from '../../components/skeletons/HostelMap'

const useStyles = createStyles((theme) => ({
  button: {
    display: 'block',
    lineHeight: 1,
    padding: `${rem(8)} ${rem(12)}`,
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color: theme.colors.green[9],
    fontSize: theme.fontSizes.md,
    fontWeight: 500,
    backgroundColor: theme.colors.green[0],
    position: 'absolute',
    zIndex: '100',
    width: '12rem',
    height: '6rem',
    // visibility: 'hidden',

    opacity: 0,
    '&:hover': {
      transition: 'all linear .3s',
      // visibility: 'visible',
      opacity: 1,
      cursor: 'pointer',
      backgroundColor: theme.colors.green[2],
    },
  },
}))

export default function Home() {
  const { classes, cx } = useStyles()
  const value = useContext(AppContext)
  let globalData = value.state.globalData
  const { hostel_names } = globalData
  const [page_loading, setPageLoading] = useState(true)
  const [opened, { open, close }] = useDisclosure(false)
  const [hostel, setHostel] = useState(null)
  useEffect(() => {
    setPageLoading(true)
  }, [])
  useEffect(() => {
    if (hostel_names.length > 0) {
      setPageLoading(false)
    }
  }, [hostel_names])
  return (
    <>
      {page_loading ? (
        <>
          <HostelMapSkeleton loading={page_loading} />
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
            Welcome to IIT Hyderabad
          </Text>
          <Modal
            opened={opened}
            onClose={close}
            title={`Welcome to ${
              hostel_names[hostel?.charCodeAt(0) - 'A'.charCodeAt(0)]
            }'s Lift`}
            centered
            size={'40rem'}
          >
            <BackgroundImage
              src="https://media.istockphoto.com/id/1065306310/vector/cartoon-elevator-or-lift-with-open-doors-startup-concept.jpg?s=170667a&w=0&k=20&c=fFYdLY3a4_dHsA9Nmd_dnyKRcNsLdG-hWm1ipmnDWbA="
              radius="sm"
            >
              <Box
                sx={{
                  alignItems: 'center',
                  width: '200px',
                  margin: 'auto',
                  padding: '180px 10px 160px 10px',
                  overflow: 'hidden',
                  // border: '1px solid #ccc',
                }}
              >
                <Stack spacing="xs">
                  {Array.from(Array(6), (_, i) => (
                    <Button
                      component="a"
                      href={`/hostels/${hostel}/${6 - i}`}
                      key={6 - i}
                      sx={{
                        opacity: 0.8,
                        // backgroundColor: '#71797E'
                      }}
                    >
                      Floor {6 - i}
                    </Button>
                  ))}
                </Stack>
              </Box>
            </BackgroundImage>
          </Modal>
          <Box
            sx={{
              position: 'relative',
              margin: '3rem auto',
            }}
            maw={800}
          >
            <Image
              src={'./assets/map.png'}
              maw={800}
              mx="auto"
              radius="md"
              alt={'hostels IITH'}
            />

            {[
              { top: '5rem', left: -20, transform: 'rotate(90deg)' },
              { top: '1.5rem', left: '11rem' },
              { top: '5rem', right: '14rem', transform: 'rotate(90deg)' },
              { top: '1.5rem', right: '2rem' },
              // round 2
              { top: '14rem', right: -20, transform: 'rotate(90deg)' },
              { top: '17rem', right: '11rem' },
              { top: '14rem', left: '14rem', transform: 'rotate(90deg)' },
              { top: '17rem', left: '2rem' },
              // round 3
              { bottom: '11rem', left: '6rem' },
              { bottom: '1.5rem', left: '6rem' },
            ].map((item, index) => (
              <button
                className={classes.button}
                style={{ ...item }}
                onClick={() => {
                  setHostel(String.fromCharCode('A'.charCodeAt(0) + index))
                  open()
                }}
                key={index}
              >
                {hostel_names[index]}
              </button>
            ))}
          </Box>
        </>
      )}
    </>
  )
}

Home.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}
