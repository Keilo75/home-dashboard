import { IBaseFile, IFile } from 'models/files';
import { filesPath } from 'models/paths';
import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import fs from 'fs-extra';
import { v4 as uuid } from 'uuid';

const handler = async (req: NextApiRequest, res: NextApiResponse<IFile[]>) => {
  const reqPath = req.query.path as string;
  const listPath = path.join(filesPath, reqPath);
  const files = await getFilesFromDir(listPath);

  res.status(200).json(files);
};

export default handler;

export const getFilesFromDir = async (dir: string): Promise<IFile[]> => {
  const fileList = await fs.readdir(dir);
  const files = (
    await Promise.all(fileList.map((file) => fs.stat(path.join(dir, file))))
  )
    .map<IFile>((stat, index) => {
      const base: IBaseFile = {
        name: fileList[index],
        id: uuid(),
        selected: false,
      };

      if (stat.isDirectory()) return { ...base, isFolder: true };

      return {
        ...base,
        isFolder: false,
        lastModified: stat.mtimeMs,
        size: stat.size,
        extension: path.extname(fileList[index]),
      };
    })
    .sort((a, b) => (b.isFolder ? 1 : 0) - (a.isFolder ? 1 : 0));

  return files;
};
