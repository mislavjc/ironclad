export const functions = [
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
  },
  {
    name: 'get-multiple-albums',
    description:
      'Get Spotify catalog information for multiple albums identified by their Spotify IDs.',
    parameters: {
      params: {
        type: 'object',
        description: 'Object with all params data',
        properties: {
          query: {
            type: 'object',
            description: 'Object with all query data',
            properties: {
              ids: {
                type: 'string',
                description:
                  'A comma-separated list of the Spotify IDs for the albums. Maximum: 20 IDs.',
                example:
                  '382ObEPsp2rxGrnsizN5TX,1A2GTWGtFfWp7KSQTwWOyo,2noRn2Aes5aoNVsU6iWThc',
              },
              market: {
                type: 'string',
                description:
                  'An ISO 3166-1 alpha-2 country code. If a country code is specified, only content that is available in that market will be returned. If a valid user access token is specified in the request header, the country associated with the user account will take priority over this parameter. Users can view the country that is associated with their account in the account settings.',
                example: 'ES',
              },
            },
          },
        },
      },
    },
    security: [
      {
        oauth_2_0: [],
      },
    ],
  },
  {
    name: 'get-an-albums-tracks',
    description:
      'Get Spotify catalog information about an album’s tracks. Optional parameters can be used to limit the number of tracks returned.',
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
              limit: {
                type: 'integer',
                description:
                  'The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.',
                default: 20,
                example: 10,
              },
              offset: {
                type: 'integer',
                description:
                  'The index of the first item to return. Default: 0 (the first item). Use with limit to get the next set of items.',
                default: 0,
                example: 5,
              },
            },
          },
        },
      },
      body: {},
    },
  },
  {
    name: 'get-an-artist',
    description:
      'Get Spotify catalog information for a single artist identified by their unique Spotify ID.',
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
                description: 'The Spotify ID of the artist',
                example: '0TnOYISbd1XYRBk9myaseg',
              },
            },
          },
        },
      },
    },
  },
  {
    name: 'get-multiple-artists',
    description:
      'Get Spotify catalog information for several artists based on their Spotify IDs.',
    parameters: {
      params: {
        type: 'object',
        description: 'Object with all params data',
        properties: {
          query: {
            type: 'object',
            description: 'Object with all query data',
            properties: {
              ids: {
                type: 'string',
                description:
                  'A comma-separated list of the Spotify IDs for the artists. Maximum: 100 IDs.',
                example:
                  '2CIMQHirSU0MQqyYHq0eOx,57dN52uHvrHOxijzpIgu3E,1vCWHaC5f2uS3yhpwWbIA6',
              },
            },
          },
        },
      },
      body: null,
    },
  },
  {
    name: 'get-an-artists-albums',
    description: "Get Spotify catalog information about an artist's albums.",
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
                description: 'The Spotify Artist ID',
                example: '0TnOYISbd1XYRBk9myaseg',
              },
            },
          },
          query: {
            type: 'object',
            description: 'Object with all query data',
            properties: {
              include_groups: {
                type: 'string',
                description:
                  'Groups to include (single, album, appears_on, compilation)',
                example: 'single,appears_on',
              },
              market: {
                type: 'string',
                description: 'Market, an ISO 3166-1 alpha-2 country code',
                example: 'ES',
              },
              limit: {
                type: 'integer',
                description:
                  'The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50',
                default: 20,
                example: 10,
                minimum: 0,
                maximum: 50,
              },
              offset: {
                type: 'integer',
                description:
                  'The index of the first item to return. Default: 0 (the first item). Use with limit to get the next set of items',
                default: 0,
                example: 5,
              },
            },
          },
        },
      },
      body: null,
    },
  },
  {
    name: 'get-an-artists-top-tracks',
    description:
      "Get Spotify catalog information about an artist's top tracks by country.",
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
                description: 'The Spotify ID of the artist.',
                example: '0TnOYISbd1XYRBk9myaseg',
              },
            },
          },
          query: {
            type: 'object',
            description: 'Object with all query data',
            properties: {
              market: {
                type: 'string',
                description:
                  'An ISO 3166-1 alpha-2 country code. If a country code is specified, only content that is available in that market will be returned.',
                example: 'ES',
              },
            },
          },
        },
      },
    },
    security: [
      {
        oauth_2_0: [],
      },
    ],
  },
  {
    name: 'get-an-artists-related-artists',
    description:
      "Get Spotify catalog information about artists similar to a given artist. Similarity is based on analysis of the Spotify community's listening history.",
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
                description: 'The Spotify Artist ID',
                example: '0TnOYISbd1XYRBk9myaseg',
              },
            },
          },
        },
      },
    },
    security: {
      type: 'array',
      properties: ['oauth_2_0'],
    },
  },
  {
    name: 'get-a-show',
    description:
      'Get Spotify catalog information for a single show identified by its unique Spotify ID.',
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
                description: 'The Spotify Show ID',
                example: '38bS44xjbVVZ3No3ByF1dJ',
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
    security: [
      {
        oauth_2_0: ['user-read-playback-position'],
      },
    ],
  },
  {
    name: 'get-multiple-shows',
    description:
      'Get Spotify catalog information for several shows based on their Spotify IDs.',
    parameters: {
      params: {
        type: 'object',
        description: 'Object with all params data',
        properties: {
          query: {
            type: 'object',
            description: 'Object with all query data',
            properties: {
              market: {
                type: 'string',
                description:
                  'An ISO 3166-1 alpha-2 country code. If a country code is specified, only content that is available in that market will be returned.',
                example: 'ES',
              },
              ids: {
                type: 'string',
                description:
                  'A comma-separated list of the Spotify IDs for the shows. Maximum: 50 IDs.',
                example: '5CfCWKI5pZ28U0uOzXkDHe,5as3aKmN2k11yfDDDSrvaZ',
              },
            },
          },
        },
      },
    },
  },
];
