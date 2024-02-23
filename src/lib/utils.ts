import { existsSync } from 'fs';
import { mkdir } from 'fs/promises';

export const createDirectoryIfNotExists = async (dirPath: string) => {
  if (!existsSync(dirPath)) {
    await mkdir(dirPath);
  }
};
