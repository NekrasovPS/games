import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Game } from '../types/game';

export const gamesApi = createApi({
  reducerPath: 'gamesApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getGames: builder.query<Game[], { page: number; limit: number }>({
      query: ({ page, limit }) => `/list?partner_name=belparyaj&page=${page}&limit=${limit}`,
      transformResponse: (response: { result: Game[] }) => response.result,
    }),
  }),
});

export const { useGetGamesQuery } = gamesApi;
