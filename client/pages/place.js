import { useState, useRef, useEffect } from "react";
import { AppShell, Text, useMantineTheme } from "@mantine/core";
import { Nav } from "../components/Header";
import Sidebar from "../components/Sidebar";
import Canvas from "../components/Canvas";
import { colorPalette } from "../components/Palette";

export default function Place() {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const [chosen, setChosen] = useState(""); // from 14 color palette
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [current, setCurrent] = useState(""); // current color of chosen pixel from canvas
  const cellSize = 5; // Size of each grid cell
  const [colors, setColors] = useState([]);
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
  );
}
