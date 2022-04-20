import { IFile } from 'models/files';
import { filesPath } from 'models/paths';
import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import fs from 'fs-extra';
import { getFilesFromDir } from './get-list';

const handler = async (req: NextApiRequest, res: NextApiResponse<IFile[]>) => {
  const currentPath = req.query.path as string;
  const folder = req.query.folder as string;
  const userPath = path.join(filesPath, currentPath);

  try {
    const folderPath = path.join(userPath, folder);
    await fs.mkdir(folderPath);

    const newFiles = await getFilesFromDir(userPath);
    res.status(200).json(newFiles);
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
};

export default handler;
