import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export type SpecialistGender = 'man' | 'woman';

export interface Specialist {
  id: string;
  name: string;
  avatar: string;
  pricePerSession: number;
  sessionDurationMinutes: number;
  rating: number;
  reviewsCount: number;
  description: string;
  age: number;
  gender: SpecialistGender;
  countryCode?: string;
  experienceYears?: number;
  clientsCount?: number;
  sessionsCount?: number;
  availabilitySlots?: string[];
}

export interface SpecialistsResponse {
  items: Specialist[];
  total: number;
  hasMore: boolean;
}

export interface SpecialistsQuery {
  limit?: number;
  offset?: number;
  minAge?: number;
  maxAge?: number;
  gender?: SpecialistGender;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'rating' | 'price' | 'age' | 'name';
  sortDirection?: 'asc' | 'desc';
}

export interface FavoritesQuery extends SpecialistsQuery {
  ids?: string[];
}

const baseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/';

export const specialistsApi = createApi({
  reducerPath: 'specialistsApi',
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: ['Specialists'],
  endpoints: (builder) => ({
    getSpecialists: builder.query<SpecialistsResponse, SpecialistsQuery | void>({
      query: (params) => ({
        url: 'specialists',
        params: params ?? {}
      }),
      providesTags: (result) =>
        result?.items
          ? [
              ...result.items.map(({ id }) => ({ type: 'Specialists' as const, id })),
              { type: 'Specialists' as const, id: 'LIST' }
            ]
          : [{ type: 'Specialists' as const, id: 'LIST' }]
    }),
    getFavorites: builder.query<SpecialistsResponse, FavoritesQuery>({
      query: (params) => ({
        url: 'specialists/favorites',
        params
      })
    })
  })
});

export const { useLazyGetSpecialistsQuery, useLazyGetFavoritesQuery } = specialistsApi;

