import React, { useEffect, useState } from 'react';
import { Spinner, TextInput } from '@inkjs/ui';
import { exec } from 'child_process';
import { writeFile } from 'fs/promises';
import { Text } from 'ink';
import yaml from 'js-yaml';
import OpenAI from 'openai';

import { readEnvVars, updateEnvVars } from '../lib/env.js';
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

    exec(command, (error, stdout, stderr) => {
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

      console.log(`stdout: ${stdout}`);

      setStep(4);
    });

    const doc = yaml.load(yamlContent);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const paths = Object.keys(
      (
        doc as {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          paths: unknown;
        }
      ).paths as object
    ).slice(0, 10);

    const promises = paths.map(async (path) => {
      // @ts-expect-error no types
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
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
      console.log(functionCalls);

      const functionCallsString = JSON.stringify(functionCalls, null, 2);

      const content = `export const functions = ${functionCallsString};`;

      await writeFile('./generated/functions.ts', content, 'utf8');

      console.log(
        'File generated/functions.ts has been created with the function calls.'
      );

      exec(
        'npx eslint ./generated/functions.ts --fix',
        (error, stdout, stderr) => {
          if (error) {
            console.error(`Error running ESLint: ${error.message}`);
            return;
          }
          if (stderr) {
            console.error(`ESLint stderr: ${stderr}`);
            return;
          }

          console.log('ESLint has been run on generated/functions.ts');
          console.log(stdout);
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
