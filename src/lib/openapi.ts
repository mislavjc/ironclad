/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { exec } from 'child_process';
import { writeFile } from 'fs/promises';
import OpenAI from 'openai';

import { OpenAPIGenericSchema } from '../../types/openapi.js';

import { generateRunFunction } from './ai.js';
import { readEnvVars } from './env.js';
import { buildPrompt } from './prompt.js';

const openai = new OpenAI({
  apiKey: readEnvVars().OPENAI_API_KEY,
});

export const resolveComponentReferences = (
  schema: OpenAPIGenericSchema
): OpenAPIGenericSchema => {
  const resolvedSchema = JSON.parse(JSON.stringify(schema));

  const resolveRef = ($ref: string) => {
    const parts = $ref.replace(/^#\//, '').split('/');
    let currentPart = resolvedSchema;
    for (const part of parts) {
      currentPart = currentPart[part];
    }
    return currentPart;
  };

  Object.keys(resolvedSchema.paths).forEach((path) => {
    const methods = resolvedSchema.paths[path];
    Object.keys(methods).forEach((method) => {
      const operation = methods[method];

      if (operation.parameters) {
        operation.parameters = operation.parameters.map(
          (param: { $ref: string }) => {
            if (param.$ref) {
              return resolveRef(param.$ref);
            }
            return param;
          }
        );
      }

      if (operation.requestBody && operation.requestBody.$ref) {
        operation.requestBody = resolveRef(operation.requestBody.$ref);
      }

      Object.keys(operation.responses).forEach((statusCode) => {
        const response = operation.responses[statusCode];
        if (response.$ref) {
          operation.responses[statusCode] = resolveRef(response.$ref);
        } else if (response.content) {
          Object.keys(response.content).forEach((contentType) => {
            const content = response.content[contentType];
            if (content.schema && content.schema.$ref) {
              content.schema = resolveRef(content.schema.$ref);
            }
          });
        }
      });
    });
  });

  return resolvedSchema;
};

export const stripResponsesFromSchema = (
  schema: OpenAPIGenericSchema
): OpenAPIGenericSchema => {
  const schemaWithoutResponses = JSON.parse(JSON.stringify(schema));

  Object.keys(schemaWithoutResponses.paths).forEach((path) => {
    const methods = schemaWithoutResponses.paths[path];
    Object.keys(methods).forEach((method) => {
      const operation = methods[method];
      if (operation) {
        delete operation.responses;
      }
    });
  });

  return schemaWithoutResponses;
};

export const getYamlContent = async (url: string) => {
  const yamlContent = await fetch(url).then((res) => res.text());

  return yamlContent;
};

export const generateSchema = (url: string) => {
  const command = `npx openapi-typescript ${url} --o ./generated/api.ts`;

  exec(command, (error, _stdout, stderr) => {
    if (error) {
      console.error(`Error executing command: ${error.message}`);
      // Handle error here
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      // Handle stderr here
      return;
    }

    console.log(
      "File generated/api.ts has been created with the OpenAPI schema's types."
    );
  });
};

type OperationProps = {
  paths: string[];
  doc: OpenAPIGenericSchema;
};

export const getOperations = ({ paths, doc }: OperationProps) => {
  const operations = paths.flatMap((path) => {
    const pathValue = doc.paths[path];

    if (!pathValue) {
      throw new Error(`No value found for path ${path}`);
    }

    const methods = Object.keys(pathValue);

    return methods.map((method) => {
      const operation = pathValue[method];

      if (!operation) {
        throw new Error(`No value found for method ${method}`);
      }

      return {
        path,
        operationId: operation.operationId as string,
        method,
      };
    });
  });

  return operations;
};

type GenerateFunctionCallsProps = OperationProps & {
  operations: Array<{
    path: string;
    operationId: string;
    method: string;
  }>;
};

export const generateFunctionCalls = async ({
  paths,
  doc,
  operations,
}: GenerateFunctionCallsProps) => {
  const promises = paths.map(async (path) => {
    const firstPropValue = doc.paths[path];

    const prompt = buildPrompt(JSON.stringify(firstPropValue));

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a friendly AI assistant that only returns JSON',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return JSON.parse(completion.choices[0]?.message.content || '');
  });

  try {
    const functionCalls = await Promise.all(promises);

    const functionCallsString = JSON.stringify(functionCalls, null, 2);

    const content = `export const functions = ${functionCallsString};`;

    await writeFile('./generated/functions.ts', content, 'utf8');

    console.log(
      'File generated/functions.ts has been created with the function calls.'
    );

    await generateRunFunction(operations);

    exec(
      'npx eslint ./generated/functions.ts --fix',
      (error, _stdout, stderr) => {
        if (error) {
          console.error(`Error running ESLint: ${error.message}`);
          return;
        }
        if (stderr) {
          console.error(`ESLint stderr: ${stderr}`);
          return;
        }

        console.log('ESLint has been run on generated/functions.ts');
      }
    );
  } catch (error) {
    console.error('An error occurred:', error);
  }
};
