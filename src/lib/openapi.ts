/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { OpenAPIGenericSchema } from '../../types/openapi.js';

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
