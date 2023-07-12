import React from "react";
import {
  Text,
  Aside,
  Card,
  Button,
  Stack,
  Group,
  Badge,
  MediaQuery,
  Box,
} from "@mantine/core";
import { IconCircleCheck } from "@tabler/icons-react";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Sidebar(props) {
  const { data: session, status } = useSession();
  function handleClick() {
    props.postPixel();
  }
  return (
    <>
      <MediaQuery smallerThan="lg" styles={{ display: "none" }}>
        <Aside
          p="md"
          hiddenBreakpoint="sm"
          width={{ sm: 250 }}
          hidden={!props.opened}
        >
          <Stack spacing="sm">
            <Card
              shadow="md"
              radius="md"
              sx={{
                margin: "1rem auto",
                width: "100%",
              }}
            >
              <Card.Section>
                <div
                  style={{
                    backgroundColor: `${props?`${props?.current}`:`white`}`,
                    height: "150px",
                    width: "150px",
                    margin: "0 auto",
                  }}
                ></div>
              </Card.Section>
              <Group mt="md" mb="xs">
                <Text
                  variant="gradient"
                  gradient={{ from: "#D6336C", to: "#AE3EC9", deg: 45 }}
                  weight={500}
                  size={15}
                >
                  Coordinates
                </Text>
                <Badge color="pink" variant="light">
                  ({props.row}, {props.col})
                </Badge>
              </Group>

              <Text size="xs" color="dimmed">
                Last Modified by: {props?.last_updated_by}
                <Text weight={500} color="dark">
                  {props.lastModified}
                </Text>
              </Text>
            </Card>
            <Card
              shadow="sm"
              padding="lg"
              radius="md"
              sx={{
                margin: "0 auto",
                width: "100%",
              }}
            >
              <Card.Section>
                <div
                  style={{
                    backgroundColor: `${props?`${props?.chosen}`:`white`}`,
                    height: "150px",
                    width: "150px",
                    margin: "0 auto",
                  }}
                ></div>
              </Card.Section>
              {status === "authenticated" ? (
                <>
                  <Button
                    variant="light"
                    color="green"
                    mt="md"
                    radius="md"
                    fullWidth
                    onClick={handleClick}
                  >
                    <Group>
                      <Text>Save Pixel</Text>
                      <IconCircleCheck size={20} />
                    </Group>
                  </Button>
                  <Button
                    variant="light"
                    color="red"
                    mt="md"
                    radius="md"
                    fullWidth
                    onClick={() => {
                      signOut({callbackUrl:"/"});
                    }}
                  >
                    <Group>
                      <Text>Logout</Text>
                    </Group>
                  </Button>
                </>
              ) : (
                <Button
                  variant="light"
                  color="green"
                  mt="md"
                  radius="md"
                  fullWidth
                  onClick={() => {
                    signIn();
                  }}
                >
                  <Group>
                    <Text>Sign In</Text>
                  </Group>
                </Button>
              )}
            </Card>
          </Stack>
        </Aside>
      </MediaQuery>
      <MediaQuery largerThan="lg" styles={{ display: "none" }}>
        <Box>
          <Box
            spacing="lg"
            sx={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <Card
              shadow="md"
              radius="md"
              sx={{
                margin: "1rem auto",
                width: "100%",
              }}
            >
              <Card.Section>
                <div
                  style={{
                    backgroundColor: `${props?`${props?.current}`:`white`}`,
                    height: "80px",
                    width: "80px",
                    margin: "0 auto",
                  }}
                ></div>
              </Card.Section>
              <Group mt="md" mb="xs">
                <Text
                  // variant="light"
                  // gradient={{ from: "#D6336C", to: "#AE3EC9", deg: 45 }}
                  weight={500}
                  size={10}
                >
                  Coordinates
                  <Badge
                    color="pink"
                    variant="light"
                    sx={{ fontSize: "7px", marginTop: "-10px" }}
                    size={5}
                  >
                    ({props.row}, {props.col})
                  </Badge>
                </Text>
              </Group>

              <Text size="8px" color="dimmed">
                Last Modified by: {props?.last_updated_by}
                <Text weight={500} color="dark">
                  {props.lastModified}
                </Text>
              </Text>
            </Card>
            <Card
              shadow="md"
              padding="lg"
              radius="md"
              sx={{
                margin: "1rem auto",
                width: "100%",
              }}
            >
              <Card.Section>
                <div
                  style={{
                    backgroundColor:  `${props?`${props?.chosen}`:`white`}`,
                    height: "80px",
                    width: "80px",
                    margin: "0 auto",
                  }}
                ></div>
              </Card.Section>
              <Group mt="md" mb="xs">
                <Text
                  variant="gradient"
                  gradient={{ from: "#D6336C", to: "#AE3EC9", deg: 45 }}
                  weight={500}
                  size={10}
                  align="center"
                >
                  Current selected color
                </Text>
              </Group>
            </Card>
          </Box>
          {status === "authenticated" ? (
                <>
                  <Button
                    variant="light"
                    color="green"
                    mt="md"
                    radius="md"
                    fullWidth
                    onClick={handleClick}
                  >
                    <Group>
                      <Text>Save Pixel</Text>
                      <IconCircleCheck size={20} />
                    </Group>
                  </Button>
                  <Button
                    variant="light"
                    color="red"
                    mt="md"
                    radius="md"
                    fullWidth
                    onClick={() => {
                      signOut();
                    }}
                  >
                    <Group>
                      <Text>Logout</Text>
                    </Group>
                  </Button>
                </>
              ) : (
                <Button
                  variant="light"
                  color="green"
                  mt="md"
                  radius="md"
                  fullWidth
                  onClick={() => {
                    signIn();
                  }}
                >
                  <Group>
                    <Text>Sign In</Text>
                  </Group>
                </Button>
              )}
        </Box>
      </MediaQuery>
    </>
  );
}
