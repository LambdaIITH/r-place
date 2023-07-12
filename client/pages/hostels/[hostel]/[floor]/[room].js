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
  Modal,
  MediaQuery,
  Stack,
} from '@mantine/core'
import { useEffect, useState } from 'react'
import Layout from '../../../../components/layouts/hostel_layout'
import { useSession, signIn } from 'next-auth/react'
import { IconTrash, IconEdit } from '@tabler/icons-react'
import RoomSkeleton from '../../../../components/skeletons/Room'
import ReactPanZoom from 'react-image-pan-zoom-rotate'

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
  const { classes, cx } = useStyles()
  const [page_loading, setPageLoading] = useState(true)
  const { data: session, loading } = useSession({ required: true }) // Need to be logged in to view this page

  // User Data
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [quote, setQuote] = useState('')
  const [commentValue, setCommentValue] = useState('')
  const [owner, setOwner] = useState(false)
  const [comments, setComments] = useState([])
  const [edit_comment, setEditComment] = useState(false) // To check if the user is editing a comment, hence change the API call


  // Booleans for presence of dp, meme and gang images
  const [image, setImage] = useState(false);
  const [meme, setMeme] = useState(false);
  const [gang, setGang] = useState(false);


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
      // Token expired
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
      // Token expired
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
    //   if (session?.user?.email === email) {
    //     console.log('You are the owner')
    //     setComments([
    //       {
    //         from_user: 'No one@iith.ac.in',
    //         comment: 'You are a great person!, No more comments yet!',
    //       },
    //     ])
    //     return
    //   }
    // }

    setOwner(owner)
    setComments(data)
    setPageLoading(false) // Page is loaded since we have everything we need
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


  // Get the room data, runs when there is a room change
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

  async function checkImages() {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_PICTURE_URL}/photo_${email.replace('@iith.ac.in', '')}.webp`
    )
    if (res.status == 200) {
      setImage(true)
    }
    else {
      setImage(false)
    }


    const res2 = await fetch(
      `${process.env.NEXT_PUBLIC_PICTURE_URL}/meme_${email.replace('@iith.ac.in', '')}.webp`
    )
    if (res2.status == 200) {
      setMeme(true)
    }
    else{
      setMeme(false)
    }

    const res3 = await fetch(
      `${process.env.NEXT_PUBLIC_PICTURE_URL}/gang_${email.replace('@iith.ac.in', '')}.webp`
    )
    if (res3.status == 200) {
      setGang(true)
    }
    else{
      setGang(false)
    }

  }
  useEffect(() => {
    if (loading) return // Don't do anything if the session is loading
    if (!router.isReady || !session) return // Don't do anything if the router is not ready or session is not present
    getRoomData()
  }, [session, loading, router.isReady, router.query])

  useEffect(()=>{
    if (email == "") return;
    checkImages()
  },[email])

  return (
    <>
      {page_loading ? (
        <RoomSkeleton loading={page_loading} />
      ) : (
        <>
          <MediaQuery smallerThan={'md'} styles={{ display: 'none' }}>
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
                  Welcome to {name}{"'"}s room!
                </Text>
              </Title>

              <Container display="flex" sx={{ flexDirection: 'row' }} mb={16}>
                <Card mr={40} sx={{ width: '800px' }}>
                  <Card.Section
                    sx={{
                      width: '300px',
                      height: '300px',
                      overflow: 'hidden',
                      margin: 'auto',
                    }}
                  >
                    {image ? (
                      <ReactPanZoom
                        image={`${process.env.NEXT_PUBLIC_PICTURE_URL}/photo_${email.replace('@iith.ac.in', '')}.webp`}
                        alt="Image not loaded"
                      />
                    ) : (
                      <Image
                        src="https://www.pngitem.com/pimgs/m/30-307416_profile-icon-png-image-free-download-searchpng-employee.png"
                        alt="Your Image"
                        width={300}
                        height={300}
                        m={'auto'}
                      />
                    )}
                  </Card.Section>
                  <Blockquote cite={<Text size={12}>{name}</Text>}>
                    <Text size={13}>{quote}</Text>
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
                  draggable={false}
                >
                  {questions.map(function (question, index) {
                    if (answers[index] != '') {
                      return (
                        <Carousel.Slide key={index} className={classes.slide}>
                          <Text className={classes.question}>{question} </Text>
                          <Text className={classes.answer}>
                            {answers[index]}
                          </Text>
                        </Carousel.Slide>
                      )
                    }
                  })}
                  {meme && (
                    <Carousel.Slide className={classes.slide} >
                      <Text className={classes.question} align="center">
                        College as a {'<'} Meme{'>'}
                      </Text>
                      <Box 
                      sx={{
                        width: '300px',
                        height: '300px',
                        overflow: 'hidden',
                        margin: 'auto',
                      }}
                      >
                      <ReactPanZoom
                        image={`${process.env.NEXT_PUBLIC_PICTURE_URL}/meme_${email.replace('@iith.ac.in', '')}.webp`}
                        alt="Image not loaded"
                      />
                      </Box>
                      <Text className={classes.question} align="center">
                        {'</'}Meme{'>'}
                      </Text>
                    </Carousel.Slide>
                  )}
                  {gang && (
                    <Carousel.Slide className={classes.slide}>
                      <Text className={classes.question} align="center">
                        {'<'}Gang{'>'}
                      </Text>
                      <Box 
                      sx={{
                        width: '300px',
                        height: '300px',
                        overflow: 'hidden',
                        margin: 'auto',
                      }}
                      >
                      <ReactPanZoom
                        image={`${process.env.NEXT_PUBLIC_PICTURE_URL}/gang_${email.replace('@iith.ac.in', '')}.webp`}
                        alt="Image not loaded"
                      />
                      </Box>
                      <Text className={classes.question} align="center">
                        {'</'}Gang{'>'}
                      </Text>
                    </Carousel.Slide>
                  )}
                </Carousel>
              </Container>
              <Box
                sx={{ height: '250px', overflowY: 'scroll', mx: 16, mb: 16 }}
              >
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
          </MediaQuery>
          <MediaQuery largerThan={'md'} styles={{ display: 'none' }}>
            <Container>
              <Title align="center" mt={12} mb={24}>
                <Text
                  variant="gradient"
                  gradient={{ from: 'indigo', to: 'cyan', deg: 45 }}
                  ta="center"
                  sx={{
                    fontSize: '1.5rem',
                  }}
                  fw={700}
                >
                  Welcome to {name}'s room!
                </Text>
              </Title>
              <Container display="flex" sx={{ flexDirection: 'row' }} mb={16}>
                <Stack>
                  <Card sx={{ width: '100%' }}>
                  <Card.Section
                    sx={{
                      width: '200px',
                      height: '200px',
                      overflow: 'hidden',
                      margin: 'auto',
                    }}
                  >
                    {image ? (
                      <ReactPanZoom
                        image={`${process.env.NEXT_PUBLIC_PICTURE_URL}/photo_${email.replace('@iith.ac.in', '')}.webp`}
                        alt="Image not loaded"
                      />
                    ) : (
                      <Image
                        src="https://www.pngitem.com/pimgs/m/30-307416_profile-icon-png-image-free-download-searchpng-employee.png"
                        alt="Your Image"
                        width={300}
                        height={300}
                        m={'auto'}
                      />
                    )}
                  </Card.Section>
                  <Blockquote cite={<Text size={12}>{name}</Text>}>
                    <Text size={13}>{quote}</Text>
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
                    {meme && (
                    <Carousel.Slide className={classes.slide}>
                      <Text className={classes.question} align="center">
                        {'<'}Meme{'>'}
                      </Text>
                      <Box 
                      sx={{
                        width: '200px',
                        height: '200px',
                        overflow: 'hidden',
                        margin: 'auto',
                      }}
                      >
                      <ReactPanZoom
                        image={`${process.env.NEXT_PUBLIC_PICTURE_URL}/meme_${email.replace('@iith.ac.in', '')}.webp`}
                        alt="Image not loaded"
                      />
                      </Box>
                      <Text className={classes.question} align="center">
                        {'</'}Meme{'>'}
                      </Text>
                    </Carousel.Slide>
                    )}
                    {gang && (
                    <Carousel.Slide className={classes.slide}>
                      <Text className={classes.question} align="center">
                        {'<'}Gang{'>'}
                      </Text>
                      <Box 
                      sx={{
                        width: '200px',
                        height: '200px',
                        overflow: 'hidden',
                        margin: 'auto',
                      }}
                      >
                      <ReactPanZoom
                        image={`${process.env.NEXT_PUBLIC_PICTURE_URL}/meme_${email.replace('@iith.ac.in', '')}.webp`}
                        alt="Image not loaded"
                      />
                      </Box>
                      <Text className={classes.question} align="center">
                        {'</'}Gang{'>'}
                      </Text>
                    </Carousel.Slide>
                    )}
                  </Carousel>
                </Stack>
              </Container>
              <Box
                sx={{ height: '250px', overflowY: 'scroll', mx: 16, mb: 16 }}
              >
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
          </MediaQuery>
        </>
      )}
    </>
  )
}

Room.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}
