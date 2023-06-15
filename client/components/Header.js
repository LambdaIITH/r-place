import React, { useContext, useState } from 'react'
import {
  createStyles,
  Header,
  Group,
  Container,
  Burger,
  rem,
  MediaQuery,
  useMantineTheme,
  ColorSwatch,
  Title,
  Box,
  Autocomplete,
  Button,
  Menu,
  Stack
} from '@mantine/core'
import { CheckIcon } from '@mantine/core'
import AppContext from '../AppContext'
import { useRouter } from 'next/router'
import { IconSearch } from '@tabler/icons-react'

const useStyles = createStyles((theme) => ({
  inner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: rem(70),
    [theme.fn.smallerThan('sm')]: {
      justifyContent: 'flex-start',
    },
  },

  links: {
    width: rem(300),
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },

  pallete: {
    width: rem(690),
    [theme.fn.smallerThan('lg')]: {
      width: rem(190),
    },
  },
  swatches: {
    border: '0.5px solid #FFF',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  burger: {
    marginRight: theme.spacing.md,

    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  link: {
    display: 'block',
    lineHeight: 1,
    padding: `${rem(8)} ${rem(12)}`,
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },
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
      backgroundColor: theme.colors.green[5],
    },
  },
  linkActive: {
    '&, &:hover': {
      backgroundColor: theme.fn.variant({
        variant: 'light',
        color: theme.primaryColor,
      }).background,
      color: theme.fn.variant({ variant: 'light', color: theme.primaryColor })
        .color,
    },
  },
  search: {
    width: rem(300),
  },
  search_small: {
    width: rem(200),
  },
}))

export function Nav(props) {
  const theme = useMantineTheme()
  const [opened, setOpened] = useState(false)
  const [chosen, setChosen] = useState('')
  const router = useRouter()
  const value = useContext(AppContext)
  const links = [
    { link: '/place', label: 'Basic' },
    { link: '/hostels', label: 'Hostels' },
    { link: '#', label: 'Acads' },
  ]
  const [active, setActive] = useState(
    router.pathname.includes('place')
      ? '/place'
      : router.pathname.includes('hostels')
      ? '/hostels'
      : '/acads'
  )
  let globalData = value.state.globalData
  const { classes, cx } = useStyles()
  const items = links.map((link, index) => (
    <a
      key={index}
      href={link.link}
      className={cx(classes.link, {
        [classes.linkActive]: active === link.link,
      })}
      onClick={() => {
        setActive(link.link)
      }}
    >
      {link.label}
    </a>
  ))
  let { colorPalette } = globalData
  const swatches = colorPalette.map((color, index) => (
    <ColorSwatch
      key={index}
      color={color}
      component="button"
      className={classes.swatches}
      // size={20}
      onClick={() => {
        console.log(color)
        console.log(theme.colors)
        props.setChosen(color)
        setChosen(color)
      }}
    >
      {chosen === color ? <CheckIcon width={rem(10)} /> : ''}
    </ColorSwatch>
  ))

  const [searchValue, setSearchValue] = useState('')
  const [gradStudentsInfo, setGradInfo] = React.useState([])
  async function gradInfo() {
    setGradInfo([
      'A101:John',
      'B202:Emma',
      'C303:Liam',
      'D404:Olivia',
      'E505:Noah',
      'F606:Ava',
      'G107:William',
      'H208:Sophia',
      'I309:James',
      'J410:Isabella',
      'A102:Emily',
      'B203:Jacob',
      'C304:Charlotte',
      'D405:Mason',
      'E506:Amelia',
      'F607:Benjamin',
      'G108:Harper',
      'H209:Michael',
      'I310:Abigail',
      'J411:Daniel',
      'A103:Oliver',
      'B204:Sophia',
      'C305:Alexander',
      'D406:Mia',
      'E507:Elijah',
      'F608:Elizabeth',
      'G109:Matthew',
      'H210:Charlotte',
      'I311:Lucas',
      'J412:Evelyn',
    ])
  }
  React.useEffect(() => {
    gradInfo()
  }, [])
  function processRoute(route) {
    if (gradStudentsInfo.indexOf(route) < 0) {
      return
    } else {
      let splitText = route.split(':')[0]
      let building = splitText[0].substring(0, 1)
      let floor = Math.floor(
        parseInt(splitText.substring(1, splitText.length)) / 100
      )
      let room = splitText.substring(1, splitText.length)
      console.log(building, floor, room)
      router.push(`/hostels/${building}/${floor}/${room}`)
    }
  }
  return (
    <>
      <MediaQuery smallerThan="lg" styles={{ display: 'none' }}>
        <Header height={{ base: 100, md: 100 }} p="md">
          <Container className={classes.inner} size={'xl'}>
            {/* <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
              <Burger
                opened={opened}
                onClick={() => {
                  setOpened((o) => !o)
                  props.setOpened((o) => !o)
                }}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery> */}
            <Group className={classes.links} spacing={5}>
              {items}
            </Group>
            <Title
              order={1}
              variant="gradient"
              gradient={{ from: '#D6336C', to: '#AE3EC9', deg: 45 }}
              sx={{ fontSize: '1.8rem', width: '30%' }}
            >
              {' '}
              r/IITH-2023
            </Title>
            {router.pathname.includes('place') ? (
              <Group
                className={classes.pallete}
                position="center"
                spacing="xs"
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(16, 1fr)',
                  gridTemplateRows: 'repeat(2, 1fr)',
                }}
              >
                {swatches}
              </Group>
            ) : (
              <>
                {gradStudentsInfo ? (
                  <>
                    <Autocomplete
                      className={classes.search}
                      placeholder="Search by room no. or name"
                      data={gradStudentsInfo}
                      value={searchValue}
                      onChange={setSearchValue}
                    />
                    <Button
                      className={classes.button}
                      onClick={() => {
                        processRoute(searchValue)
                      }}
                    >
                      Search
                      <IconSearch size="1rem" stroke={1.5} />
                    </Button>
                  </>
                ) : (
                  <></>
                )}
              </>
            )}
          </Container>
        </Header>
      </MediaQuery>
      <MediaQuery largerThan="lg" styles={{ display: 'none' }}>
        
          {router.pathname.includes('place') ? (
            <Group
              className={classes.pallete}
              position="center"
              spacing="xs"
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(8, 1fr)',
                gridTemplateRows: 'repeat(4, 1fr)',
              }}
            >
              {swatches}
            </Group>
          ) : (
            <Box
          sx={{
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              backgroundColor: "rgba(255, 255, 255)",
              padding: "10px",
            }}
          >
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <Button>menu</Button>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item>Basic</Menu.Item>
                <Menu.Item>Hostels</Menu.Item>
                <Menu.Item>Acads</Menu.Item>
              </Menu.Dropdown>
            </Menu>
            <Title
              variant="gradient"
              gradient={{ from: "#D6336C", to: "#AE3EC9", deg: 45 }}
              sx={{ fontSize: "1.1rem" }}
            >
              r/IITH-2023
            </Title>
            
            {gradStudentsInfo ? (
                <Stack>
                  <Autocomplete
                    className={classes.search_small}
                    placeholder="Search by room no. or name"
                    data={gradStudentsInfo}
                    value={searchValue}
                    onChange={setSearchValue}
                  />
                  <Button
                    className={classes.button}
                    onClick={() => {
                      processRoute(searchValue)
                    }}
                  >
                    Search
                    <IconSearch size="1rem" stroke={1.5} />
                  </Button>
                </Stack>
              ) : (
                <></>
              )}
          </Box>
        </Box>
              
          )}
      </MediaQuery>
    </>
  )
}
