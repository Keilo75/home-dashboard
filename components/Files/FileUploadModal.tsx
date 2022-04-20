import { faTrashAlt, faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  ActionIcon,
  Button,
  createStyles,
  Group,
  Paper,
  Stack,
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
}

interface FileUploadModalProps {
  close: () => void;
}

const FileUploadModal: React.FC<FileUploadModalProps> = ({ close }) => {
  const { classes } = useStyles();

  const [uploadedFiles, uploadedFilesHandler] = useListState<File>([]);
  const form = useForm<Form>({
    initialValues: { files: formList([]) },
    validate: {
      files: {
        name: (value) => (isValidName(value) ? 'Ungültiger Name' : null),
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

              return (
                <Group key={file.id}>
                  <TextInput
                    placeholder="Name"
                    className={classes.nameInput}
                    required
                    {...form.getListInputProps('files', index, 'name')}
                  />
                  <ActionIcon
                    color="red"
                    variant="hover"
                    onClick={handleFileRemove}
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

        <Group position="right" spacing="xs">
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
