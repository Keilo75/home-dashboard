import { Button, Group, List, Text } from "@mantine/core";
import React from "react";
import { IFileItem } from "models/files";
import axios from "axios";
import { showNotification } from "@mantine/notifications";
import { UseListStateHandlers } from "@mantine/hooks/lib/use-list-state/use-list-state";

interface FileDeleteModal {
  close: () => void;
  filesHandler: UseListStateHandlers<IFileItem>;
  path: string[];
  files: IFileItem[];
  fileToDelete?: IFileItem;
}

const FileDeleteModal: React.FC<FileDeleteModal> = ({
  close,
  path,
  filesHandler,
  files,
  fileToDelete,
}) => {
  const fileNames = (
    fileToDelete !== undefined
      ? [fileToDelete]
      : files.filter((file) => file.selected)
  ).map((file) => file.name);

  const handleDelete = async () => {
    try {
      const request = `/api/files/delete?path=${path.join("/")}${fileNames
        .map((file) => `&file=${file}`)
        .join("")}`;
      const response = await axios.delete<IFileItem[]>(request);

      filesHandler.setState(response.data);
    } catch (err) {
      console.error(err);

      showNotification({
        title: "Etwas ist schiefgelaufen...",
        message: "Die Datei(en) konnten nicht gelöscht werden",
        color: "red",
      });
    }

    close();
  };

  return (
    <>
      <Text>
        Bist du sicher, dass du die folgende(n) Datei(en) löschen willst? Dies
        kann nicht rückgangig gemacht werden.
      </Text>
      <List>
        {fileNames.map((fileName, index) => (
          <List.Item key={index}>{fileName}</List.Item>
        ))}
      </List>
      <Group position="right" spacing="xs" mt="sm">
        <Button variant="default" onClick={close}>
          Zurück
        </Button>
        <Button color="red" onClick={handleDelete}>
          Löschen
        </Button>
      </Group>
    </>
  );
};

export default FileDeleteModal;
