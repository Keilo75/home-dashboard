import { Stack, Title } from "@mantine/core";
import { NextPage } from "next";
import React from "react";

const Changelog: NextPage = () => {
  return (
    <>
      <Title order={3}>Changelog</Title>
      {Object.keys(changelogData)
        .reverse()
        .map((version) => (
          <Stack key={version} mb="xs" spacing={0}>
            <Title order={4}>{version}</Title>
            {changelogData[version].map((change) => (
              <span key={change}>{change}</span>
            ))}
          </Stack>
        ))}
    </>
  );
};

export default Changelog;

const changelogData: Record<string, string[]> = {
  "1.0": ["Ursprünglicher Release"],
  "1.1": [
    "+ Changelog",
    "+ Umbennenen von Dateien",
    "+ Erlaube Downloaden, Umbennenen und Löschen aus der Vorschau",
    "+ Bestätigung beim Datei-Löschen",
    "~ Lade ZIP-Dateien automatisch runter, anstatt auf User zu warten",
  ],
};
