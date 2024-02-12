export const buildPrompt = (object: string) => {
  return `Return the JSON for a function calling object for the object, 
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
                  name: 'get-an-album',
                  description: 'Get Spotify catalog information for a single album.',
                  parameters: [
                    { name: 'album_id', type: 'string' },
                    { name: 'market', type: 'string' }
                  ],
                  ,
            </EXAMPLE RETURN>

            <OBJECT>
              ${object}
            </OBJECT>

            Now create return JSON for the function calling object for the object above.

            Do not include the <EXAMPLE OBJECT> or <EXAMPLE RETURN> tags in your response.
        `;
};
