import { useRef, useEffect, useContext } from "react";
import { Box, Button, createStyles, rem, Stack } from "@mantine/core";
import { IconFileDownload } from "@tabler/icons-react";
import AppContext from "../AppContext";
const useStyles = createStyles((theme) => ({
  button: {
    display: "block",
    lineHeight: 1,
    padding: `${rem(8)} ${rem(12)}`,
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    color: theme.colors.green[9],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,
    backgroundColor: theme.colors.green[0],
    "&:hover": {
      backgroundColor: theme.colors.green[5],
    },
  },
}));

export default function Canvas({
  setCol,
  setRow,
  setCurrent,
  colors,
  paletteOpen,
}) {
  const canvasRef = useRef(null);
  const { classes, cx } = useStyles();

  const value = useContext(AppContext);
  let globalData = value.state.globalData;
  let { colorPalette, cellSize } = globalData;

  function handleDownload() {
    const canvas = canvasRef.current;
    const image = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    const link = document.createElement("a");
    link.download = "my-image.png";
    link.href = image;
    link.click();
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Draw the grid
    for (let row = 0; row < 80; row++) {
      for (let col = 0; col < 80; col++) {
        context.fillStyle = colorPalette[colors[row * 80 + col]];
        context.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
      }
    }
  }, [colors, cellSize]);

  return (
    <Stack
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "0 100px",
      }}
    >
      {/* <Button
        className={classes.button}
        onClick={() => {
          handleDownload();
        }}
      >
        Download <IconFileDownload />{" "}
      </Button> */}
      <canvas
        ref={canvasRef}
        width={cellSize * 80}
        height={cellSize * 80}
        onClick={(e) => {
          const canvas = canvasRef.current;
          const rect = canvas.getBoundingClientRect();
          const temp_y = e.clientX - rect.left;
          const temp_x = e.clientY - rect.top;

          const row = (temp_x - (temp_x % cellSize)) / cellSize;
          const col = (temp_y - (temp_y % cellSize)) / cellSize;
          console.log(row, col);
          setCol(col);
          setRow(row);
          setCurrent(colorPalette[colors[row * 80 + col]]);
          if (paletteOpen) {
            paletteOpen();
          }
        }}
      />
    </Stack>
  );
}
