import {
  faDownload,
  faTrashAlt,
  faUpload,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Button,
  createStyles,
  Group,
  LoadingOverlay,
  Modal,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useDisclosure, useListState } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import axios from 'axios';
import FileList from 'components/Files/FileList';
import FileUploadModal from 'components/Files/FileUploadModal';
import NewFolderModal from 'components/Files/NewFolderModal';
import { IFile } from 'models/files';
import { NextPage } from 'next';
import React, { useEffect, useState } from 'react';

const Files: NextPage = () => {
  const { classes } = useStyles();

  const [path, setPath] = useState<string[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [files, filesHandler] = useListState<IFile>();
  const [isUploading, setIsUploading] = useState(false);

  const [fileUploadModalOpened, fileUploadModalHandler] = useDisclosure(false);
  const [newFolderModalOpened, newFolderModalHandler] = useDisclosure(false);

  useEffect(() => {
    setLoadingFiles(true);

    axios
      .get<IFile[]>(`/api/files/list?path=${path.join('/')}`)
      .then((res) => res.data)
      .then((res) => {
        filesHandler.setState(res);
        setLoadingFiles(false);
      });
    // filesHandler does not need to be added to the deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  const handleDelete = async () => {
    const selectedFileNames = files
      .filter((file) => file.selected)
      .map((file) => file.name);

    try {
      const request = `/api/files/delete?path=${path.join(
        '/'
      )}${selectedFileNames.map((file) => `&file=${file}`).join('')}`;
      const response = await axios.delete<IFile[]>(request);

      filesHandler.setState(response.data);
    } catch (err) {
      console.error(err);

      showNotification({
        title: 'Etwas ist schiefgelaufen...',
        message: 'Die Datei(en) konnten nicht gelöscht werden',
        color: 'red',
      });
    }
  };

  return (
    <>
      <LoadingOverlay visible={loadingFiles} />
      <Title order={3}>Dateien</Title>
      <Stack className={classes.filesWrapper} spacing="xs">
        {files && (
          <>
            <Group
              className={classes.fileActions}
              align="center"
              position="apart"
            >
              <Group spacing="xs">
                {files.some((file) => file.selected) ? (
                  <>
                    <Button
                      color="teal"
                      leftIcon={<FontAwesomeIcon icon={faDownload} />}
                    >
                      Download
                    </Button>
                    <Button
                      color="red"
                      leftIcon={<FontAwesomeIcon icon={faTrashAlt} />}
                      onClick={handleDelete}
                    >
                      Lösche
                    </Button>
                  </>
                ) : (
                  <Text>Wähle Dateien aus.</Text>
                )}
              </Group>
              <Button
                leftIcon={<FontAwesomeIcon icon={faUpload} />}
                onClick={fileUploadModalHandler.open}
              >
                Upload
              </Button>
            </Group>
            <FileList
              path={path}
              setPath={setPath}
              files={files}
              filesHandler={filesHandler}
              openNewFolderModal={newFolderModalHandler.open}
            />
          </>
        )}
      </Stack>
      <Modal
        opened={fileUploadModalOpened}
        onClose={fileUploadModalHandler.close}
        centered
        title="Upload"
        withCloseButton={!isUploading}
        closeOnClickOutside={!isUploading}
        closeOnEscape={!isUploading}
      >
        <FileUploadModal
          files={files}
          close={fileUploadModalHandler.close}
          path={path}
          filesHandler={filesHandler}
          isUploading={isUploading}
          setIsUploading={setIsUploading}
        />
      </Modal>
      <Modal
        opened={newFolderModalOpened}
        onClose={newFolderModalHandler.close}
        centered
        title="Neuer Ordner"
      >
        <NewFolderModal
          files={files}
          close={newFolderModalHandler.close}
          path={path}
          filesHandler={filesHandler}
        />
      </Modal>
    </>
  );
};

export default Files;

const useStyles = createStyles((theme) => ({
  filesWrapper: {
    flexGrow: 1,
  },

  fileActions: {
    height: 36,
  },
}));
