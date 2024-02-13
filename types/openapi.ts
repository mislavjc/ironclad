/* eslint-disable @typescript-eslint/no-explicit-any */
export interface OpenAPIGenericSchema {
  openapi: string;
  info: {
    title: string;
    version: string;
    description?: string;
    termsOfService?: string;
    contact?: {
      name?: string;
      url?: string;
      email?: string;
    };
    license?: {
      name: string;
      url?: string;
    };
  };
  servers?: Array<{
    url: string;
    description?: string;
  }>;
  paths: {
    [path: string]: {
      [method: string]: {
        summary?: string;
        description?: string;
        operationId?: string;
        tags?: string[];
        parameters?: Array<{
          name: string;
          in: 'query' | 'header' | 'path' | 'cookie';
          description?: string;
          required?: boolean;
          deprecated?: boolean;
          schema: any;
        }>;
        requestBody?: {
          description?: string;
          content: {
            [contentType: string]: {
              schema: any;
            };
          };
          required?: boolean;
        };
        responses: {
          [statusCode: string]: {
            description: string;
            content?: {
              [contentType: string]: {
                schema: any;
              };
            };
          };
        };
        security?: Array<{
          [securityScheme: string]: string[];
        }>;
      };
    };
  };
  components?: {
    schemas?: { [key: string]: any };
    responses?: { [key: string]: any };
    parameters?: { [key: string]: any };
    securitySchemes?: { [key: string]: any };
    requestBodies?: { [key: string]: any };
    headers?: { [key: string]: any };
    links?: { [key: string]: any };
    callbacks?: { [key: string]: any };
  };
  security?: Array<{
    [securityScheme: string]: string[];
  }>;
  tags?: Array<{
    name: string;
    description?: string;
  }>;
}
