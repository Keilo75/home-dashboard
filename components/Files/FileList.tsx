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
import { IFile } from 'models/files';
import React from 'react';
import FileListHeader from './FileListHeader';
import FileListRow from './FileListRow';

interface FileListProps {
  path: string[];
  selectedFileIDs: string[];
  files: IFile[];
}

const FileList: React.FC<FileListProps> = ({
  path,
  files,
  selectedFileIDs,
}) => {
  const { classes } = useStyles();

  return (
    <Paper shadow="xs" className={classes.fileList} radius={0}>
      <FileListHeader path={path} selectedFileIDs={selectedFileIDs} />
      {files.map((file) => (
        <FileListRow key={file.id} file={file} />
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
