import { faFolderPlus, faHome } from '@fortawesome/free-solid-svg-icons';
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
  ActionIcon,
} from '@mantine/core';
import { UseListStateHandler } from '@mantine/hooks/lib/use-list-state/use-list-state';
import { IFile } from 'models/files';
import React from 'react';

interface FileListHeaderProps {
  path: string[];
  setPath: React.Dispatch<React.SetStateAction<string[]>>;
  files: IFile[];
  filesHandler: UseListStateHandler<IFile>;
  openNewFolderModal: () => void;
}

const FileListHeader: React.FC<FileListHeaderProps> = ({
  path,
  setPath,
  files,
  filesHandler,
  openNewFolderModal,
}) => {
  const { classes } = useStyles();

  const allSelected = files.length > 0 && files.every((file) => file.selected);
  const indeterminate = files.some((file) => file.selected) && !allSelected;

  const handleCheckboxChange = (e: React.ChangeEvent) => {
    filesHandler.setState((prev) =>
      prev.map((file) => ({ ...file, selected: !allSelected }))
    );
  };

  const handleHomeClick = () => setPath([]);
  const handleBreadcrumbClick = (e: React.MouseEvent) => {
    const index = e.currentTarget.getAttribute('data-index');
    if (!index) return;

    setPath(path.slice(0, parseInt(index) + 1));
  };

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
          <Anchor onClick={handleHomeClick}>
            <FontAwesomeIcon icon={faHome} size="xs" />
          </Anchor>
          {path.map((item, index) => (
            <Anchor
              key={index}
              onClick={handleBreadcrumbClick}
              data-index={index}
            >
              {item}
            </Anchor>
          ))}
        </Breadcrumbs>
        <ActionIcon size="xs" onClick={openNewFolderModal}>
          <FontAwesomeIcon icon={faFolderPlus} size="sm" />
        </ActionIcon>
      </Group>
      <Divider />
    </Paper>
  );
};

export default FileListHeader;

const useStyles = createStyles((theme) => ({
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
