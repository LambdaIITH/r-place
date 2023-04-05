import { useRef, useEffect } from "react";
import { colorPalette } from "./Palette";
import styles from "./Canvas.module.css";
import { Box } from "@mantine/core";
export default function Canvas({ setX, setY, setCurrent, colors, cellSize }) {
  const canvasRef = useRef(null);

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
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <canvas
        className={styles.canvas}
        ref={canvasRef}
        width={cellSize * 100}
        height={cellSize * 100}
      />
    </Box>
  );
}
