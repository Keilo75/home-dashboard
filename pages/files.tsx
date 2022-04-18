import {
  createStyles,
  Group,
  LoadingOverlay,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useListState } from '@mantine/hooks';
import FileList from 'components/Files/FileList';
import { IFile } from 'models/files';
import { NextPage } from 'next';
import React, { useEffect, useState } from 'react';

const Files: NextPage = () => {
  const { classes } = useStyles();

  const [path, setPath] = useState<string[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [files, filesHandler] = useListState<IFile>();

  useEffect(() => {
    setLoadingFiles(true);

    fetch(`/api/files/getList?path=${path.join('/')}`)
      .then((res) => res.json())
      .then((res) => {
        filesHandler.setState(res);
        setLoadingFiles(false);
      });
    // filesHandler does not need to be added to the deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  return (
    <>
      <LoadingOverlay visible={loadingFiles} />
      <Title order={3}>Dateien</Title>
      <Stack className={classes.filesWrapper} spacing="xs">
        {files && (
          <>
            <Group className={classes.fileActions} align="center">
              <Text>Wähle Dateien aus, um Aktionen auszuführen.</Text>
            </Group>
            <FileList
              path={path}
              setPath={setPath}
              files={files}
              filesHandler={filesHandler}
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
