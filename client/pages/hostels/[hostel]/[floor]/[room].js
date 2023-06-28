import { useRouter } from 'next/router'
import { Carousel } from '@mantine/carousel'
import {
  Title,
  createStyles,
  Text,
  Textarea,
  Container,
  Button,
} from '@mantine/core'
import { useEffect, useState } from 'react'
import Layout from '../../../../components/layouts/hostel_layout'
const useStyles = createStyles((theme) => ({
  carousel: {},
  slide: {
    padding: '1rem',
    backgroundColor: theme.colors.blue[0],
  },
  question: {},
  answer: {},
}))

export default function Room() {
  const router = useRouter()
  const { hostel, floor, room } = router.query
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState([])
  const { classes, cx } = useStyles()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [commentValue, setCommentValue] = useState('')

  const postComment = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/hostel/${hostel}/${floor}/${room}/comments`,
      {
        method: 'POST',
        body: JSON.stringify({ comment: commentValue }),
        headers: { 'Content-Type': 'application/json' },
      }
    )
    if (res.status == 200) {
      console.log('Comment Posted Successfuly')
    } else {
      console.log('Some errors occured')
    }
  }

  async function getRoomData() {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/hostel/${hostel}/${floor}/${room}`
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
      {loading ? (
        <></>
      ) : (
        <Container>
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
                <Text className={classes.question}>{question} :</Text>
                <Text className={classes.answer}>{answers[index]}</Text>
              </Carousel.Slide>
            ))}
          </Carousel>

          <Textarea
            placeholder="Type your mind"
            label="Leave a comment"
            description="Comments are only visible to the room owner"
            radius="md"
            mx={16}
            value={commentValue}
            onChange={(event) => {
              setCommentValue(event.target.value)
            }}
          />
          <Button my={12} mx={16} onClick={postComment}>
            Post Comment
          </Button>
        </Container>
      )}
    </>
  )
}

Room.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}
