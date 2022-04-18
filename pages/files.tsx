import {
  createStyles,
  LoadingOverlay,
  Paper,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IFile } from 'models/files';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';

const Files: NextPage = () => {
  const { classes } = useStyles();

  const [path, usePath] = useState<string[]>([]);
  const [files, setFiles] = useState<IFile[]>();

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
      <Title order={3}>Dateien</Title>
      <Stack className={classes.filesWrapper}>
        <Paper shadow="xs" className={classes.filesList}>
          <LoadingOverlay visible={files === undefined} />
        </Paper>
      </Stack>
    </>
  );
};

export default Files;

const useStyles = createStyles(() => ({
  filesWrapper: {
    flexGrow: 1,
  },

  filesList: {
    position: 'relative',
    flexGrow: 1,
  },
}));
