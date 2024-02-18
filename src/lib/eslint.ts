import { exec } from 'child_process';

export const lintFile = async (filePath: string) => {
  return new Promise<void>((resolve, reject) => {
    exec(`eslint --fix ${filePath}`, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
};
