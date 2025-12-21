import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DEFAULT_LIMIT } from '../constants';
import type { Filters, SortOption } from '../types';
import type { Specialist } from '../specialistsApi';
import { useLazyGetFavoritesQuery } from '../specialistsApi';

type UseFavoritesResult = {
  favorites: Specialist[];
  hasMore: boolean;
  total: number | null;
  isFetching: boolean;
  isInitialLoading: boolean;
  error: unknown;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
};

const buildParams = (
  filters: Filters,
  sortOption: SortOption,
  favoriteIds: string[],
  offset: number
) => {
  const genderParam = filters.genders && filters.genders.length === 1 ? filters.genders[0] : undefined;

  return {
    limit: DEFAULT_LIMIT,
    offset,
    minAge: filters.minAge,
    maxAge: filters.maxAge,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    gender: genderParam,
    sortBy: sortOption.sortBy,
    sortDirection: sortOption.sortDirection,
    ids: favoriteIds
  };
};

export const useFavorites = (
  filters: Filters,
  sortOption: SortOption,
  favoriteIds: string[],
  enabled: boolean
): UseFavoritesResult => {
  const [favorites, setFavorites] = useState<Specialist[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState<number | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [fetchFavorites, { isFetching, error }] = useLazyGetFavoritesQuery();
  const lastDeps = useRef<string>('');
  const wasEnabled = useRef<boolean>(false);

  const depsKey = useMemo(
    () => JSON.stringify({ filters, sortOption, ids: favoriteIds }),
    [favoriteIds, filters, sortOption]
  );

  const loadPage = useCallback(
    async (nextOffset: number, reset = false) => {
      if (!enabled) return;

      if (favoriteIds.length === 0) {
        setFavorites([]);
        setHasMore(false);
        setTotal(0);
        setIsInitialLoading(false);
        return;
      }

      if (reset) {
        setIsInitialLoading(true);
        setHasMore(false);
        setTotal(null);
      }

      const params = buildParams(filters, sortOption, favoriteIds, nextOffset);
      try {
        const data = await fetchFavorites(params, true).unwrap();

        setHasMore(data.hasMore);
        setTotal(data.total);
        setFavorites((prev) => {
          if (reset) return data.items;
          return [...prev, ...data.items];
        });
      } finally {
        if (reset) {
          setIsInitialLoading(false);
        }
      }
    },
    [enabled, favoriteIds, fetchFavorites, filters, sortOption]
  );

  useEffect(() => {
    if (!enabled) {
      setFavorites([]);
      setHasMore(false);
      setTotal(null);
      setIsInitialLoading(false);
      wasEnabled.current = false;
      return;
    }

    const depsChanged = lastDeps.current !== depsKey;
    const enabledJustNow = !wasEnabled.current;

    if (depsChanged || enabledJustNow) {
      lastDeps.current = depsKey;
      wasEnabled.current = true;
      void loadPage(0, true);
    }
  }, [depsKey, enabled, loadPage]);

  const loadMore = useCallback(async () => {
    if (!enabled || isFetching || !hasMore) return;
    await loadPage(favorites.length, false);
  }, [enabled, favorites.length, hasMore, isFetching, loadPage]);

  const refresh = useCallback(async () => {
    await loadPage(0, true);
  }, [loadPage]);

  return {
    favorites,
    hasMore,
    total,
    isFetching,
    isInitialLoading,
    error,
    loadMore,
    refresh
  };
};

