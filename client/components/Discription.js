import { Image, Paper, Text, Title } from "@mantine/core";
import React from "react";

const Discription = () => {
  return (
    <Paper
      shadow="md"
      component="div"
      radius="none"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "2.8rem",
        height: "100vh",
        padding: "0 5rem",
        textAlign: "left",
        backgroundColor: "#171717",
        color: "rgba(255, 255, 255, .9)",
      }}
    >
      <Title
        variant="gradient"
        gradient={{ from: "#C2255C", to: "#9C36B5", deg: 45 }}
        order={1}
        sx={{
          fontWeight: "bold",
          fontSize: "4.8rem",
          letterSpacing: "2px",
        }}
      >
        r/IITH-2023
      </Title>
      <Image
        alt="r-place logo"
        src="https://res.cloudinary.com/dbmw0xoar/image/upload/v1680545706/ecell/lamda/r-place_iinsdx.png"
        mx="auto"
        radius="md"
        maw={320}
      />
      <Text
        variant="gradient"
        gradient={{ from: "#C2255C", to: "#9C36B5", deg: 45 }}
        sx={{
          fontWeight: "medium",
          fontSize: "1.2rem",
          letterSpacing: "1px",
          wordSpacing: "1px",
          marginTop: "2rem",
          "@media (max-width: 1400px)": {
            fontSize: "1rem",
          },
        }}
      >
        Welcome to our IITH Alumni r/place app where Graduating Students can
        leave their mark on our digital canvas. In this
        collaborative art project, each alumnus can contribute a pixel to create
        a unique and beautiful image that represents our community. Let&apos;s
        come together and create something special that will last a lifetime.
        Join us and be a part of the IITH legacy!
      </Text>
    </Paper>
  );
};

export default Discription;
