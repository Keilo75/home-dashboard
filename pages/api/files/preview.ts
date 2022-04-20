import fs from 'fs-extra';
import { filesPath } from 'models/paths';
import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import mime from 'mime-types';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const currentPath = req.query.path as string;
  const file = req.query.file as string;

  const filePath = path.join(filesPath, currentPath, file);
  const buffer = await fs.readFile(filePath);

  const extension = path.extname(file);
  const mimeType = mime.lookup(extension);
  if (mimeType) res.setHeader('Content-Type', mimeType);

  res.send(buffer);
};

export default handler;
