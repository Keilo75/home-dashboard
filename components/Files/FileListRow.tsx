import { Group, Checkbox, Anchor, createStyles } from '@mantine/core';
import { IFile } from 'models/files';
import React from 'react';
import FileIcon from './FileIcon';

interface FileListRowProps {
  file: IFile;
}

const FileListRow: React.FC<FileListRowProps> = ({ file }) => {
  const { classes } = useStyles();

  return (
    <Group className={classes.fileListRow} spacing="xs">
      <Checkbox />
      <FileIcon type={file.isFolder ? 'folder' : file.extension.slice(1)} />
      <Anchor>{file.name}</Anchor>
    </Group>
  );
};

export default FileListRow;

const useStyles = createStyles((theme) => ({
  fileListRow: {
    padding: `3px ${theme.spacing.xs}px`,

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[5]
          : theme.colors.gray[1],
    },
  },
}));
