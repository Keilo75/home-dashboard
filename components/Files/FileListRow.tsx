import { Group, Checkbox, Anchor, createStyles } from '@mantine/core';
import type { UseListStateHandler } from '@mantine/hooks/lib/use-list-state/use-list-state';
import { IFile } from 'models/files';
import React from 'react';
import FileIcon from './FileIcon';

interface FileListRowProps {
  file: IFile;
  index: number;
  filesHandler: UseListStateHandler<IFile>;
}

const FileListRow: React.FC<FileListRowProps> = ({
  file,
  index,
  filesHandler,
}) => {
  const { classes } = useStyles();

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    filesHandler.setItemProp(index, 'selected', e.currentTarget.checked);

  return (
    <Group className={classes.fileListRow} spacing="xs">
      <Checkbox checked={file.selected} onChange={handleCheckboxChange} />
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
