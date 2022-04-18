import { IFile } from 'models/files';
import { filesPath } from 'models/paths';
import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import fs from 'fs-extra';

const handler = async (req: NextApiRequest, res: NextApiResponse<IFile[]>) => {
  const reqPath = req.query.path as string;
  const listPath = path.join(filesPath, reqPath);

  const fileList = await fs.readdir(listPath);
  const files = (
    await Promise.all(
      fileList.map((file) => fs.stat(path.join(listPath, file)))
    )
  ).map<IFile>((stat, index) => {
    if (stat.isDirectory()) return { name: fileList[index], isFolder: true };

    return {
      name: fileList[index],
      isFolder: false,
      lastModified: stat.mtimeMs,
      size: stat.size,
    };
  });
  console.log(files);

  res.status(200).json([]);
};

export default handler;
