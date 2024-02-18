import React, { useEffect, useState } from 'react';
import { Alert, Spinner, TextInput } from '@inkjs/ui';
import { Text } from 'ink';
import yaml from 'js-yaml';

import { OpenAPIGenericSchema } from '../../types/openapi.js';
import { generateRunFunction } from '../lib/ai.js';
import { readEnvVars, updateEnvVars } from '../lib/env.js';
import {
  generateFunctionCalls,
  generateSchema,
  getOperations,
  resolveComponentReferences,
  stripResponsesFromSchema,
} from '../lib/openapi.js';

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

    generateSchema(newUrl);

    setStep(4);

    const doc = stripResponsesFromSchema(
      resolveComponentReferences(yaml.load(yamlContent) as OpenAPIGenericSchema)
    );

    setStep(5);

    const paths = Object.keys(doc.paths).slice(0, 10);

    const operations = getOperations({ paths, doc });

    await generateFunctionCalls({
      paths,
      doc,
    });

    setStep(7);

    await generateRunFunction(operations);

    setStep(8);
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
      {step === 3 && (
        <>
          <Spinner label={`Loading ${openApiUrl}`} />
        </>
      )}
      {step >= 4 && (
        <Alert variant="success">
          Types for OpenAPI schema generated successfully!
        </Alert>
      )}
      {step === 5 && (
        <>
          <Spinner label="Generating function calls for OpenAPI schema..." />
        </>
      )}
      {step >= 6 && (
        <Alert variant="success">
          Function calls for OpenAPI schema generated successfully!
        </Alert>
      )}
      {step === 7 && (
        <>
          <Spinner label="Generating runFunction.ts..." />
        </>
      )}
      {step >= 8 && (
        <Alert variant="success">runFunction.ts generated successfully!</Alert>
      )}
    </>
  );
}
