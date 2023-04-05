import { useState, useRef, useEffect } from "react";
import {
  AppShell,
  Box,
  Button,
  Drawer,
  Group,
  MediaQuery,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { Nav } from "../components/Header";
import Sidebar from "../components/Sidebar";
import Canvas from "../components/Canvas";
import { colorPalette } from "../components/Palette";
import { useDisclosure } from "@mantine/hooks";
import { Burger } from "@mantine/core";

export default function Place() {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const [chosen, setChosen] = useState(""); // from 14 color palette
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [current, setCurrent] = useState(""); // current color of chosen pixel from canvas
  const cellSize = 8; // Size of each grid cell
  const [colors, setColors] = useState([]);
  // mobile devices - hamburger menu bar
  const [opened_menu, { toggle }] = useDisclosure(false);
  const label = opened_menu ? "Close navigation" : "Open navigation";

  // mobile devices - bottom drawer
  const [opened_drawer, { open, close }] = useDisclosure(false);

  useEffect(() => {
    const colors = [];
    for (let i = 0; i < 100; i++) {
      for (let j = 0; j < 100; j++) {
        colors.push(Math.floor(Math.random() * colorPalette.length));
      }
    }
    console.log(colors);
    setColors(colors);
  }, []);

  function setNew() {
    const newColors = [...colors];
    newColors[y * 100 + x] = colorPalette.indexOf(chosen);
    setColors(newColors);
    setCurrent(chosen);
  }
  return (
    <>
      <MediaQuery smallerThan="lg" styles={{ display: "none" }}>
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
            <Sidebar
              opened={opened}
              chosen={chosen}
              x={x}
              y={y}
              current={current}
              setNew={setNew}
            />
            // </MediaQuery>
          }
          header={<Nav setOpened={setOpened} setChosen={setChosen} />}
        >
          <Canvas
            setX={setX}
            setY={setY}
            setCurrent={setCurrent}
            colors={colors}
            cellSize={cellSize}
          />
        </AppShell>
      </MediaQuery>
      <MediaQuery largerThan="lg" styles={{ display: "none" }}>
        <Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Title
              variant="gradient"
              gradient={{ from: "#D6336C", to: "#AE3EC9", deg: 45 }}
              sx={{ fontSize: "1.8rem" }}
            >
              r/IITH-2023
            </Title>
            <Burger opened={opened_menu} onClick={toggle} aria-label={label} />
          </Box>
          <Drawer opened={opened} onClose={close} title="Authentication">
            {/* Drawer content */}
          </Drawer>

          <Box>
            <Button
              onClick={opened_drawer}
              sx={{
                display: "absolute",
                bottom: "0",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              Open Drawer
            </Button>
          </Box>
        </Box>
      </MediaQuery>
    </>
  );
}
