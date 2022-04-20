import {
  Anchor,
  Button,
  Center,
  createStyles,
  Group,
  Paper,
  Text,
} from '@mantine/core';
import axios from 'axios';
import { IFile, isExtensionPreviewable } from 'models/files';
import prettyBytes from 'pretty-bytes';
import React, { useEffect, useMemo } from 'react';

interface FileUploadModalProps {
  close: () => void;
  file: IFile;
  path: string[];
}

const FilePreviewModal: React.FC<FileUploadModalProps> = ({
  close,
  file,
  path,
}) => {
  const { classes } = useStyles();
  const date = useMemo(
    () => new Date(file.lastModified).toLocaleString('de-DE'),
    [file]
  );

  const handleIFrameLoad: React.ReactEventHandler<HTMLIFrameElement> = (e) => {
    const body = e.currentTarget.contentWindow?.document.body;
    if (!body) return;

    body.style.display = 'grid';
    body.style.placeItems = 'center';
  };

  return (
    <>
      <Paper className={classes.filePreview} mb="sm">
        {file.size > 4_000_000 || !isExtensionPreviewable(file.extension) ? (
          <Text p="sm">Vorschau kann nicht geladen werden.</Text>
        ) : (
          <Center>
            <iframe
              className={classes.iframe}
              src={`/api/files/preview?path=${path.join('/')}&file=${
                file.name
              }`}
              onLoad={handleIFrameLoad}
              width={400}
            />
          </Center>
        )}
      </Paper>

      <Text>Größe: {prettyBytes(file.size)}</Text>
      <Text>Änderungsdatum: {date}</Text>

      <Group position="right" mt="sm">
        <Button variant="default" onClick={close}>
          Zurück
        </Button>
      </Group>
    </>
  );
};

export default FilePreviewModal;

const useStyles = createStyles((theme) => ({
  filePreview: {
    backgroundColor:
      theme.colorScheme === 'dark'
        ? theme.colors.gray[9]
        : theme.colors.gray[1],
  },

  iframe: {
    border: 0,
  },
}));
