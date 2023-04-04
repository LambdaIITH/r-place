import { useState } from "react";
import { AppShell, Aside, Text, useMantineTheme } from "@mantine/core";
import { Nav } from "../components/Header";

export default function Place() {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const [selected, setSelected] = useState("");
  return (
    <AppShell
      styles={{
        main: {
          background:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      aside={
        // <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
        <Aside
          p="md"
          hiddenBreakpoint="sm"
          width={{ sm: 200, lg: 300 }}
          hidden={!opened}
        >
          <Text>{selected}</Text>
        </Aside>
        // </MediaQuery>
      }
      header={<Nav setOpened={setOpened} setSelected={setSelected} />}
    >
      <Text>Canvas</Text>
    </AppShell>
  );
}
