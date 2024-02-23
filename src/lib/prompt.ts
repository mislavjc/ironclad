export const buildPrompt = (object: string) => {
  return `Return the JSON for a function calling object for the object, 
            <GET EXAMPLE OBJECT>
            {
              operationId: 'get-an-album',
              'x-spotify-policy-list': { '$ref': '#/components/x-spotify-policy/metadataPolicyList' },
              tags: [ 'Albums' ],
              summary: 'Get Album\n',
              description: 'Get Spotify catalog information for a single album.\n',
              parameters: {
                path: {
                  id: {
                    type: 'string',
                    description: 'The Spotify ID of the album',
                    example: '4aawyAB9vmqN3uQ7FjRGTy',
                  },
                },
                query: {
                  market: {
                    type: 'string',
                    description: 'An ISO 3166-1 alpha-2 country code',
                    example: 'ES',
                  },
                },
              },
              security: [ { oauth_2_0: [] } ]
            }
            </GET EXAMPLE OBJECT>

            <GET EXAMPLE RETURN>
              {
                name: 'get-an-album',
                description: 'Get Spotify catalog information for a single album.',
                parameters: {
                  params: {
                    type: 'object',
                    description: 'Object with all params data',
                    properties: {
                      path: {
                        type: 'object',
                        description: 'Object with all path data',
                        properties: {
                          id: {
                            type: 'string',
                            description: 'The Spotify ID of the album',
                            example: '4aawyAB9vmqN3uQ7FjRGTy',
                          },
                        },
                      },
                      query: {
                        type: 'object',
                        description: 'Object with all query data',
                        properties: {
                          market: {
                            type: 'string',
                            description: 'An ISO 3166-1 alpha-2 country code',
                            example: 'ES',
                          },
                        },
                      },
                    },
                  },
                },
              }
            </GET EXAMPLE RETURN>

            <POST EXAMPLE OBJECT>
            {
              "tags": ["Playlists", "Tracks"],
              "operationId": "add-tracks-to-playlist",
              "summary": "Add Items to Playlist\n",
              "description": "Add one or more items to a user's playlist.\n",
              "parameters": {
                playlist_id: {
                  type: 'string',
                  description: 'The Spotify ID of the playlist',
                  example: '3cEYpjA9oz9GiPac4AsH4n',
                },
                position: {
                  type: 'integer',
                  description: 'Position (append by default)',
                  example: 0,
                },
                uris: {
                  type: 'string',
                  description: 'Spotify Track URIs',
                  example: 'spotify:track:4iV5W9uYEdYUVa79Axb7Rh,spotify:track:1301WleyT98MSxVHPZCA6M',
                },
              },
              requestBody: {
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      additionalProperties: true,
                      properties: {
                        uris: {
                          description: 'A JSON array of the Spotify URIs to add',
                          type: 'array',
                          items: {
                            type: 'string',
                          },
                        },
                        position: {
                          type: 'integer',
                          description: 'The position to insert the items, a zero-based index',
                          example: 0,
                        },
                      },
                    },
                  },
                },
              },
              security: [
                {
                  oauth_2_0: ['playlist-modify-public', 'playlist-modify-private'],
                },
              ],
            },
            </POST EXAMPLE OBJECT>

            <POST EXAMPLE RETURN>
            {
              "name": "add-tracks-to-playlist",
              "description": "Add one or more items to a user's playlist.",
              "parameters": {
                params: {
                  type: 'object',
                  description: 'Object with all params data',
                  properties: {
                    path: {
                      type: 'object',
                      description: 'Object with all path data',
                      properties: {
                        playlist_id: {
                          type: 'string',
                          description: 'The Spotify ID of the playlist',
                          example: '3cEYpjA9oz9GiPac4AsH4n',
                        },
                      },
                    },
                    query: {
                      type: 'object',
                      description: 'Object with all query data',
                      properties: {
                        position: {
                          type: 'integer',
                          description: 'Position (append by default)',
                          example: 0,
                        },
                        uris: {
                          type: 'string',
                          description: 'Spotify Track URIs',
                          example: 'spotify:track:4iV5W9uYEdYUVa79Axb7Rh,spotify:track:1301WleyT98MSxVHPZCA6M',
                        },
                      },
                    },
                  },
                },
                body: {
                  type: 'object',
                  description: 'Object with all data data',
                  properties: {
                    uris: {
                      type: 'array',
                      description: 'A JSON array of the Spotify URIs to add',
                      items: {
                        type: 'string',
                      },
                    },
                    position: {
                      type: 'integer',
                      description: 'The position to insert the items, a zero-based index',
                      example: 0,
                    },
                  },
                },
              },
            }
            </POST EXAMPLE RETURN>   
  
            The structure for PUT, PATCH, and DELETE is the same as POST.
            <OBJECT>
              ${object}
            </OBJECT>

            Now create return JSON for the function calling object for the object above.

            Do not include the <EXAMPLE OBJECT> or <EXAMPLE RETURN> tags in your response.
        `;
};
