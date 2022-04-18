export interface IBaseFile {
  name: string;
  id: string;
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
