import { faFolderPlus, faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
  Modal,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { UseListStateHandler } from "@mantine/hooks/lib/use-list-state/use-list-state";
import { IFileItem } from "models/files";
import React from "react";
import NewFolderModal from "./Modals/NewFolderModal";

interface FileListHeaderProps {
  path: string[];
  setPath: React.Dispatch<React.SetStateAction<string[]>>;
  isValidName: (name: string) => string | null;
  files: IFileItem[];
  filesHandler: UseListStateHandler<IFileItem>;
}

const FileListHeader: React.FC<FileListHeaderProps> = ({
  path,
  setPath,
  files,
  filesHandler,
  isValidName,
}) => {
  const { classes } = useStyles();
  const [newFolderModalOpened, newFolderModalHandler] = useDisclosure(false);

  const allSelected = files.length > 0 && files.every((file) => file.selected);
  const indeterminate = files.some((file) => file.selected) && !allSelected;

  const handleCheckboxChange = (e: React.ChangeEvent) => {
    filesHandler.setState((prev) =>
      prev.map((file) => ({ ...file, selected: !allSelected }))
    );
  };

  const handleHomeClick = () => setPath([]);
  const handleBreadcrumbClick = (e: React.MouseEvent) => {
    const index = e.currentTarget.getAttribute("data-index");
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
        <ActionIcon size="xs" onClick={newFolderModalHandler.open}>
          <FontAwesomeIcon icon={faFolderPlus} size="sm" />
        </ActionIcon>
      </Group>
      <Divider />
      <Modal
        opened={newFolderModalOpened}
        onClose={newFolderModalHandler.close}
        centered
        title="Neuer Ordner"
      >
        <NewFolderModal
          close={newFolderModalHandler.close}
          path={path}
          filesHandler={filesHandler}
          isValidName={isValidName}
        />
      </Modal>
    </Paper>
  );
};

export default FileListHeader;

const useStyles = createStyles((theme) => ({
  fileListHeader: {
    position: "sticky",
    top: 0,
    zIndex: 1,
  },

  breadcrumbs: {
    height: "100%",
    flexGrow: 1,
    marginLeft: theme.spacing.sm,
    padding: "3px 0",
    overflow: "hidden",
    userSelect: "none",
  },
}));
