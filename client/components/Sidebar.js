import React from "react";
import {
  useMantineTheme,
  Text,
  Aside,
  Card,
  Button,
  Stack,
  Group,
  Badge,
} from "@mantine/core";
import { IconCircleCheck } from "@tabler/icons-react";

export default function Sidebar(props) {
  const theme = useMantineTheme();

  return (
    <Aside
      p="md"
      hiddenBreakpoint="sm"
      width={{ sm: 300 }}
      hidden={!props.opened}
      sx={{
        backgroundColor: "#1C2128",
      }}
    >
      <Stack spacing="md">
        <Card
          shadow="sm"
          radius="md"
          sx={{
            margin: "2rem auto",
            backgroundColor: "#373A40",
            width: "100%",
          }}
        >
          <Card.Section>
            <div
              style={{
                backgroundColor: `${
                  props.selected ? `{props.selected}` : `blue`
                }`,
                height: "200px",
                width: "200px",
                margin: "0 auto",
              }}
            ></div>
          </Card.Section>
          <Group mt="md" mb="xs" fullWidth>
            <Text
              variant="gradient"
              gradient={{ from: "#D6336C", to: "#AE3EC9", deg: 45 }}
              weight={500}
              size={15}
            >
              Coordinates
            </Text>
            <Badge color="pink" variant="light">
              ({props.x}, {props.y})
            </Badge>
          </Group>

          <Text size="xs" color="dimmed">
            Last Modified by: MistyRavager
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
            backgroundColor: "#373A40",
            width: "100%",
          }}
        >
          <Card.Section>
            <div
              style={{
                backgroundColor: `${props.chosen}`,
                height: "200px",
                width: "200px",
                margin: "0 auto",
              }}
            ></div>
          </Card.Section>
          <Button variant="light" color="green" mt="md" radius="md" fullWidth>
            <Group fullWidth>
              <Text>Save Pixel</Text>
              <IconCircleCheck size={20} />
            </Group>
          </Button>
        </Card>
      </Stack>
    </Aside>
  );
}
