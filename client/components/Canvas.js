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
      backgroundColor: theme.colors.green[2],
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
  let { colorPalette, cellSize, gridSize } = globalData;

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
  
    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
  
    // Draw the grid
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const x = col * cellSize;
        const y = row * cellSize;
  
        // Draw the border
        context.strokeStyle = "#f0f0f0";
        context.lineWidth = 1;
        context.strokeRect(x, y, cellSize, cellSize);
  
        // Draw the pixel
        context.fillStyle = colorPalette[colors[row * gridSize + col]];
        context.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
      }
    }
  }, [colors, cellSize]);
  

  return (
    <Stack
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // padding: "0 100px",
      }}
    >
      <Box
        sx={{
          // padding: "50px 100px",
          // marginTop: "5rem",
          overflow: "auto",
          height: "10%",
          width: "80%",
          margin: "0 auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "10px",
          // paddingLeft: "300px",
          // width: "100%",
          // position: "absolute",
          // top: "0",
          // transform: "translate(-50%, 0%)",
          overflow: "auto",
          // left: "50%",
        }}
      >
        {/* box-shadow: ; */}
        <canvas
        style={{border: '1px solid #e7e7e7'}}
          ref={canvasRef}
          width={cellSize * gridSize}
          height={cellSize * gridSize}
          onClick={(e) => {
            const canvas = canvasRef.current;
            const rect = canvas.getBoundingClientRect();
            const temp_y = e.clientX - rect.left;
            const temp_x = e.clientY - rect.top;

            const row = (temp_x - (temp_x % cellSize)) / cellSize;
            const col = (temp_y - (temp_y % cellSize)) / cellSize;
            setCol(col);
            setRow(row);
            setCurrent(colorPalette[colors[row * gridSize + col]]);
            if (paletteOpen) {
              paletteOpen();
            }
          }}
        />
      </Box>
      <Button
        className={classes.button}
        onClick={() => {
          handleDownload();
        }}
        sx={{
          margin: "0 auto",
          display: "flex",
          width: "50%",
          justifyContent: "center",
          marginBottom: "10px",
        }}
      >
        Download <IconFileDownload />{" "}
      </Button>
    </Stack>
  );
}
