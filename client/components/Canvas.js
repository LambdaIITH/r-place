import { useRef, useEffect } from "react";
import { colorPalette } from "./Palette";
import styles from "./Canvas.module.css";
import { Box, Button, createStyles, rem, Stack } from "@mantine/core";
import { IconFileDownload } from "@tabler/icons-react";

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

export default function Canvas({ setX, setY, setCurrent, colors, cellSize }) {
  const canvasRef = useRef(null);
  const { classes, cx } = useStyles();
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
    for (let x = 0; x < 100; x++) {
      for (let y = 0; y < 100; y++) {
        context.fillStyle = colorPalette[colors[x * 100 + y]];
        context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
  }, [colors, cellSize]);

  useEffect(() => {
    function getCursorPosition(canvas, event) {
      const rect = canvas.getBoundingClientRect();
      const temp_y = event.clientX - rect.left;
      const temp_x = event.clientY - rect.top;
      const x = (temp_x - (temp_x % cellSize)) / cellSize;
      const y = (temp_y - (temp_y % cellSize)) / cellSize;
      setX(x);
      setY(y);
      setCurrent(colorPalette[colors[y * 100 + x]]);
    }
    const canvasListener = document.querySelector("canvas");
    canvasListener.addEventListener("mousedown", function (e) {
      getCursorPosition(canvasListener, e);
    });
  }, [setX, setY, setCurrent, colors, cellSize]);

  return (
    <Stack
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button
        className={classes.button}
        onClick={() => {
          handleDownload();
        }}
      >
        Download <IconFileDownload />{" "}
      </Button>
      <canvas
        className={styles.canvas}
        ref={canvasRef}
        width={cellSize * 100}
        height={cellSize * 100}
      />
    </Stack>
  );
}
