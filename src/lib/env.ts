interface EnvVars {
  OPENAPI_SCHEMA_URL: string | undefined;
  OPENAI_API_KEY: string | undefined;
}

import { existsSync, readFileSync, writeFileSync } from 'fs';

export const readEnvVars = (): Partial<EnvVars> => {
  if (!existsSync('.env')) {
    return {};
  }
  const envContent = readFileSync('.env', 'utf-8');
  const lines = envContent.split('\n');
  const envVars: Partial<EnvVars> = {};
  lines.forEach((line) => {
    const [key, value] = line.split('=');
    if (key) {
      envVars[key as keyof EnvVars] = value;
    }
  });
  return envVars;
};

export const updateEnvVars = (newVars: Partial<EnvVars>) => {
  const envContent = Object.entries(newVars)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
  writeFileSync('.env', envContent, 'utf-8');
};
