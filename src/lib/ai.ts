import { writeFile } from 'fs/promises';

export const generateRunFunction = async (
  operations: Array<{ path: string; operationId: string; method: string }>
) => {
  let runFunctionContent = `
    import createClient from "openapi-fetch";
    import type { paths, operations } from "./api.ts";

    type ValidOperations = 'get' | 'post' | 'put' | 'patch' | 'delete';

    type Operations<T extends ValidOperations> = {
      [K in keyof operations]: T extends keyof operations[K]
        ? {
          [M in keyof operations]: operations[K][T];
        }
      : never;
    };

    type GetOperations = Operations<'get'>;

    const client = createClient<paths>({ baseUrl: "https://myapi.dev/v1/" });

    export const runFunction = async <T extends keyof operations>(name: T, args: {
      params: GetOperations[T],
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
};
