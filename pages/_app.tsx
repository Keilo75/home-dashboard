import { GetServerSidePropsContext } from 'next';
import { useState } from 'react';
import { AppProps } from 'next/app';
import { getCookie, setCookies } from 'cookies-next';
import {
  MantineProvider,
  ColorScheme,
  ColorSchemeProvider,
  useMantineTheme,
  AppShell,
  Header,
  MediaQuery,
  Navbar,
  Text,
  Burger,
  Group,
  Stack,
  createStyles,
} from '@mantine/core';
import ThemeToggle from 'components/ThemeToggle/ThemeToggle';
import Image from 'next/image';
import NavButton, { NavButtonProps } from 'components/NavButton/NavButton';
import { faHome, faServer } from '@fortawesome/free-solid-svg-icons';
import { NotificationsProvider } from '@mantine/notifications';

const navigationLinks: NavButtonProps[] = [
  { label: 'Home', icon: faHome, url: '/' },
  { label: 'Dateien', icon: faServer, url: '/files' },
];

export default function App(props: AppProps & { colorScheme: ColorScheme }) {
  const { Component, pageProps } = props;
  const [colorScheme, setColorScheme] = useState<ColorScheme>(
    props.colorScheme
  );

  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const { classes } = useStyles();

  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme =
      value || (colorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(nextColorScheme);
    setCookies('mantine-color-scheme', nextColorScheme, {
      maxAge: 60 * 60 * 24 * 30,
    });
  };

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{ colorScheme }}
        withGlobalStyles
        withNormalizeCSS
        defaultProps={{
          Tooltip: { gutter: 10, withArrow: true, transition: 'pop' },
        }}
      >
        <NotificationsProvider>
          <AppShell
            styles={{
              main: {
                display: 'flex',
                flexDirection: 'column',
                background:
                  colorScheme === 'dark'
                    ? theme.colors.dark[8]
                    : theme.colors.gray[0],
              },
            }}
            fixed
            header={
              <Header height={50} p="md" className={classes.header}>
                <Group>
                  <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                    <Burger
                      opened={opened}
                      onClick={() => setOpened((o) => !o)}
                      size="sm"
                      color={theme.colors.gray[6]}
                    />
                  </MediaQuery>

                  <Image src="/logo.svg" height={25} width={25} alt="logo" />
                  <Text>Home</Text>
                </Group>
                <ThemeToggle />
              </Header>
            }
            navbarOffsetBreakpoint="sm"
            navbar={
              <Navbar
                p="md"
                hiddenBreakpoint="sm"
                hidden={!opened}
                width={{ sm: 200, lg: 300 }}
              >
                <Stack spacing={5}>
                  {navigationLinks.map((link) => (
                    <NavButton key={link.label} {...link} />
                  ))}
                </Stack>
              </Navbar>
            }
          >
            <Component {...pageProps} />
          </AppShell>
        </NotificationsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

App.getInitialProps = ({ ctx }: { ctx: GetServerSidePropsContext }) => ({
  // get color scheme from cookie
  colorScheme: getCookie('mantine-color-scheme', ctx) || 'dark',
});

const useStyles = createStyles(() => ({
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}));
