const express = require('express');
const next = require('next');
const path = require('path');
const fs = require('fs');
const generateZip = require('./generateZip');

const dev = process.env.NODE_ENV !== 'production';
const port = dev ? 3000 : 80;
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.get('/download', async (req, res) => {
    const filesPath = path.join(process.cwd(), '..', 'files');

    const currentPath = req.query.path;
    const userPath = path.join(filesPath, currentPath);

    const file =
      req.query.file

    const filePath = path.join(userPath, file);
    res.setHeader('Content-Disposition', `attachment; filename=${file}`);
    res.status(200).sendFile(filePath);
    return;
    const base64 = await generateZip(userPath, files);
    const zip = Buffer.from(base64, "base64");

    res.setHeader("Content-Type", "application/zip")
    res.setHeader('Content-Disposition', `attachment; filename=download.zip`);

    res.status(200).send(zip);

  });

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    console.log(`> Ready on port ${port}`);
  });
});
