import {
  faCode,
  faFileExcel,
  faFilePowerpoint,
  faFileWord,
  faFileZipper,
  faFolder,
  faFont,
  faImage,
  faMusic,
  faVideo,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import React from 'react';
import { extensions, FileType } from 'models/files';

const icons: Record<FileType, IconDefinition> = {
  audio: faMusic,
  video: faVideo,
  compressed: faFileZipper,
  excel: faFileExcel,
  powerpoint: faFilePowerpoint,
  word: faFileWord,
  executable: faCode,
  image: faImage,
  plain: faFont,
};

interface FileIconProps {
  type: string;
}

const FileIcon: React.FC<FileIconProps> = ({ type }) => {
  if (type === 'folder') return <FontAwesomeIcon icon={faFolder} />;

  for (const [fileType, extensionList] of Object.entries(extensions)) {
    if (extensionList.includes(type))
      return <FontAwesomeIcon icon={icons[fileType as keyof typeof icons]} />;
  }

  return null;
};

export default FileIcon;
