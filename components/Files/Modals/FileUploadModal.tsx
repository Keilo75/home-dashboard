import {
  faRotateLeft,
  faTrashAlt,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  ActionIcon,
  Button,
  createStyles,
  Divider,
  Group,
  Overlay,
  Paper,
  Progress,
  Stack,
  Switch,
  Text,
  TextInput,
} from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { useListState } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import React, { useState } from "react";
import { v4 as uuid } from "uuid";
import prettyBytes from "pretty-bytes";
import { IFileItem, isValidName } from "models/files";
import axios from "axios";
import { showNotification } from "@mantine/notifications";
import { UseListStateHandlers } from "@mantine/hooks/lib/use-list-state/use-list-state";

interface Form {
  files: { name: string; id: string }[];
  createFolder: boolean;
  folderName: string;
}

interface FileUploadModalProps {
  close: () => void;
  files: IFileItem[];
  filesHandler: UseListStateHandlers<IFileItem>;
  path: string[];
  isUploading: boolean;
  setIsUploading: React.Dispatch<React.SetStateAction<boolean>>;
}

const FileUploadModal: React.FC<FileUploadModalProps> = ({
  close,
  path,
  files,
  isUploading,
  setIsUploading,
  filesHandler,
}) => {
  const { classes } = useStyles();

  const [uploadedFiles, uploadedFilesHandler] = useListState<File>([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const form = useForm<Form>({
    initialValues: { files: [], createFolder: false, folderName: "" },
    validate: {
      files: {
        name: (value) => {
          if (
            form.values.files.filter((file) => file.name === value).length > 1
          )
            return "Doppelter Name";
          if (files.some((file) => file.name === value))
            return "Datei existiert bereits";
          return isValidName(value) ? "Ungültiger Name" : null;
        },
      },

      folderName: (value) => {
        if (!form.values.createFolder) return null;
        if (files.some((file) => file.name === value))
          return "Ordner existiert bereits";
        return isValidName(value) ? "Ungültiger Name" : null;
      },
    },
  });

  const handleFilesDrop = (files: File[]) => {
    uploadedFilesHandler.append(...files);
    form.setFieldValue("files", [
      ...form.values.files,
      ...files.map((file) => ({ name: file.name, id: uuid() })),
    ]);
  };

  const handleSubmit = async (values: Form) => {
    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    uploadedFiles.forEach((file, index) =>
      formData.append(form.values.files[index].name, file)
    );

    try {
      const response = await axios.post<IFileItem[]>(
        `/api/files/upload?path=${path.join("/")}&folder=${
          form.values.folderName
        }`,
        formData,
        {
          onUploadProgress: (e) => {
            setUploadProgress(Math.round(e.loaded * 100) / e.total);
          },
        }
      );

      filesHandler.setState(response.data);

      showNotification({
        message: "Datei(en) erfolgreich hochgeladen",
        color: "green",
      });
    } catch (err) {
      console.error(err);

      showNotification({
        title: "Etwas ist schiefgelaufen...",
        message: "Deine Datei(en) konnten nicht hochgeladen werden",
        color: "red",
      });
    }

    setIsUploading(false);
    close();
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      {isUploading ? (
        <>
          <Text>{uploadProgress.toFixed(2)}%</Text>
          <Progress value={uploadProgress} />
        </>
      ) : (
        <>
          <Dropzone onDrop={handleFilesDrop} mb="sm">
            <Group position="apart" noWrap>
              <FontAwesomeIcon icon={faUpload} size="lg" />
              <Text>
                Ziehe Dateien hierher oder klicke, um sie auszuwählen.
              </Text>
            </Group>
          </Dropzone>

          <Stack className={classes.fileList} p="sm" spacing="xs">
            {form.values.files.length > 0 ? (
              form.values.files.map((file, index) => {
                const handleFileRemove = () => {
                  uploadedFilesHandler.remove(index);
                  form.removeListItem("files", index);
                };

                const handleFileNameReset = () => {
                  form.setFieldValue(`files.${index}`, {
                    name: uploadedFiles[index].name,
                    id: uuid(),
                  });
                };

                return (
                  <Group key={file.id} align="flex-start">
                    <TextInput
                      placeholder="Name"
                      className={classes.nameInput}
                      required
                      {...form.getInputProps(`files.${index}.name`)}
                      rightSection={
                        <ActionIcon onClick={handleFileNameReset}>
                          <FontAwesomeIcon icon={faRotateLeft} size="xs" />
                        </ActionIcon>
                      }
                    />
                    <ActionIcon color="red" onClick={handleFileRemove} mt={3}>
                      <FontAwesomeIcon icon={faTrashAlt} size="xs" />
                    </ActionIcon>
                  </Group>
                );
              })
            ) : (
              <Text>Keine Dateien.</Text>
            )}
          </Stack>
          <Text color="dimmed">
            {form.values.files.length} Datei(en) |{" "}
            {prettyBytes(uploadedFiles.reduce((acc, cur) => acc + cur.size, 0))}
          </Text>

          {uploadedFiles.length > 0 && (
            <>
              <Divider my="sm" />
              <Switch
                label="Unterordner in dem momentanen Ordner erstellen?"
                {...form.getInputProps("createFolder", { type: "checkbox" })}
                mb="xs"
              />
              {form.values.createFolder && (
                <TextInput
                  required
                  label="Ordnername"
                  {...form.getInputProps("folderName")}
                />
              )}
            </>
          )}

          <Group position="right" spacing="xs" mt="sm">
            <Button variant="default" onClick={close}>
              Zurück
            </Button>
            <Button disabled={uploadedFiles.length === 0} type="submit">
              Upload
            </Button>
          </Group>
        </>
      )}
    </form>
  );
};

export default FileUploadModal;

const useStyles = createStyles((theme) => ({
  fileList: {
    maxHeight: 200,
    overflowY: "auto",
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.gray[9]
        : theme.colors.gray[1],
  },

  nameInput: {
    flexGrow: 1,
  },
}));
