import { faHome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Anchor,
  Breadcrumbs,
  Checkbox,
  createStyles,
  Divider,
  Group,
  Paper,
  Text,
} from '@mantine/core';
import type { UseListStateHandler } from '@mantine/hooks/lib/use-list-state/use-list-state';
import { IFile } from 'models/files';
import React from 'react';
import FileListHeader from './FileListHeader';
import FileListRow from './FileListRow';

interface FileListProps {
  path: string[];
  files: IFile[];
  filesHandler: UseListStateHandler<IFile>;
}

const FileList: React.FC<FileListProps> = ({ path, files, filesHandler }) => {
  const { classes } = useStyles();

  return (
    <Paper shadow="xs" className={classes.fileList} radius={0}>
      <FileListHeader path={path} files={files} filesHandler={filesHandler} />
      {files.map((file, index) => (
        <FileListRow
          key={file.id}
          file={file}
          index={index}
          filesHandler={filesHandler}
        />
      ))}
    </Paper>
  );
};

export default FileList;

const useStyles = createStyles((theme) => ({
  fileList: {
    flexGrow: 1,
    flexBasis: 0,
    overflowY: 'auto',
    position: 'relative',
  },
}));
