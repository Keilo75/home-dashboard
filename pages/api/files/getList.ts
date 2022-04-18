import { IBaseFile, IFile } from 'models/files';
import { filesPath } from 'models/paths';
import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import fs from 'fs-extra';
import { v4 as uuid } from 'uuid';

const handler = async (req: NextApiRequest, res: NextApiResponse<IFile[]>) => {
  const reqPath = req.query.path as string;
  const listPath = path.join(filesPath, reqPath);

  const fileList = await fs.readdir(listPath);
  const files = (
    await Promise.all(
      fileList.map((file) => fs.stat(path.join(listPath, file)))
    )
  ).map<IFile>((stat, index) => {
    const base: IBaseFile = { name: fileList[index], id: uuid() };

    if (stat.isDirectory()) return { ...base, isFolder: true };

    return {
      ...base,
      isFolder: false,
      lastModified: stat.mtimeMs,
      size: stat.size,
      extension: path.extname(fileList[index]),
    };
  });

  res.status(200).json(files);
};

export default handler;
