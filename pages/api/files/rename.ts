import { IFileItem } from "models/files";
import { filesPath } from "models/paths";
import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs-extra";
import { getFilesFromDir } from "./list";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<IFileItem[]>
) => {
  const currentPath = req.query.path as string;
  const file = req.query.file as string;
  const newName = req.query.name as string;

  const userPath = path.join(filesPath, currentPath);
  const oldFilePath = path.join(userPath, file);
  const newFilePath = path.join(userPath, newName);

  try {
    await fs.rename(oldFilePath, newFilePath);

    const newFiles = await getFilesFromDir(userPath);
    res.status(200).json(newFiles);
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
};

export default handler;
