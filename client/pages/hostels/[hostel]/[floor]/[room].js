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
  carousel: {
    backgroundColor: theme.colors.blue[0],
  },
  slide: {
    padding: '2rem',
    backgroundColor: theme.colors.blue[0],
  },
  question: {
    fontSize: '16px',
    fontWeight: 600,
  },
  answer: {
    fontSize: '15px',
  },
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
    getComments(owner)
    setCommentValue('')
  }

  async function getComments(owner) {
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

    // if (data.length === 0) {
      // if (session?.user?.email === email) {
        // console.log('You are the owner')
        // setComments([
        //   {
        //     from_user: 'No one@iith.ac.in',
        //     comment: 'You are a great person!, No more comments yet!',
        //   },
        // ])
        // return
      // }
    // }

    setOwner(owner)
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
    getComments(owner)
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
    getComments(owner)
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
    setQuote(data.quote)
    const questions = []
    const answers = []
    for (var key in data.form_response.texts) {
      if (data.form_response.texts.hasOwnProperty(key)) {
        questions.push(key)
        answers.push(data.form_response.texts[key])
      }
    }
    setQuestions(questions)
    setAnswers(answers)
    if (session.user.email === data.email) {
      console.log('You are the owner')
      getComments(true)
    } else {
      console.log('Not the owner')
      getComments(false)
    }
  }
  useEffect(() => {
    if (loading) return
    if (!router.isReady || !session) return
    getRoomData()
    console.log('here')
  }, [session, loading, router.isReady, router.query])
  useEffect(()=>{
    console.log('1')
  },[session])
  return (
    <>
      {page_loading ? (
        <RoomSkeleton loading={page_loading} />
      ) : (
        <Container>
          <Title align="center" mt={12} mb={24}>
            <Text
              variant="gradient"
              gradient={{ from: 'indigo', to: 'cyan', deg: 45 }}
              ta="center"
              sx={{
                fontSize: '2rem',
              }}
              fw={700}
            >
              Welcome to {name}'s room!
            </Text>
          </Title>
          <Container display="flex" sx={{ flexDirection: 'row' }} mb={16}>
            <Card mr={40} sx={{ width: '800px' }}>
                <Card.Section >
                    <Image
                      src={`${process.env.NEXT_PUBLIC_PICTURE_URL}/imgs/photo_${email.replace("@iith.ac.in","")}.webp`}
                      alt="Your Image"
                      width={300}
                      height={300}
                      m={'auto'}
                    />
                </Card.Section>
                  <Blockquote cite={<Text size={12}>{name}</Text>}>
                    <Text size={13} >{quote}</Text>
                  </Blockquote>
            </Card>
            <Carousel
              maw={400}
              mx="auto"
              withIndicators
              slideGap="md"
              align="start"
              loop
              className={classes.carousel}
            >
              {questions.map((question, index) => (
                <Carousel.Slide key={index} className={classes.slide}>
                  <Text className={classes.question}>{question} </Text>
                  <Text className={classes.answer}>{answers[index]}</Text>
                </Carousel.Slide>
              ))}
              <Carousel.Slide className={classes.slide}>
                <Text className={classes.question} align='center'>{'<'}Meme{'>'}</Text>
                <Image
                  src={`${process.env.NEXT_PUBLIC_PICTURE_URL}/imgs/meme_${email.replace("@iith.ac.in","")}.webp`}
                  alt="Meme"
                  width={300}
                  height={300}
                  m={'auto'}
                />
                <Text className={classes.question} align='center'>{'</'}Meme{'>'}</Text>
              </Carousel.Slide>
              <Carousel.Slide className={classes.slide}>
                <Text className={classes.question} align='center'>{'<'}Gang{'>'}</Text>
                <Image
                  src={`${process.env.NEXT_PUBLIC_PICTURE_URL}/imgs/gang_${email.replace("@iith.ac.in","")}.webp`}
                  alt="Meme"
                  width={300}
                  // height={300}
                  m={'auto'}
                />
                <Text className={classes.question} align='center'>{'</'}Gang{'>'}</Text>

              </Carousel.Slide>
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
