const JSZip = require("jszip")
const fs = require("fs")
const path = require("path")

const addFilesFromDirectoryToZip = (folderPath, folderName, zip) => {
  const folder = zip.folder(folderName);

  const directoryContents = fs.readdirSync(folderPath, {
    withFileTypes: true,
  });

  directoryContents.forEach(({ name }) => {
    const filePath = path.join(folderPath, name);

    if (!fs.statSync(filePath).isDirectory()) {
      folder.file(name, fs.readFileSync(filePath));
    } else {
      addFilesFromDirectoryToZip(filePath, name, folder);
    }
  });
};

module.exports = generateZip = async (currentPath, files) => {
  const zip = new JSZip;

  files.forEach((file) => {
    const filePath = path.join(currentPath, file)

    if (!fs.statSync(filePath).isDirectory()) {
      zip.file(file, fs.readFileSync(filePath));
    } else {
      addFilesFromDirectoryToZip(filePath, file, zip);
    }
  });

  return await zip.generateAsync({ type: 'base64' });
}