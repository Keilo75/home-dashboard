import { faHome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Paper,
  Group,
  Checkbox,
  Breadcrumbs,
  Anchor,
  Divider,
  createStyles,
  Text,
} from '@mantine/core';
import { UseListStateHandler } from '@mantine/hooks/lib/use-list-state/use-list-state';
import { IFile } from 'models/files';
import React from 'react';

interface FileListHeaderProps {
  path: string[];
  files: IFile[];
  filesHandler: UseListStateHandler<IFile>;
}

const FileListHeader: React.FC<FileListHeaderProps> = ({
  path,
  files,
  filesHandler,
}) => {
  const { classes } = useStyles();

  const allSelected = files.every((file) => file.selected);
  const indeterminate = files.some((file) => file.selected) && !allSelected;

  const handleCheckboxChange = () =>
    filesHandler.setState((prev) =>
      prev.map((file) => ({ ...file, selected: !allSelected }))
    );

  return (
    <Paper className={classes.fileListHeader} radius={0} mb="xs">
      <Group p="xs" align="center" spacing="xs" noWrap>
        <Checkbox
          checked={allSelected}
          indeterminate={indeterminate}
          onChange={handleCheckboxChange}
        />
        <Text>{files.filter((file) => file.selected).length}</Text>
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
  );
};

export default FileListHeader;

const useStyles = createStyles((theme) => ({
  fileList: {
    flexGrow: 1,
    flexBasis: 0,
    overflowY: 'auto',
    position: 'relative',
  },

  fileListHeader: {
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
}));
