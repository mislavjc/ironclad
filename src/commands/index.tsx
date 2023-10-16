import React, { useEffect, useState } from 'react';
import { TextInput } from '@inkjs/ui';
import { Text } from 'ink';

import { readEnvVars, updateEnvVars } from '../lib/env.js';

export default function Index() {
  const [step, setStep] = useState(1);
  const [apiKey, setApiKey] = useState('');

  const [appName, setAppName] = useState('');

  useEffect(() => {
    const envVars = readEnvVars();
    if (envVars.API_KEY) {
      setApiKey(envVars.API_KEY);
      setStep(2);
    }
  }, []);

  const handleApiKeySubmit = (newKey: string) => {
    setApiKey(newKey);
    setStep(2);
  };

  const handleAppNameSubmit = (newName: string) => {
    setAppName(newName);
    updateEnvVars({ VAR: newName, API_KEY: apiKey });
    setStep(3);
  };

  return (
    <>
      {step === 1 && (
        <>
          <Text>No API key found.</Text>
          <TextInput
            placeholder="Enter your API key..."
            onSubmit={handleApiKeySubmit}
          />
        </>
      )}
      {step === 2 && (
        <>
          <Text>Using API key found in .envjiijij</Text>
          <TextInput
            placeholder="Enter your app name..."
            onSubmit={handleAppNameSubmit}
          />
        </>
      )}
      {step === 3 && <Text>Done! {appName} is ready</Text>}
    </>
  );
}
