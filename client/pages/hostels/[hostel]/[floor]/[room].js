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
  Card,
  Blockquote,
  Image,
} from '@mantine/core'
import { useEffect, useState } from 'react'
import Layout from '../../../../components/layouts/hostel_layout'
import { useSession, signIn } from 'next-auth/react'
import { IconTrash, IconEdit } from '@tabler/icons-react'
import RoomSkeleton from '../../../../components/skeletons/Room'

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
  const [quote, setQuote] = useState('')
  const [page_loading, setPageLoading] = useState(true)
  const [commentValue, setCommentValue] = useState('')
  const { data: session, loading } = useSession({ required: true })
  const [owner, setOwner] = useState(false)
  const [comments, setComments] = useState([])
  const [edit_comment, setEditComment] = useState(false)

  const postComment = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/hostel/${hostel}/${floor}/${room}/comments`,
      {
        method: 'POST',
        body: JSON.stringify({ comment: commentValue }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${session?.id_token}`,
        },
      }
    )
    if (res.status === 498) {
      signIn()
      return
    }
    if (res.status == 200) {
      console.log('Comment Posted Successfuly')
    } else {
      console.log('Some errors occured')
    }
    getComments()
    setCommentValue('')
  }

  async function getComments() {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/hostel/${hostel}/${floor}/${room}/comments`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${session?.id_token}`,
        },
      }
    )
    if (res.status === 498) {
      signIn()
      return
    }
    if (res.status == 404) {
      // router.push('/404')
      router.push('/hostels')
      return
    }
    const data = await res.json()
    if (data.length === 0) {
      if (session?.user?.email === email) {
        console.log('You are the owner')
        setComments([
          {
            from_user: 'No one@iith.ac.in',
            comment: 'You are a great person!, No more comments yet!',
          },
        ])
        return
      }
    }
    console.log('comments', data)
    setComments(data)
    setPageLoading(false)
  }
  async function deleteComment() {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/hostel/${hostel}/${floor}/${room}/comments`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${session?.id_token}`,
        },
      }
    )
    if (res.status === 498) {
      signIn()
      return
    }
    getComments()
  }
  async function editComment() {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/hostel/${hostel}/${floor}/${room}/comments`,
      {
        method: 'PATCH',
        body: JSON.stringify({ comment: commentValue }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${session?.id_token}`,
        },
      }
    )
    if (res.status === 498) {
      signIn()
      return
    }
    getComments()
    setCommentValue('')
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
    console.log(data)
    setQuote(data.quote)
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
    } else {
      setOwner(false)
    }
    getComments()
  }
  useEffect(() => {
    if (loading) return
    if (!router.isReady || !session) return
    getRoomData()
  }, [session, loading, router.isReady, router.query])
  return (
    <>
      {page_loading ? (
        <RoomSkeleton loading={page_loading} />
      ) : (
        <Container>
          <Title align="center" mt={12} mb={24}>
            Welcome to {name}'s room!
          </Title>
          <Container display="flex" sx={{ flexDirection: 'row' }} mb={16}>
            <Card>
              <Card.Section>
                <Image
                  src="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
                  height={160}
                  alt="Norway"
                />
              </Card.Section>
              <Blockquote cite={name}>
                {quote}
              </Blockquote>
            </Card>
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
          </Container>
          <Box sx={{ height: '250px', overflowY: 'scroll', mx: 16, mb: 16 }}>
            {owner ? (
              <>
                <Text>Comments for you</Text>
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
            ) : (
              <>
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
                  disabled={comments.length > 0 && !edit_comment}
                />
                <Button
                  my={12}
                  mx={16}
                  onClick={(e) => {
                    e.preventDefault()
                    if (edit_comment) {
                      editComment()
                      setEditComment(false)
                    } else {
                      postComment()
                    }
                  }}
                  disabled={comments.length > 0 && !edit_comment}
                >
                  Post Comment
                </Button>
                <Text>Your Comment to {name}</Text>
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
                          <ActionIcon
                            variant="transparent"
                            color="red"
                            onClick={deleteComment}
                          >
                            <IconTrash />
                          </ActionIcon>
                        </td>
                        <td>
                          <ActionIcon
                            variant="transparent"
                            color="blue"
                            onClick={(e) => {
                              e.preventDefault()
                              setCommentValue(comment.comment)
                              setEditComment(true)
                            }}
                          >
                            <IconEdit />
                          </ActionIcon>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </>
            )}
          </Box>
        </Container>
      )}
    </>
  )
}

Room.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}
