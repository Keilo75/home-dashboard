export type IFile =
  | {
      isFolder: true;
      name: string;
    }
  | {
      isFolder: false;
      name: string;
      size: number;
      lastModified: number;
    };
