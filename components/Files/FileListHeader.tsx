import { faHome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Paper,
  Group,
  Checkbox,
  Breadcrumbs,
  Anchor,
  Divider,
  createStyles,
  Text,
} from '@mantine/core';
import React from 'react';

interface FileListHeaderProps {
  path: string[];
  selectedFileIDs: string[];
}

const FileListHeader: React.FC<FileListHeaderProps> = ({
  path,
  selectedFileIDs,
}) => {
  const { classes } = useStyles();

  return (
    <Paper className={classes.fileListHeader} radius={0} mb="xs">
      <Group p="xs" align="center" spacing="xs" noWrap>
        <Checkbox />
        <Text>{selectedFileIDs.length}</Text>
        <Breadcrumbs className={classes.breadcrumbs}>
          <Anchor>
            <FontAwesomeIcon icon={faHome} size="xs" />
          </Anchor>
          {path.map((item, index) => (
            <Anchor key={index}>{item}</Anchor>
          ))}
        </Breadcrumbs>
      </Group>
      <Divider />
    </Paper>
  );
};

export default FileListHeader;

const useStyles = createStyles((theme) => ({
  fileList: {
    flexGrow: 1,
    flexBasis: 0,
    overflowY: 'auto',
    position: 'relative',
  },

  fileListHeader: {
    position: 'sticky',
    top: 0,
  },

  breadcrumbs: {
    height: '100%',
    flexGrow: 1,
    marginLeft: theme.spacing.sm,
    padding: '3px 0',
    overflow: 'hidden',
  },
}));
