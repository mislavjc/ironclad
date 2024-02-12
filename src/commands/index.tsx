import React, { useEffect, useState } from 'react';
import { Spinner, TextInput } from '@inkjs/ui';
import { exec } from 'child_process';
import { Text } from 'ink';
import yaml from 'js-yaml';
import OpenAI from 'openai';

import { readEnvVars, updateEnvVars } from '../lib/env.js';

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
    const firstProp = Object.keys(
      (
        doc as {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          paths: unknown;
        }
      ).paths as object
    )[2];

    // @ts-expect-error no types
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
    const firstPropValue = doc.paths[firstProp];

    const prompt = `Return the JSON for a function calling object for the object, 
                    <EXAMPLE OBJECT>
                      {
                        operationId: 'get-an-album',
                        'x-spotify-policy-list': { '$ref': '#/components/x-spotify-policy/metadataPolicyList' },
                        tags: [ 'Albums' ],
                        summary: 'Get Album\n',
                        description: 'Get Spotify catalog information for a single album.\n',
                        parameters: [
                          { '$ref': '#/components/parameters/PathAlbumId' },
                          { '$ref': '#/components/parameters/QueryMarket' }
                        ],
                        responses: {
                          '200': { '$ref': '#/components/responses/OneAlbum' },
                          '401': { '$ref': '#/components/responses/Unauthorized' },
                          '403': { '$ref': '#/components/responses/Forbidden' },
                          '429': { '$ref': '#/components/responses/TooManyRequests' }
                        },
                        security: [ { oauth_2_0: [] } ]
                      }
                    <EXAMPLE RETURN>
                        {
                          name: 'get_an_album',
                          description: 'Get Spotify catalog information for a single album.',
                          parameters: [
                            { name: 'album_id', type: 'string' },
                            { name: 'market', type: 'string' }
                          ],
                        },
                    </EXAMPLE RETURN>

                    <OBJECT>
                      ${JSON.stringify(firstPropValue)}
                    </OBJECT>

                    Now create return JSON for the function calling object for the object above.

                    Do not include the <EXAMPLE OBJECT> or <EXAMPLE RETURN> tags in your response.
                `;

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

    // @ts-expect-error no types
    console.log(completion.choices[0].message.content);
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
