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
import FileList from 'components/Files/FileList';
import FileUploadModal from 'components/Files/FileUploadModal';
import { IFile } from 'models/files';
import { NextPage } from 'next';
import React, { useEffect, useState } from 'react';

const Files: NextPage = () => {
  const { classes } = useStyles();

  const [path, setPath] = useState<string[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [files, filesHandler] = useListState<IFile>();

  const [fileUploadModalOpened, fileUploadModalHandler] = useDisclosure(true);

  useEffect(() => {
    setLoadingFiles(true);

    fetch(`/api/files/getList?path=${path.join('/')}`)
      .then((res) => res.json())
      .then((res) => {
        filesHandler.setState(res);
        setLoadingFiles(false);
      });
    // filesHandler does not need to be added to the deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

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
            />
          </>
        )}
      </Stack>
      <Modal
        opened={fileUploadModalOpened}
        onClose={fileUploadModalHandler.close}
        centered
        title="Upload"
      >
        <FileUploadModal close={fileUploadModalHandler.close} />
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
