import path from "path";

export const serverPath = process.cwd();
export const filesPath = path.join(serverPath, "..", "files");
export const snippetsPath = path.join(serverPath, "..", "snippets.json");
