import { writeFile } from 'fs/promises';

export const generateRunFunction = async (
  operations: Array<{ path: string; operationId: string; method: string }>,
  serverUrl: string
) => {
  let runFunctionContent = `
    import createClient from "openapi-fetch";
    import type { paths, operations } from "./api.ts";

    const client = createClient<paths>({ baseUrl: "${serverUrl}" });

    type GetProperty<
      Path extends keyof operations,
      Property extends string
    > = Property extends keyof operations[Path]
      ? operations[Path][Property]
      : never;

    export const runFunction = async (name: string, args: Record<string, unknown>) => {
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
          params: args.params as GetProperty<'${operationId}', 'parameters'>,
        });
    `;
      return;
    }

    if (functionName === 'POST') {
      runFunctionContent += `
      case '${operationId}':
        return await client?.${functionName}("${path}", {
          params: args.params as GetProperty<'${operationId}', 'parameters'>,
          body: args.body as GetProperty<'${operationId}', 'requestBody'>,
        });
    `;
      return;
    }

    if (functionName === 'PUT') {
      runFunctionContent += `
      case '${operationId}':
        return await client?.${functionName}("${path}", {
          params: args.params as GetProperty<'${operationId}', 'parameters'>,
          body: args.body as GetProperty<'${operationId}', 'requestBody'>,
        });
    `;
      return;
    }

    if (functionName === 'PATCH') {
      runFunctionContent += `
      case '${operationId}':
        return await client?.${functionName}("${path}", {
          params: args.params as GetProperty<'${operationId}', 'parameters'>,
          body: args.body as GetProperty<'${operationId}', 'requestBody'>,
        });
    `;
      return;
    }

    if (functionName === 'DELETE') {
      runFunctionContent += `
      case '${operationId}':
        return await client?.${functionName}("${path}", {
          params: args.params as GetProperty<'${operationId}', 'parameters'>,
          body: args.body as GetProperty<'${operationId}', 'requestBody'>
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
