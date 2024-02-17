import { exec } from 'child_process';
import { writeFile } from 'fs/promises';

export const generateRunFunction = async (
  operations: Array<{ path: string; operationId: string; method: string }>
) => {
  let runFunctionContent = `
    import createClient from "openapi-fetch";
    import type { paths } from "./api.ts";

    const client = createClient<paths>({ baseUrl: "https://myapi.dev/v1/" });

    export const runFunction = async (name: string, args: {
      params: {
        query: Record<string, string>;
        path: Record<string, string>;
      };
    }) => {
      switch (name) {
    `;

  operations.forEach(({ path, operationId, method }) => {
    const functionName = method.toUpperCase();

    if (!operationId) {
      throw new Error(`Operation ID not found for path ${path}`);
    }

    if (functionName === 'GET') {
      runFunctionContent += `
      case '${operationId}':
        return await client?.${functionName}("${path}", {
          params: args.params,
        });
    `;
      return;
    }

    if (functionName === 'POST') {
      runFunctionContent += `
      case '${operationId}':
        return await client?.${functionName}("${path}", {
          data: args,
        });
    `;
      return;
    }
  });

  runFunctionContent += `
      default:
        throw new Error(\`Function \${name} does not exist\`);
      }
    };
  `;

  await writeFile('./generated/runFunction.ts', runFunctionContent, 'utf8');

  console.log('File generated/runFunction.ts has been created.');

  exec(
    'npx eslint ./generated/runFunction.ts --fix',
    (error, _stdout, stderr) => {
      if (error) {
        console.error(`Error running ESLint: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`ESLint stderr: ${stderr}`);
        return;
      }

      console.log('ESLint has been run on generated/runFunction.ts');
    }
  );
};
