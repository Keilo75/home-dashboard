import { faFolder, faHome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Anchor,
  Breadcrumbs,
  Checkbox,
  createStyles,
  Divider,
  Group,
  LoadingOverlay,
  Paper,
  Stack,
  Table,
  Text,
  Title,
} from '@mantine/core';
import FileIcon from 'components/Files/FileIcon';
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
            <Paper shadow="xs" className={classes.filesList} radius={0}>
              <Paper className={classes.filesListHeader} radius={0} mb="xs">
                <Group p="xs" align="center" spacing="xs" noWrap>
                  <Checkbox />
                  <Text>{selectedFileIDs.length}</Text>
                  <Breadcrumbs className={classes.breadcrumbs}>
                    <Anchor>
                      <FontAwesomeIcon icon={faHome} size="xs" />
                    </Anchor>
                    {path.map((item, index) => (
                      <Anchor key={index}>{item}</Anchor>
                    ))}
                  </Breadcrumbs>
                </Group>
                <Divider />
              </Paper>
              {files.map((file) => (
                <Group key={file.id} className={classes.file} spacing="xs">
                  <Checkbox />
                  <FileIcon
                    type={file.isFolder ? 'folder' : file.extension.slice(1)}
                  />
                  <Anchor>{file.name}</Anchor>
                </Group>
              ))}
            </Paper>
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

  filesList: {
    flexGrow: 1,
    flexBasis: 0,
    overflowY: 'auto',
    position: 'relative',
  },

  filesListHeader: {
    position: 'sticky',
    top: 0,
  },

  breadcrumbs: {
    height: '100%',
    flexGrow: 1,
    marginLeft: theme.spacing.sm,
    padding: '3px 0',
    overflow: 'hidden',
  },

  file: {
    padding: `3px ${theme.spacing.xs}px`,

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[5]
          : theme.colors.gray[1],
    },
  },
}));
