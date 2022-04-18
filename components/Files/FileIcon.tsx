import { faFolder, faFont } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import React from 'react';

interface FileIconProps {
  type: string;
}

const FileIcon: React.FC<FileIconProps> = ({ type }) => {
  const icons: Record<string, IconDefinition> = {
    folder: faFolder,
    txt: faFont,
  };

  // TODO: Add more file types
  if (type in icons) return <FontAwesomeIcon icon={icons[type]} />;

  return null;
};

export default FileIcon;
