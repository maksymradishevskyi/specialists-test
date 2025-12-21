import { useCallback, useEffect, useState } from 'react';
import { DEFAULT_LIMIT } from '../constants';
import type { Filters, SortOption } from '../types';
import type { Specialist } from '../specialistsApi';
import { useLazyGetSpecialistsQuery } from '../specialistsApi';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { selectFavoriteIds, toggleFavorite as toggleFavoriteAction } from '../favoritesSlice';

type UseSpecialistsResult = {
  specialists: Specialist[];
  hasMore: boolean;
  total: number | null;
  isFetching: boolean;
  isInitialLoading: boolean;
  favoriteIds: Set<string>;
  toggleFavorite: (id: string) => void;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  error: unknown;
};

export const useSpecialists = (filters: Filters, sortOption: SortOption): UseSpecialistsResult => {
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState<number | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(false);

  const [fetchSpecialists, { isFetching, error }] = useLazyGetSpecialistsQuery();
  const dispatch = useAppDispatch();
  const favoriteIds = useAppSelector(selectFavoriteIds);

  const toggleFavorite = useCallback(
    (id: string) => {
      dispatch(toggleFavoriteAction(id));
    },
    [dispatch]
  );

  const loadPage = useCallback(
    async (nextOffset: number, reset = false) => {
      if (reset) {
        setIsInitialLoading(true);
        setHasMore(true);
        setSpecialists([]);
        setTotal(null);
      }

      const requestLimit = DEFAULT_LIMIT;

      const genderParam =
        filters.genders && filters.genders.length === 1 ? filters.genders[0] : undefined;

      try {
        const data = await fetchSpecialists({
          limit: requestLimit,
          offset: nextOffset,
          minAge: filters.minAge,
          maxAge: filters.maxAge,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          gender: genderParam,
          sortBy: sortOption.sortBy,
          sortDirection: sortOption.sortDirection
        }).unwrap();

        setTotal(data.total);
        setHasMore(data.hasMore);
        setSpecialists((prev) => {
          if (reset) {
            return data.items;
          }
          const merged = [...prev, ...data.items];
          return merged;
        });
      } catch {
        // Stop infinite scroll from retriggering while offline/unreachable
        setHasMore(false);
      } finally {
        if (reset) {
          setIsInitialLoading(false);
        }
      }
    },
    [fetchSpecialists, filters.genders, filters.maxAge, filters.maxPrice, filters.minAge, filters.minPrice, sortOption.sortBy, sortOption.sortDirection]
  );

  useEffect(() => {
    void loadPage(0, true);
  }, [loadPage]);

  const refresh = useCallback(
    async () => {
      await loadPage(0, true);
    },
    [loadPage]
  );

  const loadMore = useCallback(async () => {
    if (!hasMore || isFetching) return;
    await loadPage(specialists.length, false);
  }, [hasMore, isFetching, loadPage, specialists.length]);

  return {
    specialists,
    hasMore,
    total,
    isFetching,
    isInitialLoading,
    favoriteIds,
    toggleFavorite,
    loadMore,
    refresh,
    error
  };
};

