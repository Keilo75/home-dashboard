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
  setPath: React.Dispatch<React.SetStateAction<string[]>>;
  files: IFile[];
  filesHandler: UseListStateHandler<IFile>;
}

const FileList: React.FC<FileListProps> = ({
  path,
  setPath,
  files,
  filesHandler,
}) => {
  const { classes } = useStyles();

  return (
    <Paper shadow="xs" className={classes.fileList} radius={0}>
      <FileListHeader
        path={path}
        setPath={setPath}
        files={files}
        filesHandler={filesHandler}
      />
      {files.length > 0 ? (
        files.map((file, index) => (
          <FileListRow
            key={file.id}
            setPath={setPath}
            file={file}
            index={index}
            filesHandler={filesHandler}
          />
        ))
      ) : (
        <Text pl="sm">No files.</Text>
      )}
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
