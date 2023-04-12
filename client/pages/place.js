import { useState, useEffect, useContext } from "react";
import {
  AppShell,
  Box,
  Button,
  Drawer,
  MediaQuery,
  Menu,
  Notification,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { Nav } from "../components/Header";
import Sidebar from "../components/Sidebar";
import Canvas from "../components/Canvas";
import { useDisclosure } from "@mantine/hooks";
import { IconX } from "@tabler/icons-react";
import AppContext from "../AppContext";
import Head from "next/head";
import { useSession } from "next-auth/react";

export default function Place() {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);

  const { data: session } = useSession();
  const value = useContext(AppContext);
  let globalData = value.state.globalData;
  let { colorPalette, gridSize, pollingInterval } = globalData;

  // props for sidebar
  const [col, setCol] = useState(0);
  const [row, setRow] = useState(0);
  const [last_updated_by, setLastUpdatedBy] = useState("");

  // props for canvas
  const [chosen, setChosen] = useState(""); // from 14 color palette
  const [current, setCurrent] = useState(""); // current color of chosen pixel from canvas
  const [colors, setColors] = useState([]);
  const [cooldown, setCooldown] = useState(0);

  // mobile devices - bottom drawer
  const [opened_d, { open: open_d, close: close_d }] = useDisclosure(false);

  // might break here, check what happens if pixel_logs table empty
  const [last_update, setLastUpdate] = useState(0);

  async function loadCanvas() {
    try {
      console.log("loading canvas");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/full_grid`,
        {
          method: "GET",
        }
      );
      const temp = await response.json();
      const colors = [];
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          colors.push(temp.grid[i][j]);
        }
      }
      setColors(colors);
      setLastUpdate(temp["last update"]);
    } catch (err) {
      console.log(err);
    }
  }
  async function postPixel() {
    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL
        }/pixel/${row}/${col}/${colorPalette.indexOf(chosen)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "http://127.0.0.1:3000",
            Authorization: `${session?.id_token}`,
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
  async function getUpdates(colors) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/updates/${last_update}`,
        {
          method: "GET",
        }
      );
      const temp = await response.json();
      const updates = temp.updates;
      for (let i = 0; i < updates.length; i++) {
        const newColors = [...colors];
        newColors[updates[i].row * gridSize + updates[i].col] =
          updates[i].color;
        setColors(newColors);
      }
      console.log(updates);
      setLastUpdate(temp["last update"]);
    } catch (err) {
      console.log(err);
    }
  }

  async function getPixelHistory() {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/pixel/${row}/${col}/history`,
        {
          method: "GET",
        }
      );
      const temp = await response.json();
      setLastUpdatedBy(temp[0].email);
    } catch (err) {
      console.log(err);
      setLastUpdatedBy("None ㋡");
    }
  }

  function setNew() {
    const newColors = [...colors];
    newColors[row * gridSize + col] = colorPalette.indexOf(chosen);
    setColors(newColors);
    setCurrent(chosen);
  }

  useEffect(() => {
    loadCanvas();
  }, []);

  useEffect(() => {
    getPixelHistory();
  }, [row, col]);

  useEffect(() => {
    const interval = setInterval(() => {
      getUpdates(colors);
      console.log("getting updates");
    }, pollingInterval);
    return () => clearInterval(interval);
  }, [colors]);

  return (
    <>
      <Head>
        <title>r/IITH</title>
      </Head>
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
              postPixel={postPixel}
              last_updated_by={last_updated_by}
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
              Pixel update failed. Please try again after{" "}
              {Math.floor(cooldown * 100) / 100} seconds.
            </Notification>
          ) : (
            <></>
          )}
          <Canvas
            setCol={setCol}
            setRow={setRow}
            setCurrent={setCurrent}
            colors={colors}
          />
        </AppShell>
      </MediaQuery>
      <MediaQuery largerThan="lg" styles={{ display: "none" }}>
        <Box
          sx={{
            height: "100vh",
            // overflow: "auto",
            width: "100%",
            // backgroundColor: "rgba(0,0,0,0.2)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
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
              height: "20%",
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
                sx={{ marginBottom: "10px", zIndex: "100" }}
              >
                Pixel update failed. Please try again after{" "}
                {Math.floor(cooldown * 100) / 100} seconds.
              </Notification>
            ) : (
              <></>
            )}
            <Canvas
              setCol={setCol}
              setRow={setRow}
              setCurrent={setCurrent}
              colors={colors}
              paletteOpen={open_d}
            />
          </Box>

          <Box
            sx={{
              width: "100%",
              backgroundColor: "rgba(255, 255, 255)",
              padding: "10px",
            }}
          >
            {/* <Button
              onClick={open_d}
              sx={{
                margin: "0 auto",
                display: "flex",
                width: "80%",
                justifyContent: "center",
              }}
            >
              Open Drawer
            </Button> */}
          </Box>
          <Drawer
            opened={opened_d}
            onClose={close_d}
            size="550px"
            position="bottom"
          >
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
                col={col}
                row={row}
                current={current}
                postPixel={postPixel}
                last_updated_by={last_updated_by}
              />
            </Box>
          </Drawer>
        </Box>
      </MediaQuery>
    </>
  );
}
