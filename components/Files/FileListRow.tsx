import { Group, Checkbox, Anchor, createStyles } from '@mantine/core';
import type { UseListStateHandler } from '@mantine/hooks/lib/use-list-state/use-list-state';
import { IFile, IFileItem } from 'models/files';
import React from 'react';
import FileIcon from './FileIcon';

interface FileListRowProps {
  file: IFileItem;
  setPath: React.Dispatch<React.SetStateAction<string[]>>;
  index: number;
  filesHandler: UseListStateHandler<IFileItem>;
  openFilePreviewModal: (file: IFile) => void;
}

const FileListRow: React.FC<FileListRowProps> = ({
  file,
  setPath,
  index,
  filesHandler,
  openFilePreviewModal,
}) => {
  const { classes } = useStyles();

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    filesHandler.setItemProp(index, 'selected', e.currentTarget.checked);

  const handleAnchorClick = () => {
    if (file.isFolder) {
      setPath((prev) => [...prev, file.name]);
      return;
    }

    openFilePreviewModal(file);
  };

  return (
    <Group className={classes.fileListRow} spacing="xs">
      <Checkbox checked={file.selected} onChange={handleCheckboxChange} />
      <FileIcon type={file.isFolder ? 'folder' : file.extension} />
      <Anchor onClick={handleAnchorClick}>{file.name}</Anchor>
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
