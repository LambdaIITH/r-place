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
  const [opened_m, { toggle: toggle_m }] = useDisclosure(false);
  const label = opened_m ? "Close navigation" : "Open navigation";

  // mobile devices - bottom drawer
  const [opened_d, { open: open_d, close: close_d }] = useDisclosure(false);

  async function loadCanvas() {
    try {
      console.log("loading canvas");
      const response = await fetch(`http://localhost:8000/full_grid`, {
        method: "GET",
      });
      const temp = await response.json();
      // setColors(temp[0]);
      console.log(temp);
    } catch (err) {
      console.log(err);
    }
  }
  async function postPixel() {
    try {
      const response = await fetch(
        `http://localhost:8000/pixel/${x}/${y}/${chosen}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const temp = await response.json();
      // TODO: check for the response do the timer thing
      console.log(temp);
      setNew();
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
    const colors = [];
    for (let i = 0; i < 100; i++) {
      for (let j = 0; j < 100; j++) {
        colors.push(Math.floor(Math.random() * colorPalette.length));
      }
    }
    console.log(colors);
    setColors(colors);
    loadCanvas();
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
            <Sidebar
              opened={opened}
              chosen={chosen}
              x={x}
              y={y}
              current={current}
              setNew={setNew}
            />
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
        <Box sx={{ height: "100vh", overflow: "auto" }}>
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
            <Burger
              opened={opened_m}
              onClick={toggle_m}
              aria-label={label}
            ></Burger>
          </Box>
          <Box>
            <Canvas
              setX={setX}
              setY={setY}
              setCurrent={setCurrent}
              colors={colors}
              cellSize={cellSize}
              paletteOpen={open_d}
            />
          </Box>

          <Drawer opened={opened_d} onClose={close_d}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "2rem",
              }}
            >
              <Title
                variant="gradient"
                gradient={{ from: "#D6336C", to: "#AE3EC9", deg: 45 }}
                order={2}
                sx={{ textAlign: "center" }}
              >
                Pallete
              </Title>
              <Nav setOpened={setOpened} setChosen={setChosen} />
              <Sidebar
                opened={opened}
                chosen={chosen}
                x={x}
                y={y}
                current={current}
                setNew={setNew}
              />
            </Box>
          </Drawer>

          <Box>
            <Button onClick={open_d}>Open Drawer</Button>
          </Box>
        </Box>
      </MediaQuery>
    </>
  );
}
