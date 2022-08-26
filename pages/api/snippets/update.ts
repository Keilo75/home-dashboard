import fs from "fs-extra";
import { snippetsPath } from "models/paths";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await fs.writeJSON(snippetsPath, req.body);

  res.status(200).send({});
};

export default handler;
