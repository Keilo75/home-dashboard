import {
  faDownload,
  faPen,
  faTrashAlt,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
} from "@mantine/core";
import { useDisclosure, useListState } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import axios from "axios";
import FileListHeader from "components/Files/FileListHeader";
import FileListRow from "components/Files/FileListRow";
import FileDeleteModal from "components/Files/Modals/FileDeleteModal";
import FilePreviewModal from "components/Files/Modals/FilePreviewModal";
import FileRenameModal from "components/Files/Modals/FileRenameModal";
import FileUploadModal from "components/Files/Modals/FileUploadModal";
import { IFile, IFileItem, isValidName as canNameBeUsed } from "models/files";
import { NextPage } from "next";
import React, { useEffect, useRef, useState } from "react";

const Files: NextPage = () => {
  const { classes } = useStyles();

  const [path, setPath] = useState<string[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [files, filesHandler] = useListState<IFileItem>();
  const [isUploading, setIsUploading] = useState(false);
  const [creatingZIP, setCreatingZIP] = useState(false);

  const [fileUploadModalOpened, fileUploadModalHandler] = useDisclosure(false);
  const [fileRenameModalOpened, fileRenameModalHandler] = useDisclosure(false);
  const [fileDeleteModalOpened, fileDeleteModalHandler] = useDisclosure(false);
  const [filePreviewModalOpened, filePreviewModalHandler] =
    useDisclosure(false);
  const currentFileItem = useRef<IFileItem>();

  useEffect(() => {
    setLoadingFiles(true);

    axios
      .get<IFileItem[]>(`/api/files/list?path=${path.join("/")}`)
      .then((res) => res.data)
      .then((res) => {
        filesHandler.setState(res);
        setLoadingFiles(false);
      });

    // filesHandler does not need to be added to the deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  const openFileRenameModal = () => {
    const selectedFile = files.find((file) => file.selected);
    if (!selectedFile) return;

    currentFileItem.current = selectedFile;
    fileRenameModalHandler.open();
  };

  const openFilePreviewModal = (file: IFile) => {
    currentFileItem.current = file;
    filePreviewModalHandler.open();
  };

  const handleDownload = async () => {
    const selectedFiles = files.filter((file) => file.selected);
    const needsZip =
      selectedFiles.length > 1 || selectedFiles.some((file) => file.isFolder);

    if (!needsZip) {
      window.open(
        `/download?path=${path.join("/")}&file=${selectedFiles[0].name}&zip=0`
      );

      return;
    }

    try {
      setCreatingZIP(true);

      const fileCount = selectedFiles.filter((file) => !file.isFolder).length;
      const folderCount = selectedFiles.length - fileCount;

      let zipName = "";
      if (selectedFiles.length === 1) {
        zipName = selectedFiles[0].name;
      } else {
        const names = ["Ordner", "Datei(en)"];
        zipName = [folderCount, fileCount]
          .map((count, index) => `${count} ${names[index]}`)
          .filter((name) => !name.startsWith("0"))
          .join(", ");
      }

      await axios.post<string>(
        `/zip?path=${path.join("/")}${selectedFiles
          .map((file) => `&file=${file.name}`)
          .join("")}`
      );
      setCreatingZIP(false);

      window.open(`/download?path=..&file=download.zip&zip=1&name=${zipName}`);
    } catch {
      showNotification({
        title: "ZIP-Datei konnte nicht erstellt werden",
        message: "Maximale Größe ist 100MB",
        color: "red",
      });
      setCreatingZIP(false);
    }

    return;
  };

  const isValidName = (name: string): string | null => {
    if (files.some((file) => file.name === name)) return "Existiert bereits";
    return canNameBeUsed(name) ? "Ungültiger Name" : null;
  };

  const handleFileDeleteModalOpen = () => {
    currentFileItem.current = undefined;
    fileDeleteModalHandler.open();
  };

  return (
    <>
      {creatingZIP === true && (
        <>
          <Overlay color="black" />
          <Center className={classes.creatingZIPCenter}>
            <Stack align="center">
              <Text color="white">Erstelle ZIP-Datei</Text>
              <Loader />
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
                      onClick={handleFileDeleteModalOpen}
                    >
                      Löschen
                    </Button>
                    <Button
                      leftIcon={<FontAwesomeIcon icon={faPen} />}
                      onClick={openFileRenameModal}
                      disabled={
                        files.filter((file) => file.selected).length > 1
                      }
                    >
                      Umbennen
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
                isValidName={isValidName}
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
        {currentFileItem.current && !currentFileItem.current.isFolder && (
          <FilePreviewModal
            close={filePreviewModalHandler.close}
            file={currentFileItem.current}
            path={path}
            openFileRenameModal={fileRenameModalHandler.open}
            openFileDeleteModal={fileDeleteModalHandler.open}
          />
        )}
      </Modal>
      <Modal
        opened={fileRenameModalOpened}
        onClose={fileRenameModalHandler.close}
        centered
        title="Umbennen"
      >
        {currentFileItem.current && (
          <FileRenameModal
            close={fileRenameModalHandler.close}
            file={currentFileItem.current}
            path={path}
            filesHandler={filesHandler}
            isValidName={isValidName}
          />
        )}
      </Modal>
      <Modal
        opened={fileDeleteModalOpened}
        onClose={fileDeleteModalHandler.close}
        centered
        title="Löschen"
      >
        <FileDeleteModal
          close={fileDeleteModalHandler.close}
          path={path}
          filesHandler={filesHandler}
          files={files}
          fileToDelete={currentFileItem.current}
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

  fileList: {
    flexGrow: 1,
    flexBasis: 0,
    overflowY: "auto",
    position: "relative",
  },

  creatingZIPCenter: {
    zIndex: 100000,
    position: "absolute",
    inset: 0,
  },
}));
