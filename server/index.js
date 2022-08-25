const express = require("express");
const next = require("next");
const path = require("path");
const fs = require("fs");
const generateZip = require("./generateZip");

const dev = process.env.NODE_ENV !== "production";
const port = dev ? 3000 : 80;
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.get("/download", async (req, res) => {
    const filesPath = path.join(process.cwd(), "..", "files");

    const currentPath = req.query.path;
    const userPath = path.join(filesPath, currentPath);

    const file = req.query.file;
    const name = req.query.name;

    const filePath = path.join(userPath, file);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${name ?? file}`
    );
    res.status(200).sendFile(filePath, {}, () => {
      const wasZip = req.query.zip === "1";
      if (wasZip) {
        fs.unlinkSync(filePath);
      }
    });
  });

  server.post("/zip", async (req, res) => {
    const filesPath = path.join(process.cwd(), "..", "files");

    const currentPath = req.query.path;
    const userPath = path.join(filesPath, currentPath);

    const files = Array.isArray(req.query.file)
      ? req.query.file
      : [req.query.file];
    const buffer = await generateZip(userPath, files);
    fs.writeFileSync(path.join(process.cwd(), "..", "download.zip"), buffer);
    res.status(200).send("");
  });

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    console.log(`> Ready on port ${port}`);
  });
});
