import { Button, Group, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { UseListStateHandler } from "@mantine/hooks/lib/use-list-state/use-list-state";
import { showNotification } from "@mantine/notifications";
import axios from "axios";
import { files } from "jszip";
import { IFileItem } from "models/files";
import React from "react";

interface Form {
  name: string;
}

interface FileRenameModalProps {
  close: () => void;
  file: IFileItem;
  path: string[];
  filesHandler: UseListStateHandler<IFileItem>;
  isValidName: (name: string) => string | null;
}

const FileRenameModal: React.FC<FileRenameModalProps> = ({
  close,
  file,
  path,
  filesHandler,
  isValidName,
}) => {
  const form = useForm<Form>({
    initialValues: { name: file.name },
    validate: {
      name: (value) => {
        if (file.name === value) return null;
        return isValidName(value);
      },
    },
  });

  const handleSubmit = async ({ name }: Form) => {
    if (file.name === name) return close();

    try {
      const response = await axios.post<IFileItem[]>(
        `/api/files/rename?path=${path.join("/")}&file=${
          file.name
        }&name=${name}`
      );
      filesHandler.setState(response.data);
    } catch (err) {
      console.error(err);
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
        <Button type="submit">Umbennen</Button>
      </Group>
    </form>
  );
};

export default FileRenameModal;
