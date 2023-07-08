import { Box, Image, MediaQuery, Paper, TextInput, Title } from "@mantine/core";
import React from "react";
import Discription from "./Discription";
import { Button } from "@mantine/core";
import { IconBrandGoogle } from "@tabler/icons-react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
const Login = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  if (status === "authenticated") {
    console.log("authenticated");
    router.push("/place");
  }
  return (
    <>
      <MediaQuery smallerThan="lg" styles={{ display: "none" }}>
        <Box
          component="div"
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            component="div"
            sx={{
              width: "60%",
            }}
          >
            <Discription />
          </Box>
          <Box
            component="div"
            sx={{
              width: "40%",
            }}
          >
            <Paper
              shadow="md"
              component="div"
              radius="none"
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "3rem",
                height: "100vh",
                padding: "0 5rem",
                textAlign: "left",
                backgroundColor: "#27272a",
                color: "rgba(255, 255, 255, .9)",
              }}
            >
              <Image
                alt="r-place logo"
                src="https://res.cloudinary.com/dbmw0xoar/image/upload/v1680605084/ecell/lamda/lambda_logo_nkc8k8.png"
                mx="auto"
                radius="md"
                maw={320}
              />
              <Button
                component="a"
                target="_blank"
                rel="noopener noreferrer"
                leftIcon={<IconBrandGoogle size={22} />}
                sx={{
                  fontSize: "1.6rem",
                  height: "50px",
                  backgroundColor: "#AE3EC9",
                  "&:hover": { backgroundColor: "#AE3ED2" },
                }}
                onClick={() => {
                  signIn();
                }}
              >
                Continue with Google
              </Button>
            </Paper>
          </Box>
        </Box>
      </MediaQuery>
      <MediaQuery largerThan="lg" styles={{ display: "none" }}>
        <Box
          component="div"
          sx={{
            width: "100%",
          }}
        >
          <Paper
            shadow="md"
            component="div"
            radius="none"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "3rem",
              height: "100vh",
              padding: "0 2rem",
              textAlign: "left",
              backgroundColor: "#171717",
              color: "rgba(255, 255, 255, .9)",
            }}
          >
            <Title
              order={1}
              sx={{
                color: "#AE3EC9",
                fontWeight: "bold",
                fontSize: "3.8rem",
                textTransform: "uppercase",
                letterSpacing: "2px",
                textAlign: "center",
              }}
            >
              R-Place
            </Title>
            <Image
              alt="r-place logo"
              src="https://res.cloudinary.com/dbmw0xoar/image/upload/v1680605084/ecell/lamda/lambda_logo_nkc8k8.png"
              mx="auto"
              radius="md"
              maw={320}
            />
            <Button
              component="a"
              target="_blank"
              rel="noopener noreferrer"
              leftIcon={<IconBrandGoogle size={22} />}
              sx={{
                fontSize: "1.4rem",
                height: "50px",
                backgroundColor: "#AE3EC9",
                "&:hover": { backgroundColor: "#AE3ED2" },
              }}
              onClick={() => {
                signIn();
              }}
            >
              Continue with Google
            </Button>
          </Paper>
        </Box>
      </MediaQuery>
    </>
  );
};

export default Login;
