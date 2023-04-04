import { useState } from "react";
import { AppShell, Text, useMantineTheme } from "@mantine/core";
import { Nav } from "../components/Header";
import Sidebar from "../components/Sidebar";

export default function Place() {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const [chosen, setChosen] = useState("");
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

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
        <Sidebar opened={opened} chosen={chosen} x={x} y={y} />
        // </MediaQuery>
      }
      header={<Nav setOpened={setOpened} setChosen={setChosen} />}
    >
      <Text>Canvas</Text>
    </AppShell>
  );
}
