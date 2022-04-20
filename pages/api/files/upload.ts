import formidable from 'formidable';
import fs from 'fs-extra';
import { IFile } from 'models/files';
import { filesPath } from 'models/paths';
import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import { getFilesFromDir } from './get-list';

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse<IFile[]>) => {
  const currentPath = req.query.path as string;
  const folder = req.query.folder as string;

  const userPath = path.join(filesPath, currentPath);
  const folderPath = path.join(userPath, folder);

  try {
    const data: formidable.Files = await new Promise((resolve, reject) => {
      const form = new formidable.IncomingForm({
        keepExtensions: true,
        maxFileSize: Infinity,
      });

      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve(files);
      });
    });

    if (folder.length > 0) await fs.mkdir(folderPath);

    await Promise.all<void>(
      Object.entries(data).map(
        (entry) =>
          new Promise(async (resolve, reject) => {
            const fileName = entry[0];
            const file = entry[1] as formidable.File;

            const raw = await fs.readFile(file.filepath);
            await fs.writeFile(path.join(folderPath, fileName), raw);

            resolve();
          })
      )
    );

    const newFiles = await getFilesFromDir(userPath);

    res.status(200).json(newFiles);
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
};

export default handler;
