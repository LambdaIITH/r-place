import { useRouter } from 'next/router'
import { Carousel } from '@mantine/carousel'
import {
  Title,
  createStyles,
  Text,
  Table,
  Textarea,
  Container,
  Button,
  Box,
  ActionIcon,
} from '@mantine/core'
import { useEffect, useState } from 'react'
import Layout from '../../../../components/layouts/hostel_layout'
import { useSession } from 'next-auth/react'
import { IconTrash, IconEdit } from '@tabler/icons-react'

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
  const { data: session } = useSession({ required: true });
  const [owner, setOwner] = useState(false)
  const [comments, setComments] = useState([])

  const postComment = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/hostel/${hostel}/${floor}/${room}/comments`,
      {
        method: 'POST',
        body: JSON.stringify({ comment: commentValue }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `${session?.id_token}`,
        },
      }
    )
    if (res.status == 200) {
      console.log('Comment Posted Successfuly')
    } else {
      console.log('Some errors occured')
    }
  }

  async function getComments() {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/hostel/${hostel}/${floor}/${room}/comments`,
      {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          Authorization: `${session?.id_token}`,
        }
      }
    )
    if (res.status == 404) {
      // router.push('/404')
      router.push('/hostels')
      return
    }
    const data = await res.json()
    // if (data.length === 0) {
    //   if (session?.user?.email === email){
    //     console.log('You are the owner')
    //     setComments([{from_user: 'No one@iith.ac.in', comment: 'You are a great person!, No more comments yet!'}])
    //     return
    //   }
    // }
    console.log('comments',data)
    setComments(data)
    setLoading(false)

  }
  async function deleteComment() {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/hostel/${hostel}/${floor}/${room}/comments`,
      {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
          Authorization: `${session?.id_token}`,
        }
      }
    )
    // TODO
  }
  async function editComment() {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/hostel/${hostel}/${floor}/${room}/comments`,
      {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          Authorization: `${session?.id_token}`,
        }
      }
    )
    // TODO
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
    const questions = []
    const answers = []
    for (var key in data.form_response) {
      if (data.form_response.hasOwnProperty(key)) {
        questions.push(key)
        answers.push(data.form_response[key])
      }
    }
    setQuestions(questions)
    setAnswers(answers)
    console.log(questions, answers)
    if (session?.user?.email === data.email) {
      console.log('You are the owner')
      setOwner(true)
    }
    else {
      setOwner(false)
    }
    getComments()
  }
  useEffect(() => {
    if (!router.isReady) return
    getRoomData()
  }, [router.isReady, router.query])
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
          <Box
            sx={{height: '200px', overflowY: 'scroll', mx: 16, mb: 16}}
          >
          {owner ? 
          <>
          <Text>
            Comments for you
          </Text>
            <Table highlightOnHover>
              <thead>
              <tr>
                <th>From</th>
                <th>Comment</th>
              </tr>
              </thead>
              <tbody>
            {comments?.map((comment, index) => (
              <tr key={index}>
                <td>{comment.from_user}</td>
                <td>{comment.comment}</td>
              </tr>
            ))}
              </tbody>
            </Table>
          </>
          :
          <>
          <Text>
            Your Comments to {name}
          </Text>
          <Table highlightOnHover>
          <thead>
          <tr>
            <th>From</th>
            <th>Comment</th>
            <th>Delete</th>
            <th>Edit</th>
          </tr>
          </thead>
          <tbody>
        {comments?.map((comment, index) => (
          <tr key={index}>
            <td>{comment.from_user}</td>
            <td>{comment.comment}</td>
            <td>
              <ActionIcon variant='transparent' color='red' onClick={deleteComment}>
            <IconTrash/>
              </ActionIcon>
              </td>
            <td>
              <ActionIcon variant='transparent' color='blue' onClick={(e)=>{
                e.preventDefault()
                setCommentValue(comment.comment)
              }}>
            <IconEdit/>
              </ActionIcon>
              </td>
          </tr>
        ))}
          </tbody>
        </Table>
          </>
          }
          </Box>
        </Container>
      )}
    </>
  )
}

Room.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}
