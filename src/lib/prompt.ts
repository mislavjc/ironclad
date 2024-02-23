export const buildPrompt = (object: string) => {
  return `Return the JSON for a function calling object for the object, 
            <GET EXAMPLE OBJECT>
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
            </GET EXAMPLE OBJECT>

            <GET EXAMPLE RETURN>
              {
                name: 'get-an-album',
                description: 'Get Spotify catalog information for a single album.',
                parameters: [
                  {
                    name: 'params',
                    type: 'object',
                    description: 'Object with all params data',
                    properties: {
                      path: { type: 'object', description: 'Object with all path data', properties: { id: { type: 'string', description: 'The Spotify ID of the album', example: '4aawyAB9vmqN3uQ7FjRGTy' } } },
                      query: { type: 'object', description: 'Object with all query data', properties: { market: { type: 'string', description: 'An ISO 3166-1 alpha-2 country code', example: 'ES' } } }
                    }
                  }
                ],
              }
            </GET EXAMPLE RETURN>

            <POST EXAMPLE OBJECT>
            {
    "tags": ["Playlists", "Tracks"],
    "operationId": "add-tracks-to-playlist",
    "summary": "Add Items to Playlist\n",
    "description": "Add one or more items to a user's playlist.\n",
    "parameters": [
      {
        "name": "playlist_id",
        "required": true,
        "in": "path",
        "schema": {
          "title": "Playlist ID",
          "description": "The [Spotify ID](/documentation/web-api/concepts/spotify-uris-ids) of the playlist.\n",
          "example": "3cEYpjA9oz9GiPac4AsH4n",
          "type": "string"
        }
      },
      {
        "name": "position",
        "required": false,
        "in": "query",
        "schema": {
          "title": "Position (append by default)",
          "description": "The position to insert the items, a zero-based index. For example, to insert the items in the first position: "position=0"; to insert the items in the third position: "position=2". If omitted, the items will be appended to the playlist. Items are added in the order they are listed in the query string or request body.\n",
          "example": 0,
          "type": "integer"
        }
      },
      {
        "name": "uris",
        "required": false,
        "in": "query",
        "schema": {
          "title": "Spotify Track URIs",
          "description": "A comma-separated list of [Spotify URIs](/documentation/web-api/concepts/spotify-uris-ids) to add, can be track or episode URIs. For example:<br/>"uris=spotify:track:4iV5W9uYEdYUVa79Axb7Rh, spotify:track:1301WleyT98MSxVHPZCA6M, spotify:episode:512ojhOuo1ktJprKbVcKyQ"<br/>A maximum of 100 items can be added in one request. <br/>\n_**Note**: it is likely that passing a large number of item URIs as a query parameter will exceed the maximum length of the request URI. When adding a large number of items, it is recommended to pass them in the request body, see below._\n",
          "example": "spotify:track:4iV5W9uYEdYUVa79Axb7Rh,spotify:track:1301WleyT98MSxVHPZCA6M",
          "type": "string"
        }
      }
    ],
    "requestBody": {
      "content": {
        "application/json": {
          "schema": {
            "type": "object",
            "additionalProperties": true,
            "properties": {
              "uris": {
                "description": "A JSON array of the [Spotify URIs](/documentation/web-api/concepts/spotify-uris-ids) to add. For example: "{"uris": ["spotify:track:4iV5W9uYEdYUVa79Axb7Rh","spotify:track:1301WleyT98MSxVHPZCA6M", "spotify:episode:512ojhOuo1ktJprKbVcKyQ"]}"<br/>A maximum of 100 items can be added in one request. _**Note**: if the "uris" parameter is present in the query string, any URIs listed here in the body will be ignored._\n",
                "type": "array",
                "items": {
                  "type": "string"
                }
              },
              "position": {
                "description": "The position to insert the items, a zero-based index. For example, to insert the items in the first position: "position=0" ; to insert the items in the third position: "position=2". If omitted, the items will be appended to the playlist. Items are added in the order they appear in the uris array. For example: "{"uris": ["spotify:track:4iV5W9uYEdYUVa79Axb7Rh","spotify:track:1301WleyT98MSxVHPZCA6M"], "position": 3}"\n",
                "type": "integer"
              }
            }
          }
        }
      }
    },
    "security": [
      {
        'oauth_2_0': ['playlist-modify-public', 'playlist-modify-private']
      }
    ]
  },
  </POST EXAMPLE OBJECT>

  <POST EXAMPLE RETURN>
  {
  "name": "add-tracks-to-playlist",
  "description": "Add one or more items to a user's playlist.",
  "parameters": [
    {
      "name": "params",
      "type": "object",
      "description": "Object with all params data",
      "properties": {
        "path": {
          "type": "object",
          "description": "Object with all path data",
          "properties": {
            "playlist_id": {
              "type": "string",
              "description": "The Spotify ID of the playlist",
              "example": "3cEYpjA9oz9GiPac4AsH4n"
            }
          }
        },
        "query": {
          "type": "object",
          "description": "Object with all query data",
          "properties": {
            "position": {
              "type": "integer",
              "description": "Position (append by default)",
              "example": 0
            },
            "uris": {
              "type": "string",
              "description": "Spotify Track URIs",
              "example": "spotify:track:4iV5W9uYEdYUVa79Axb7Rh,spotify:track:1301WleyT98MSxVHPZCA6M"
            }
          }
        },
      }
    },
    {
      "name": "body",
      "type": "object",
      "description": "Object with all data data",
      "properties": {
        "uris": {
          "type": "array",
          "description": "A JSON array of the Spotify URIs to add",
          "items": {
            "type": "string"
          }
        },
        "position": {
          "type": "integer",
          "description": "The position to insert the items, a zero-based index",
          "example": 0
        }
      }
    }
  ]
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
