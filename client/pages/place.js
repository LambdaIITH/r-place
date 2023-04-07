import { useState, useRef, useEffect } from "react";
import {
  AppShell,
  Box,
  Button,
  Drawer,
  Group,
  MediaQuery,
  Menu,
  Notification,
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
import { IconX } from "@tabler/icons-react";
export default function Place() {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const [chosen, setChosen] = useState(""); // from 14 color palette

  const [col, setCol] = useState(0);
  const [row, setRow] = useState(0);

  const [current, setCurrent] = useState(""); // current color of chosen pixel from canvas
  const cellSize = 8; // Size of each grid cell
  const [colors, setColors] = useState([]);
  const [cooldown, setCooldown] = useState(0);
  const gridSize = 80;
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
      const colors = [];
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          colors.push(temp.grid[i][j]);
        }
      }
      setColors(colors);
    } catch (err) {
      console.log(err);
    }
  }
  async function postPixel() {
    try {
      const response = await fetch(
        `http://localhost:8000/pixel/${row}/${col}/${colorPalette.indexOf(
          chosen
        )}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "http://127.0.0.1:3000",
          },
        }
      );
      const temp = await response.json();
      console.log(temp);
      if (response.status === 429) {
        setCooldown(temp.cooldown);
      } else {
        setNew();
      }
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
    loadCanvas();
  }, []);
  function setNew() {
    const newColors = [...colors];
    newColors[row * gridSize + col] = colorPalette.indexOf(chosen);
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
              col={col}
              row={row}
              current={current}
              setNew={postPixel}
            />
          }
          header={<Nav setOpened={setOpened} setChosen={setChosen} />}
        >
          {cooldown ? (
            <Notification
              icon={<IconX size={"1.1rem"} />}
              withCloseButton={true}
              onClose={(e) => {
                setCooldown(false);
              }}
              color="red"
              sx={{ marginBottom: "10px" }}
            >
              Pixel update failed. Please try again after {cooldown} seconds.
            </Notification>
          ) : (
            <></>
          )}
          <Canvas
            setCol={setCol}
            setRow={setRow}
            setCurrent={setCurrent}
            colors={colors}
            cellSize={cellSize}
          />
        </AppShell>
      </MediaQuery>
      <MediaQuery largerThan="lg" styles={{ display: "none" }}>
        <Box
          sx={{
            height: "100vh",
            // overflow: "auto",
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              // padding: "10px 20px",
              // position: "absolute",
              // top: "0",
              // left: "50%",
              // transform: "translate(-50%, 0%)",
              width: "100%",
              backgroundColor: "rgba(255, 255, 255)",
              padding: "10px",
            }}
          >
            <Box />
            <Title
              variant="gradient"
              gradient={{ from: "#D6336C", to: "#AE3EC9", deg: 45 }}
              sx={{ fontSize: "1.8rem" }}
            >
              r/IITH-2023
            </Title>
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <Button>menu</Button>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item>Basic</Menu.Item>
                <Menu.Item>Hostels</Menu.Item>
                <Menu.Item>Acads</Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Box>
          <Box
            sx={{
              paddign: "0 100px",
              // marginTop: "5rem",
              height: "82%",
              width: "50%",
              margin: "0 auto",
              paddingLeft: "300px",
              // width: "100%",
              // position: "absolute",
              // top: "0",
              // transform: "translate(-50%, 0%)",
              overflow: "auto",
              // left: "50%",
            }}
          >
            {cooldown ? (
              <Notification
                icon={<IconX size={"1.1rem"} />}
                withCloseButton={true}
                onClose={(e) => {
                  setCooldown(false);
                }}
                color="red"
                sx={{ marginBottom: "10px" }}
              >
                Pixel update failed. Please try again after {cooldown} seconds.
              </Notification>
            ) : (
              <></>
            )}
            <Canvas
              setCol={setCol}
              setRow={setRow}
              setCurrent={setCurrent}
              colors={colors}
              cellSize={cellSize}
              paletteOpen={open_d}
            />
            {/* <Box
              sx={{
                height: "85vh",
              }}
            ></Box> */}
          </Box>

          <Box
            sx={{
              width: "100%",
              // position: "absolute",
              // bottom: "0",
              // left: "50%",
              // transform: "translate(-50%, 0%)",
              backgroundColor: "rgba(255, 255, 255)",
              padding: "10px",
            }}
          >
            <Button
              onClick={open_d}
              sx={{
                margin: "0 auto",
                display: "flex",
                width: "80%",
                justifyContent: "center",
              }}
            >
              Open Drawer
            </Button>
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
                x={col}
                y={row}
                current={current}
                setNew={setNew}
              />
            </Box>
          </Drawer>
        </Box>
      </MediaQuery>
    </>
  );
}
