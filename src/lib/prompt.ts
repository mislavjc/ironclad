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
                {
                  in: 'path',
                  name: 'id',
                  required: true,
                  schema: {
                    title: 'Spotify Album ID',
                    description: 'The [Spotify ID](/documentation/web-api/concepts/spotify-uris-ids) of the album.\n',
                    example: '4aawyAB9vmqN3uQ7FjRGTy',
                    type: 'string'
                  }
                },
                {
                  name: 'market',
                  required: false,
                  in: 'query',
                  schema: {
                    title: 'Market',
                    description: 'An [ISO 3166-1 alpha-2 country code](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2).\n' +
                      '  If a country code is specified, only content that is available in that market will be returned.<br/>\n' +
                      '  If a valid user access token is specified in the request header, the country associated with\n' +
                      '  the user account will take priority over this parameter.<br/>\n' +
                      '  _**Note**: If neither market or user country are provided, the content is considered unavailable for the client._<br/>\n' +
                      '  Users can view the country that is associated with their account in the [account settings](https://www.spotify.com/se/account/overview/).\n',
                    example: 'ES',
                    type: 'string'
                  }
                }
              ],
              security: [ { oauth_2_0: [] } ]
            }
            <EXAMPLE RETURN>
              {
                name: 'get-an-album',
                description: 'Get Spotify catalog information for a single album.',
                parameters: [
                  name: "path", type: "object", description: "Object with all path data", properties: { 
                  id: { type: "string", description: "The Spotify ID of the album", example: "4aawyAB9vmqN3uQ7FjRGTy" }
                  }},
                  { name: "query", type: "object", description: "Object with all query data", properties: {
                  market: { type: "string", description: "An ISO 3166-1 alpha-2 country code", example: "ES" }
                  }},
                  { name: "params", type: "object", description: "Object with all params data" },
                  ],
              }
            </EXAMPLE RETURN>

            <OBJECT>
              ${object}
            </OBJECT>

            Now create return JSON for the function calling object for the object above.

            Do not include the <EXAMPLE OBJECT> or <EXAMPLE RETURN> tags in your response.
        `;
};
