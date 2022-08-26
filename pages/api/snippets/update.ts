import fs from "fs-extra";
import { filesPath, snippetsPath } from "models/paths";
import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import mime from "mime-types";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await fs.writeJSON(snippetsPath, req.body);

  res.status(200).send({});
};

export default handler;
