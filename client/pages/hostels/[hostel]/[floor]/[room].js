import { useRouter } from 'next/router'
import { Carousel } from '@mantine/carousel'
import { useMantineTheme, Title } from '@mantine/core'
import { useEffect, useState } from 'react'
import Layout from '../../../../components/layouts/hostel_layout'

export default function Room() {
  const router = useRouter()
  const { hostel, floor, room } = router.query
  const theme = useMantineTheme()
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState([])
  // const questions = []
  // const answers = []
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  async function getRoomData() {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/hostel/${hostel}/${floor}/${room}`,
      {
        method: 'GET',
      }
    )
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
  }
  useEffect(() => {
    if (!router.isReady) return
    getRoomData()
  }, [router.isReady])
  return (
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
        >
          {questions.map((question, index) => (
                  <Carousel.Slide sx={{ backgroundColor: 'red' }} key={index}>
                  {question} : {answers[index]}
                  </Carousel.Slide>
          ))}
        </Carousel>
    </>
  )
}

Room.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}
