import { Box, Button, Image } from '@mantine/core'
import React from 'react'

const hostelMap = () => {
  return (
    <Box>
      <Box
        sx={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          padding: '10px',
        }}
      >
        <Grid columns={24}>
          {visibility.map((item, index) => {
            return (
              <>
                {index < 8 ? (
                  <>
                    <Grid.Col key={index} span={3}>
                      <Box
                        onMouseEnter={() => handleHover(index, true)}
                        onMouseLeave={() => handleHover(index, false)}
                        sx={{
                          alignContent: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Button
                          style={{
                            visibility: visibility[index]
                              ? 'visible'
                              : 'hidden',
                            margin: '0 auto',
                            display: 'block',
                          }}
                          className={classes.button}
                          onClick={() => {
                            open()
                            setHostel(
                              index < 4 ? hostels[index] : hostels[11 - index]
                            )
                          }}
                        >
                          Hostel{' '}
                          {index < 4 ? hostels[index] : hostels[11 - index]}
                        </Button>
                      </Box>
                    </Grid.Col>
                    {(index + 1) % 4 == 0 ? (
                      <Grid.Col span={24}></Grid.Col>
                    ) : (
                      <Grid.Col span={3}></Grid.Col>
                    )}
                  </>
                ) : null}
              </>
            )
          })}
        </Grid>

        <Grid columns={10}>
          {visibility.slice(8, 10).map((item, index) => {
            return (
              <Grid.Col
                key={index}
                span={3}
                offset={2}
                onMouseEnter={() => handleHover(index + 8, true)}
                onMouseLeave={() => handleHover(index + 8, false)}
              >
                <Button
                  style={{
                    visibility: visibility[index + 8] ? 'visible' : 'visible',
                  }}
                  className={classes.button}
                  onClick={() => {
                    open()
                    setHostel(hostels[index + 8])
                  }}
                >
                  Hostel {hostels[index + 8]}
                </Button>
              </Grid.Col>
            )
          })}
        </Grid>
        <Modal opened={opened} onClose={close} title="Floor Number" centered>
          <Box
            sx={{
              alignItems: 'center',
              width: '200px',
              margin: 'auto',
              padding: '30px 10px 30px 10px',
              border: '1px solid #ccc',
            }}
          >
            <Stack spacing="xs">
              {Array.from(Array(6), (x, i) => i).map((item, index) => {
                return (
                  <Button
                    component="a"
                    href={`/hostels/${hostel}/${index + 1}`}
                  >
                    {index + 1}
                  </Button>
                )
              })}
            </Stack>
          </Box>
        </Modal>
      </Box>
    </Box>
  )
}

export default hostelMap
