import {
  faRotateLeft,
  faTrashAlt,
  faUpload,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  ActionIcon,
  Button,
  createStyles,
  Divider,
  Group,
  Overlay,
  Paper,
  Stack,
  Switch,
  Text,
  TextInput,
} from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import { useListState } from '@mantine/hooks';
import { useForm, formList } from '@mantine/form';
import React from 'react';
import { v4 as uuid } from 'uuid';
import { FormList } from '@mantine/form/lib/form-list/form-list';
import prettyBytes from 'pretty-bytes';
import { isValidName } from 'models/files';

interface Form {
  files: FormList<{ name: string; id: string }>;
  createFolder: boolean;
  folderName: string;
}

interface FileUploadModalProps {
  close: () => void;
  path: string[];
}

const FileUploadModal: React.FC<FileUploadModalProps> = ({ close, path }) => {
  const { classes } = useStyles();

  const [uploadedFiles, uploadedFilesHandler] = useListState<File>([]);
  const form = useForm<Form>({
    initialValues: { files: formList([]), createFolder: false, folderName: '' },
    validate: {
      files: {
        name: (value) => {
          if (
            form.values.files.filter((file) => file.name === value).length > 1
          )
            return 'Doppelter Name';

          return isValidName(value) ? 'Ungültiger Name' : null;
        },
      },

      folderName: (value) => {
        if (!form.values.createFolder) return null;

        return isValidName(value) ? 'Ungültiger Name' : null;
      },
    },
  });

  const handleFilesDrop = (files: File[]) => {
    uploadedFilesHandler.append(...files);
    form.setFieldValue(
      'files',
      formList([
        ...form.values.files,
        ...files.map((file) => ({ name: file.name, id: uuid() })),
      ])
    );
  };

  const handleSubmit = (values: Form) => {
    console.log(values);
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack spacing={0}>
        <Dropzone onDrop={handleFilesDrop} mb="sm">
          {() => (
            <Group position="apart" noWrap>
              <FontAwesomeIcon icon={faUpload} size="lg" />
              <Text>
                Ziehe Dateien hierher oder klicke, um sie auszuwählen.
              </Text>
            </Group>
          )}
        </Dropzone>

        <Stack className={classes.fileList} p="sm" spacing="xs">
          {form.values.files.length > 0 ? (
            form.values.files.map((file, index) => {
              const handleFileRemove = () => {
                uploadedFilesHandler.remove(index);
                form.removeListItem('files', index);
              };

              const handleFileNameReset = () => {
                form.setListItem('files', index, {
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
                    {...form.getListInputProps('files', index, 'name')}
                    rightSection={
                      <ActionIcon onClick={handleFileNameReset}>
                        <FontAwesomeIcon icon={faRotateLeft} size="xs" />
                      </ActionIcon>
                    }
                  />
                  <ActionIcon
                    color="red"
                    variant="hover"
                    onClick={handleFileRemove}
                    mt={3}
                  >
                    <FontAwesomeIcon icon={faTrashAlt} size="xs" />
                  </ActionIcon>
                </Group>
              );
            })
          ) : (
            <Text>Keine Dateien.</Text>
          )}
        </Stack>
        <Text>
          {form.values.files.length} Datei(en) |{' '}
          {prettyBytes(uploadedFiles.reduce((acc, cur) => acc + cur.size, 0))}
        </Text>

        {uploadedFiles.length > 0 && (
          <>
            <Divider my="sm" />
            <Switch
              label="Unterordner in deinem momentanen Ordner erstellen?"
              {...form.getInputProps('createFolder', { type: 'checkbox' })}
              mb="xs"
            />
            {form.values.createFolder && (
              <TextInput
                required
                label="Ordnername"
                {...form.getInputProps('folderName')}
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
      </Stack>
    </form>
  );
};

export default FileUploadModal;

const useStyles = createStyles((theme) => ({
  fileList: {
    maxHeight: 200,
    overflowY: 'auto',
    backgroundColor:
      theme.colorScheme === 'dark'
        ? theme.colors.gray[9]
        : theme.colors.gray[1],
  },

  nameInput: {
    flexGrow: 1,
  },
}));
