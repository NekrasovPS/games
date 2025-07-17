import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Game } from '../types/game';

interface ApiResponse {
  result: Game[];
  status: number;
  error_message: string;
}

export const gamesApi = createApi({
  reducerPath: 'gamesApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getGames: builder.query<Game[], { page: number; limit: number }>({
      query: ({ page, limit }) => ({
        url: '/list',
        params: {
          partner_name: 'belparyaj',
          _page: page,
          _limit: limit,
        },
      }),
      transformResponse: (response: ApiResponse) => {
        if (response && Array.isArray(response.result)) {
          return response.result;
        }
        console.error('Unexpected API response format', response);
        return [];
      },
    }),
  }),
});

export const { useGetGamesQuery } = gamesApi;
