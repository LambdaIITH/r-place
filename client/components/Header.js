import { useState } from "react";
import {
  createStyles,
  Header,
  Group,
  Container,
  Burger,
  rem,
  MediaQuery,
  useMantineTheme,
  ColorSwatch,
  Text,
  Title,
} from "@mantine/core";
import { MantineLogo } from "@mantine/ds";
import { CheckIcon } from "@mantine/core";
import { colorPalette } from "./Palette";
const useStyles = createStyles((theme) => ({
  inner: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: rem(56),
    [theme.fn.smallerThan("sm")]: {
      justifyContent: "flex-start",
    },
  },

  links: {
    width: rem(300),
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  pallete: {
    width: rem(300),

    [theme.fn.smallerThan("sm")]: {
      // width: "auto",
      marginLeft: "auto",
    },
  },
  swatches: {
    border: "0.5px solid #FFF",
    "&:hover": {
      cursor: "pointer",
    },
  },
  burger: {
    marginRight: theme.spacing.md,

    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },

  link: {
    display: "block",
    lineHeight: 1,
    padding: `${rem(8)} ${rem(12)}`,
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },

  linkActive: {
    "&, &:hover": {
      backgroundColor: theme.fn.variant({
        variant: "light",
        color: theme.primaryColor,
      }).background,
      color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
        .color,
    },
  },
}));

export function Nav(props) {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const [chosen, setChosen] = useState("");
  const { classes, cx } = useStyles();
  const links = [
    { link: "/place", label: "Basic" },
    { link: "/", label: "Hostels" },
    { link: "/", label: "Acads" },
  ];
  const [active, setActive] = useState(links[0].link);
  const items = links.map((link, index) => (
    <a
      key={index}
      href={link.link}
      className={cx(classes.link, {
        [classes.linkActive]: active === link.link,
      })}
      onClick={() => {
        setActive(link.link);
      }}
    >
      {link.label}
    </a>
  ));
  const swatches = colorPalette.map((color, index) => (
    <ColorSwatch
      key={index}
      color={color}
      component="button"
      className={classes.swatches}
      // size={20}
      onClick={() => {
        console.log(color);
        console.log(theme.colors);
        props.setChosen(color);
        setChosen(color);
      }}
    >
      {chosen === color ? <CheckIcon width={rem(10)} /> : ""}
    </ColorSwatch>
  ));

  return (
    <Header
      height={{ base: 100, md: 100 }}
      p="md"
      // sx={{
      //   backgroundColor: "#1C2128",
      // }}
    >
      <Container className={classes.inner}>
        <MediaQuery largerThan="sm" styles={{ display: "none" }}>
          <Burger
            opened={opened}
            onClick={() => {
              setOpened((o) => !o);
              props.setOpened((o) => !o);
            }}
            size="sm"
            color={theme.colors.gray[6]}
            mr="xl"
          />
        </MediaQuery>
        <Group className={classes.links} spacing={5}>
          {items}
        </Group>
        <Title
          order={1}
          variant="gradient"
          gradient={{ from: "#D6336C", to: "#AE3EC9", deg: 45 }}
          sx={{ fontSize: "1.8rem" }}
        >
          {" "}
          r/IITH-2023
        </Title>

        <Group className={classes.pallete} position="center" spacing="xs">
          {swatches}
        </Group>
      </Container>
    </Header>
  );
}
