import * as fs from 'fs';

export class FileSystemUtils {
  static doesPathExist(path: string): boolean {
    return fs.existsSync(path)
  }

  static readFile(filePath: string) {
    return fs.readFileSync(filePath);
  }
}