import React, { useEffect, useState } from 'react';
import { Spinner, TextInput } from '@inkjs/ui';
import { exec } from 'child_process';
import { writeFile } from 'fs/promises';
import { Text } from 'ink';
import yaml from 'js-yaml';
import OpenAI from 'openai';

import { OpenAPIGenericSchema } from '../../types/openapi.js';
import { generateRunFunction } from '../lib/ai.js';
import { readEnvVars, updateEnvVars } from '../lib/env.js';
import {
  resolveComponentReferences,
  stripResponsesFromSchema,
} from '../lib/openapi.js';
import { buildPrompt } from '../lib/prompt.js';

const openai = new OpenAI({
  apiKey: readEnvVars().OPENAI_API_KEY,
});

export default function Index() {
  const [step, setStep] = useState(1);
  const [apiKey, setApiKey] = useState('');

  const [openApiUrl, setOpenApiUrl] = useState('');

  useEffect(() => {
    const envVars = readEnvVars();
    if (envVars.OPENAI_API_KEY) {
      setApiKey(envVars.OPENAI_API_KEY);
      setStep(2);
    }

    if (envVars.OPENAPI_SCHEMA_URL) {
      setOpenApiUrl(envVars.OPENAPI_SCHEMA_URL);
      void handleOpenApiUrlSubmit(envVars.OPENAPI_SCHEMA_URL);
      setStep(3);
    }
  }, []);

  const handleApiKeySubmit = (newKey: string) => {
    setApiKey(newKey);
    setStep(2);
  };

  const handleOpenApiUrlSubmit = async (newUrl: string) => {
    setOpenApiUrl(newUrl);

    updateEnvVars({
      OPENAI_API_KEY: readEnvVars().OPENAI_API_KEY || apiKey,
      OPENAPI_SCHEMA_URL: newUrl,
    });

    setStep(3);

    const yamlContent = await fetch(newUrl).then((res) => res.text());

    const command = `npx openapi-typescript ${newUrl} --o ./generated/api.ts`;

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

      setStep(4);
    });

    const doc = stripResponsesFromSchema(
      resolveComponentReferences(yaml.load(yamlContent) as OpenAPIGenericSchema)
    );

    const paths = Object.keys(doc.paths).slice(0, 10);

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

  return (
    <>
      {step === 1 && (
        <>
          <Text>No OpenAI API key found.</Text>
          <TextInput
            placeholder="Enter your OpenAI API key..."
            onSubmit={handleApiKeySubmit}
          />
        </>
      )}
      {step === 2 && (
        <>
          <Text>Using API key found in .env</Text>
          <TextInput
            placeholder="Enter your OpenAPI schema URL..."
            onSubmit={void handleOpenApiUrlSubmit}
          />
        </>
      )}
      {step === 3 && <Spinner label={`Loading ${openApiUrl}`} />}
    </>
  );
}
