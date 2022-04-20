export interface IBaseFile {
  name: string;
  id: string;
  selected: boolean;
}

export type IFile = IBaseFile &
  (
    | {
        isFolder: true;
      }
    | {
        isFolder: false;
        size: number;
        lastModified: number;
        extension: string;
      }
  );

export const isValidName = (name: string) =>
  name.match(
    /^(con|prn|aux|nul|com[0-9]|lpt[0-9])$|([<>:"\/\\|?*])|(\.|\s)$/gi
  );
