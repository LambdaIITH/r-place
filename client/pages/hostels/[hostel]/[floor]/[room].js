import { useRouter } from 'next/router'
import { Carousel } from '@mantine/carousel'
import { useMantineTheme, Title, createStyles, Text } from '@mantine/core'
import { useEffect, useState } from 'react'
import Layout from '../../../../components/layouts/hostel_layout'
const useStyles = createStyles((theme) => ({
  carousel:{

  },
  slide:{
    padding: '1rem',
    backgroundColor: theme.colors.blue[0],
  },
  question:{

  },
  answer:{
    
  }
}));


export default function Room() {
  const router = useRouter()
  const { hostel, floor, room } = router.query
  const theme = useMantineTheme()
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState([])
  const { classes, cx } = useStyles();
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(true)

  async function getRoomData() {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/hostel/${hostel}/${floor}/${room}`,
      {
        method: 'GET',
      }
    )
    if (res.status == 400 || res.status == 404) {
      // router.push('/404')
      router.push('/hostels')
      return
    }
    const data = await res.json()
    setName(data.name)
    setEmail(data.email)
    if (questions.length === 0) {
      for (var key in data.form_response) {
        if (data.form_response.hasOwnProperty(key)) {
          questions.push(key)
          answers.push(data.form_response[key])
        }
      }
    }
    setLoading(false)
  }
  useEffect(() => {
    if (!router.isReady) return
    getRoomData()
  }, [router.isReady])
  return (
    <>
    {loading ? <></>:
      <>
      <Title align="center" mt={12} mb={24}>
        Welcome to {name}'s room!
      </Title>
      <Carousel
        maw={320}
        mx="auto"
        withIndicators
        height={200}
        slideGap="md"
        align="start"
        loop
        className={classes.carousel}
      >
        {questions.map((question, index) => (
          <Carousel.Slide key={index} className={classes.slide}>
            <Text className={classes.question}>
            {question} :
            </Text>
            <Text className={classes.answer}>
            {answers[index]}
            </Text>
             
          </Carousel.Slide>
        ))}
      </Carousel>
      </>
    }
    </>
  )
}

Room.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}
