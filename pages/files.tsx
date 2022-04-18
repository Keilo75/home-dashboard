import {
  createStyles,
  Group,
  LoadingOverlay,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import FileList from 'components/Files/FileList';
import { IFile } from 'models/files';
import { NextPage } from 'next';
import React, { useEffect, useState } from 'react';

const Files: NextPage = () => {
  const { classes } = useStyles();

  const [path, usePath] = useState<string[]>([]);
  const [files, setFiles] = useState<IFile[]>();
  const [selectedFileIDs, setSelectedFileIDs] = useState<string[]>([]);

  useEffect(() => {
    setFiles(undefined);

    fetch(`/api/files/getList?path=${path.join('/')}`)
      .then((res) => res.json())
      .then((res) => {
        setFiles(res);
      });
  }, [path]);

  return (
    <>
      <LoadingOverlay visible={files === undefined} />
      <Title order={3}>Dateien</Title>
      <Stack className={classes.filesWrapper} spacing="xs">
        {files && (
          <>
            <Group className={classes.fileActions} align="center">
              <Text>Wähle Dateien aus, um Aktionen auszuführen.</Text>
            </Group>
            <FileList
              path={path}
              files={files}
              selectedFileIDs={selectedFileIDs}
            />
          </>
        )}
      </Stack>
    </>
  );
};

export default Files;

const useStyles = createStyles((theme) => ({
  filesWrapper: {
    flexGrow: 1,
  },

  fileActions: {
    height: 36,
  },
}));
