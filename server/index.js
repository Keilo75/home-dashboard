const express = require('express');
const next = require('next');
const path = require("path")

const dev = process.env.NODE_ENV !== 'production';
const port = dev ? 3000 : 80;
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.get('/download', (req, res) => {
    const filesPath = path.join(process.cwd(), '..', 'files');

    const currentPath = req.query.path;
    const userPath = path.join(filesPath, currentPath);

    const files = Array.isArray(req.query.file)
      ? req.query.file
      : [req.query.file];

    if (files.length === 1) {
      res.setHeader("Content-Disposition", `attachment; filename=${files[0]}`)
      res.status(200).sendFile(path.join(userPath, files[0]))
    } else {
      res.status(200).send(filesPath)

    }

  })

  server.get('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    console.log(`> Ready on port ${port}`);
  });
});
