import {
  faDownload,
  faEllipsisVertical,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  ActionIcon,
  Button,
  Center,
  createStyles,
  Group,
  Menu,
  Paper,
  Text,
} from "@mantine/core";
import { IFile, isExtensionPreviewable } from "models/files";
import prettyBytes from "pretty-bytes";
import React, { useMemo } from "react";

interface FileUploadModalProps {
  close: () => void;
  file: IFile;
  path: string[];
  openFileRenameModal: () => void;
}

const FilePreviewModal: React.FC<FileUploadModalProps> = ({
  close,
  file,
  path,
  openFileRenameModal,
}) => {
  const { classes } = useStyles();
  const date = useMemo(
    () => new Date(file.lastModified).toLocaleString("de-DE"),
    [file]
  );

  const handleIFrameLoad: React.ReactEventHandler<HTMLIFrameElement> = (e) => {
    const body = e.currentTarget.contentWindow?.document.body;
    if (!body) return;

    body.style.display = "grid";
    body.style.placeItems = "center";
  };

  const handleDownload = () => {
    window.open(`/download?path=${path.join("/")}&file=${file.name}&zip=0`);
  };

  const handleFileRename = () => {
    close();
    openFileRenameModal();
  };

  return (
    <>
      <Paper className={classes.filePreview} mb="sm">
        {file.size > 4_000_000 || !isExtensionPreviewable(file.extension) ? (
          <Text p="sm">Vorschau kann nicht geladen werden.</Text>
        ) : (
          <Center>
            <iframe
              className={classes.iframe}
              src={`/api/files/preview?path=${path.join("/")}&file=${
                file.name
              }`}
              onLoad={handleIFrameLoad}
            />
          </Center>
        )}
      </Paper>

      <Text>Größe: {prettyBytes(file.size)}</Text>
      <Text>Änderungsdatum: {date}</Text>

      <Group position="right" mt="sm">
        <Button variant="default" onClick={close}>
          Zurück
        </Button>

        <Menu width={150}>
          <Menu.Target>
            <ActionIcon>
              <FontAwesomeIcon icon={faEllipsisVertical} />{" "}
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              onClick={handleDownload}
              icon={<FontAwesomeIcon icon={faDownload} />}
            >
              Download
            </Menu.Item>
            <Menu.Item
              onClick={handleFileRename}
              icon={<FontAwesomeIcon icon={faPen} />}
            >
              Umbennen
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </>
  );
};

export default FilePreviewModal;

const useStyles = createStyles((theme) => ({
  filePreview: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.gray[9]
        : theme.colors.gray[1],
  },

  iframe: {
    border: 0,
  },
}));
