import { useState, useEffect } from 'react'
import {
  createStyles,
  Header,
  Group,
  Container,
  rem,
  MediaQuery,
  Title,
  Box,
  Autocomplete,
} from '@mantine/core'
import { useRouter } from 'next/router'
import { IconSearch } from '@tabler/icons-react'
import Pallete from './Pallete'

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
      display: 'flex',
      width: rem(180),
      justifyContent: 'flex-start',
    },
  },

  link: {
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
}))

export function Nav(props) {
  const router = useRouter()
  const { classes, cx } = useStyles()

  // change the below implementation of links

  // change the below implementation of links
  const links = [
    { link: '/place', label: 'Grid' },
    { link: '/hostels', label: 'Yearbook' },
  ]
  const [active, setActive] = useState(
    router.pathname.includes('place') ? '/place' : '/hostels'
  )
  const link_items = links.map((link, index) => (
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

  const [searchValue, setSearchValue] = useState('')
  const [gradStudentsInfo, setGradInfo] = useState([]) // array of strings "RoomNumber:Name"

  // takes in searchValue results and updates the gradStudentsInfo
  function processGradData(data) {
    let gradData = []
    for (let i = 0; i < data.length; i++) {
      let gradDataString = `${data[i].hostel}${
        data[i].floor * 100 + data[i].room_number
      }:${data[i].name}`
      gradData.push(gradDataString)
    }
    setGradInfo(gradData)
  }

  // search for grad students based on search value
  async function gradInfo() {
    if (searchValue.length === 0) return
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/hostel/search/name?q=${
        searchValue.indexOf(':') > -1 ? searchValue.split(':')[1] : searchValue
      }`,
      {
        method: 'GET',
      }
    )
    const data = await res.json()
    if (data.length > 0) {
      processGradData(data)
    } else {
      // if no name matches, search for room number
      let splitText = ''
      if (searchValue.indexOf(':') > -1) {
        splitText = searchValue.split(':')[0]
      } else {
        splitText = searchValue
      }
      let building = ''
      let floor = 0
      let room = 0
      try {
        building = splitText[0].substring(0, 1)
        floor = Math.floor(
          parseInt(splitText.substring(1, splitText.length)) / 100
        )
        room = parseInt(splitText.substring(1, splitText.length)) % 100
      } catch (e) {
        console.log(e)
        return
      }
      const res_single = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/hostel/${building}/${floor}/${room}/owner`,
        {
          method: 'GET',
        }
      )
      const data1 = await res_single.json()
      processGradData(data1)
    }
  }

  useEffect(() => {
    gradInfo()
  }, [searchValue])

  // navigating to grad students' room
  function processRoute(route) {
    if (gradStudentsInfo.indexOf(route) < 0) {
      return
    } else {
      let splitText = route.split(':')[0]
      let building = splitText[0].substring(0, 1)
      let floor = Math.floor(
        parseInt(splitText.substring(1, splitText.length)) / 100
      )
      let room = parseInt(splitText.substring(1, splitText.length)) % 100
      router.push(`/hostels/${building}/${floor}/${room}`)
    }
  }
  return (
    <>
      <MediaQuery smallerThan="lg" styles={{ display: 'none' }}>
        <Header
          height={{ base: 100, md: 100, zIndex: 100, position: 'fixed' }}
          p="md"
        >
          <Container className={classes.inner} size={'xl'}>
            <Group className={classes.links}>{link_items}</Group>
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
              <Pallete setChosen={props.setChosen} />
            ) : (
              <>
                {gradStudentsInfo && (
                  <Autocomplete
                    className={classes.search}
                    placeholder="Search"
                    data={gradStudentsInfo}
                    value={searchValue}
                    onChange={setSearchValue}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        processRoute(searchValue)
                      }
                    }}
                    icon={<IconSearch size="1rem" stroke={1.5} />}
                    onSelect={(e) => {
                      processRoute(searchValue)
                    }}
                  />
                )}
              </>
            )}
          </Container>
        </Header>
      </MediaQuery>
      <MediaQuery largerThan="lg" styles={{ display: 'none' }}>
        <Header height={{ base: 160, md: 100 }} p="md">
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              marginX: 'auto',
              width: 'fit',
              alignItems: 'center',
              // width: '100vw',
              backgroundColor: 'rgba(255, 255, 255)',
              // backgroundColor: 'red',
              padding: '10px',
              position: 'fixed',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 100,
              gap: 10,
            }}
          >
            <Group className={classes.links}>{link_items}</Group>
            <Title
              variant="gradient"
              gradient={{ from: '#D6336C', to: '#AE3EC9', deg: 45 }}
              sx={{ fontSize: '1.6rem' }}
            >
              r/IITH-2023
            </Title>

            {router.pathname.includes('hostels') && gradStudentsInfo && (
              <Autocomplete
                className={classes.search}
                placeholder="Search"
                data={gradStudentsInfo}
                value={searchValue}
                onChange={setSearchValue}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    processRoute(searchValue)
                  }
                }}
                icon={<IconSearch size="1rem" stroke={1.5} />}
                onSelect={(e) => {
                  processRoute(searchValue)
                }}
              />
            )}
          </Box>
        </Header>
      </MediaQuery>
    </>
  )
}
