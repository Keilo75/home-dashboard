import {
  AppShell,
  Header,
  MediaQuery,
  Navbar,
  Text,
  useMantineTheme,
  Burger,
  Group,
} from '@mantine/core';
import { NextPage } from 'next';
import Image from 'next/image';
import { useState } from 'react';
import ThemeToggle from '../components/ThemeToggle/ThemeToggle';
import header from 'styles/Header.module.scss';

const Home: NextPage = () => {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);

  return (
    <AppShell
      styles={{
        main: {
          background:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      }}
      fixed
      header={
        <Header height={50} p="md" className={header.header}>
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
          <Text>Application navbar</Text>
        </Navbar>
      }
    >
      <Text>Resize app to see responsive navbar in action</Text>
    </AppShell>
  );
};

export default Home;
