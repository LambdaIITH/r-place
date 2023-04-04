import { useState } from "react";
import {
  createStyles,
  Header,
  Group,
  ActionIcon,
  Container,
  Burger,
  rem,
  MediaQuery,
  useMantineTheme,
  Box,
  ColorPicker,
  Text,
  DEFAULT_THEME,
  ColorSwatch,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconBrandTwitter,
  IconBrandYoutube,
  IconBrandInstagram,
} from "@tabler/icons-react";
import { MantineLogo } from "@mantine/ds";

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
    width: rem(200),

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
  const { classes, cx } = useStyles();
  const links = [
    { link: "/place", label: "Basic" },
    { link: "/", label: "hostels" },
    { link: "/", label: "acads" },
  ];
  const colorPallete = [
    "#FFFFFF",
    "#E4E4E4",
    "#888888",
    "#222222",
    "#FFA7D1",
    "#E50000",
    "#E59500",
    "#A06A42",
    "#E5D900",
    "#94E044",
    "#02BE01",
    "#00D3DD",
    "#0083C7",
    "#0000EA",
    "#CF6EE4",
    "#820080",
  ];
  const [active, setActive] = useState(links[0].link);
  const items = links.map((link) => (
    <a
      key={link.label}
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
  // const swatches = Object.keys(theme.colors).map((color) => (
  //   <ColorSwatch
  //     key={color}
  //     color={theme.fn.rgba(theme.colors[color][6], 1)}
  //     component="button"
  //     onClick={() => {
  //       console.log(color);
  //       console.log(theme.colors);
  //     }}
  //   />
  // ));
  const swatches = colorPallete.map((color) => (
    <ColorSwatch
      key={color}
      color={color}
      component="button"
      // size={20}
      onClick={() => {
        console.log(color);
        console.log(theme.colors);
        props.setSelected(color);
      }}
    />
  ));

  return (
    <Header height={{ base: 100, md: 100 }} p="md">
      <Container className={classes.inner}>
        <MediaQuery largerThan="sm" styles={{ display: "none" }}>
          <Burger
            opened={opened}
            onClick={() => setOpened((o) => !o)}
            size="sm"
            color={theme.colors.gray[6]}
            mr="xl"
          />
        </MediaQuery>
        <Group className={classes.links} spacing={5}>
          {items}
        </Group>
        <MantineLogo size={28} />
        r/IITH-2022
        <Group className={classes.pallete} position="center" spacing="xs">
          {swatches}
        </Group>
      </Container>
    </Header>
  );
}
