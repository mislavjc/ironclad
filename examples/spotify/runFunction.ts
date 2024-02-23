import createClient from 'openapi-fetch';

import type { operations, paths } from './api.js';

const client = createClient<paths>({ baseUrl: 'https://api.spotify.com/v1' });

type GetProperty<
  Path extends keyof operations,
  Property extends string
> = Property extends keyof operations[Path]
  ? operations[Path][Property]
  : never;

export const runFunction = async (
  name: string,
  args: Record<string, unknown>
) => {
  switch (name) {
    case 'get-an-album':
      return await client
        ?.GET('/albums/{id}', {
          params: args['params'] as GetProperty<'get-an-album', 'parameters'>,
        })
        .then((res) => res?.data || res.error);

    case 'get-multiple-albums':
      return await client
        ?.GET('/albums', {
          params: args['params'] as GetProperty<
            'get-multiple-albums',
            'parameters'
          >,
        })
        .then((res) => res?.data || res.error);

    case 'get-an-albums-tracks':
      return await client
        ?.GET('/albums/{id}/tracks', {
          params: args['params'] as GetProperty<
            'get-an-albums-tracks',
            'parameters'
          >,
        })
        .then((res) => res?.data || res.error);

    case 'get-an-artist':
      return await client
        ?.GET('/artists/{id}', {
          params: args['params'] as GetProperty<'get-an-artist', 'parameters'>,
        })
        .then((res) => res?.data || res.error);

    case 'get-multiple-artists':
      return await client
        ?.GET('/artists', {
          params: args['params'] as GetProperty<
            'get-multiple-artists',
            'parameters'
          >,
        })
        .then((res) => res?.data || res.error);

    case 'get-an-artists-albums':
      return await client
        ?.GET('/artists/{id}/albums', {
          params: args['params'] as GetProperty<
            'get-an-artists-albums',
            'parameters'
          >,
        })
        .then((res) => res?.data || res.error);

    case 'get-an-artists-top-tracks':
      return await client
        ?.GET('/artists/{id}/top-tracks', {
          params: args['params'] as GetProperty<
            'get-an-artists-top-tracks',
            'parameters'
          >,
        })
        .then((res) => res?.data || res.error);

    case 'get-an-artists-related-artists':
      return await client
        ?.GET('/artists/{id}/related-artists', {
          params: args['params'] as GetProperty<
            'get-an-artists-related-artists',
            'parameters'
          >,
        })
        .then((res) => res?.data || res.error);

    case 'get-a-show':
      return await client
        ?.GET('/shows/{id}', {
          params: args['params'] as GetProperty<'get-a-show', 'parameters'>,
        })
        .then((res) => res?.data || res.error);

    case 'get-multiple-shows':
      return await client
        ?.GET('/shows', {
          params: args['params'] as GetProperty<
            'get-multiple-shows',
            'parameters'
          >,
        })
        .then((res) => res?.data || res.error);

    default:
      throw new Error(`Function ${name} does not exist`);
  }
};
