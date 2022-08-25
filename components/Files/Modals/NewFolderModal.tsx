import { Button, Group, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import React from "react";
import { IFileItem } from "models/files";
import axios from "axios";
import { showNotification } from "@mantine/notifications";
import { UseListStateHandlers } from "@mantine/hooks/lib/use-list-state/use-list-state";

interface Form {
  name: string;
}

interface FileUploadModalProps {
  close: () => void;
  filesHandler: UseListStateHandlers<IFileItem>;
  path: string[];
  isValidName: (name: string) => string | null;
}

const NewFolderModal: React.FC<FileUploadModalProps> = ({
  close,
  path,
  filesHandler,
  isValidName,
}) => {
  const form = useForm<Form>({
    initialValues: { name: "Neuer Ordner" },
    validate: {
      name: (value) => isValidName(value),
    },
  });

  const handleSubmit = async (values: Form) => {
    try {
      const response = await axios.post<IFileItem[]>(
        `/api/files/add-folder?path=${path.join("/")}&folder=${
          form.values.name
        }`
      );
      filesHandler.setState(response.data);
      showNotification({
        message: "Ordner erstellt",
        color: "green",
      });
    } catch (err) {
      console.error(err);
      showNotification({
        title: "Etwas ist schiefgelaufen...",
        message: "Der Ordner konnte nicht erstellt werden",
        color: "red",
      });
    }

    close();
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput label="Name" required {...form.getInputProps("name")} />
      <Group position="right" spacing="xs" mt="sm">
        <Button variant="default" onClick={close}>
          Zurück
        </Button>
        <Button type="submit">Erstelle Ordner</Button>
      </Group>
    </form>
  );
};

export default NewFolderModal;
