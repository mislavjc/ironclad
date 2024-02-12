import React, { useEffect, useState } from 'react';
import { Spinner, TextInput } from '@inkjs/ui';
import { exec } from 'child_process';
import { Text } from 'ink';

import { readEnvVars, updateEnvVars } from '../lib/env.js';

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
      handleOpenApiUrlSubmit(envVars.OPENAPI_SCHEMA_URL);
      setStep(3);
    }
  }, []);

  const handleApiKeySubmit = (newKey: string) => {
    setApiKey(newKey);
    setStep(2);
  };

  const handleOpenApiUrlSubmit = (newUrl: string) => {
    setOpenApiUrl(newUrl);
    updateEnvVars({ OPENAPI_SCHEMA_URL: newUrl, OPENAI_API_KEY: apiKey });
    setStep(3);

    const command = `npx openapi-typescript ${newUrl} --o ./generated/api.ts && eslint ./generated/api.ts --fix`;

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

    setStep(4);
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
            onSubmit={handleOpenApiUrlSubmit}
          />
        </>
      )}
      {step === 3 && <Spinner label={`Loading ${openApiUrl}`} />}
    </>
  );
}
