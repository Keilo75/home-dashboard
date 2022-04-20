export interface IBaseFileItem {
  name: string;
  id: string;
  selected: boolean;
}

export interface IFile extends IBaseFileItem {
  isFolder: false;
  size: number;
  lastModified: number;
  extension: string;
}

export interface IFolder extends IBaseFileItem {
  isFolder: true;
}

export type IFileItem = IFolder | IFile;

export const isValidName = (name: string) =>
  name.match(
    /^(con|prn|aux|nul|com[0-9]|lpt[0-9])$|([<>:"\/\\|?*])|(\.|\s)$/gi
  );

export type FileType =
  | 'image'
  | 'video'
  | 'audio'
  | 'compressed'
  | 'executable'
  | 'excel'
  | 'word'
  | 'powerpoint'
  | 'plain';

export const extensions: Record<FileType, string[]> = {
  image: ['.png', '.jpg', '.jpeg', '.gif'],
  video: ['.mp4', '.mov', '.wmv', '.avi'],
  audio: ['.cda', '.mid', '.mp3', '.ogg', '.wav'],
  compressed: ['.7z', '.deb', '.rar', '.zip'],
  executable: ['.apk', '.bat', '.bin', '.exe', '.jar', '.msi'],
  powerpoint: ['.pptx', '.ppt', '.odp'],
  excel: ['.ods', '.xls', '.xlsm', '.xlsx'],
  word: ['.doc', '.docx', '.odt', '.pdf'],
  plain: ['.txt', '.md'],
};

export const previewableExtensions: FileType[] = [
  'plain',
  'image',
  'video',
  'audio',
];

export const isExtensionPreviewable = (extension: string): boolean => {
  for (const ext of previewableExtensions) {
    if (extensions[ext].includes(extension)) return true;
  }

  return false;
};
