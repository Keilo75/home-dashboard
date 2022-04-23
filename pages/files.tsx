import {
  faDownload,
  faTrashAlt,
  faUpload,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Button,
  Center,
  createStyles,
  Group,
  Loader,
  LoadingOverlay,
  Modal,
  Overlay,
  Paper,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useDisclosure, useListState } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import axios from 'axios';
import FileListHeader from 'components/Files/FileListHeader';
import FileListRow from 'components/Files/FileListRow';
import FilePreviewModal from 'components/Files/FilePreviewModal';
import FileUploadModal from 'components/Files/FileUploadModal';
import { IFile, IFileItem } from 'models/files';
import { NextPage } from 'next';
import React, { useEffect, useRef, useState } from 'react';

const Files: NextPage = () => {
  const { classes } = useStyles();

  const [path, setPath] = useState<string[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [files, filesHandler] = useListState<IFileItem>();
  const [isUploading, setIsUploading] = useState(false);
  const [creatingZIP, setCreatingZIP] = useState<'loading' | 'finished'>();

  const [fileUploadModalOpened, fileUploadModalHandler] = useDisclosure(false);
  const [filePreviewModalOpened, filePreviewModalHandler] =
    useDisclosure(false);
  const filePreviewModalFile = useRef<IFile>();

  useEffect(() => {
    setLoadingFiles(true);

    axios
      .get<IFileItem[]>(`/api/files/list?path=${path.join('/')}`)
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
      const response = await axios.delete<IFileItem[]>(request);

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

  const openFilePreviewModal = (file: IFile) => {
    filePreviewModalFile.current = file;
    filePreviewModalHandler.open();
  };

  const handleDownload = async () => {
    const selectedFiles = files.filter((file) => file.selected);
    const needsZip =
      selectedFiles.length > 1 || selectedFiles.some((file) => file.isFolder);

    if (!needsZip) {
      window.open(
        `/download?path=${path.join('/')}&file=${selectedFiles[0].name}&zip=0`
      );

      return;
    }

    try {
      setCreatingZIP('loading');

      await axios.post<string>(
        `/zip?path=${path.join('/')}${files
          .filter((file) => file.selected)
          .map((file) => `&file=${file.name}`)
          .join('')}`
      );
      setCreatingZIP('finished');
    } catch {
      showNotification({
        title: 'ZIP-Datei konnte nicht erstellt werden',
        message: 'Maximale Größe ist 100MB',
        color: 'red',
      });
      setCreatingZIP(undefined);
    }

    return;
  };

  const handleZIPDownload = () => {
    setCreatingZIP(undefined);
    setTimeout(() => {
      window.open(`/download?path=..&file=download.zip&zip=1`);
    }, 10);
  };

  return (
    <>
      {creatingZIP !== undefined && (
        <>
          <Overlay color="black" />
          <Center className={classes.creatingZIPCenter}>
            <Stack align="center">
              <Text>
                {creatingZIP === 'loading' ? 'Erstelle ZIP-Datei' : 'Fertig!'}
              </Text>
              {creatingZIP === 'loading' ? (
                <>
                  <Loader />
                </>
              ) : (
                <Button
                  color="teal"
                  leftIcon={<FontAwesomeIcon icon={faDownload} />}
                  onClick={handleZIPDownload}
                >
                  Download
                </Button>
              )}
            </Stack>
          </Center>
        </>
      )}
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
                      onClick={handleDownload}
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
            <Paper shadow="xs" className={classes.fileList} radius={0}>
              <FileListHeader
                path={path}
                setPath={setPath}
                files={files}
                filesHandler={filesHandler}
              />
              {files.length > 0 ? (
                files.map((file, index) => (
                  <FileListRow
                    key={file.id}
                    setPath={setPath}
                    file={file}
                    index={index}
                    filesHandler={filesHandler}
                    openFilePreviewModal={openFilePreviewModal}
                  />
                ))
              ) : (
                <Text pl="sm">Keine Dateien gefunden.</Text>
              )}
            </Paper>
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
        opened={filePreviewModalOpened}
        onClose={filePreviewModalHandler.close}
        centered
        title="Vorschau"
      >
        {filePreviewModalFile.current && (
          <FilePreviewModal
            close={filePreviewModalHandler.close}
            file={filePreviewModalFile.current}
            path={path}
          />
        )}
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

  fileList: {
    flexGrow: 1,
    flexBasis: 0,
    overflowY: 'auto',
    position: 'relative',
  },

  creatingZIPCenter: {
    zIndex: 100000,
    position: 'absolute',
    inset: 0,
  },
}));
