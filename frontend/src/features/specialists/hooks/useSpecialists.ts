import { useCallback, useEffect, useRef, useState } from 'react';
import { DEFAULT_LIMIT } from '../constants';
import type { Filters, SortOption } from '../types';
import type { Specialist } from '../specialistsApi';
import { useLazyGetSpecialistsQuery } from '../specialistsApi';

type UseSpecialistsResult = {
  specialists: Specialist[];
  hasMore: boolean;
  total: number | null;
  isFetching: boolean;
  isInitialLoading: boolean;
  favoriteIds: Set<string>;
  toggleFavorite: (id: string) => void;
  loadMore: () => Promise<void>;
  refresh: (limitOverride?: number) => Promise<void>;
  error: unknown;
  setNextResetLimit: (limit: number) => void;
};

const FAVORITES_KEY = 'specialist-favorites';

export const useSpecialists = (filters: Filters, sortOption: SortOption): UseSpecialistsResult => {
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState<number | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const resetLimitRef = useRef<number | null>(null);
  const currentCountRef = useRef(0);

  const [fetchSpecialists, { isFetching, error }] = useLazyGetSpecialistsQuery();

  const persistFavorites = useCallback((ids: Set<string>) => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify([...ids]));
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(FAVORITES_KEY);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as string[];
      setFavoriteIds(new Set(parsed));
    } catch {
      // ignore malformed storage
    }
  }, []);

  const toggleFavorite = useCallback(
    (id: string) => {
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        persistFavorites(next);
        return next;
      });
    },
    [persistFavorites]
  );

  const loadPage = useCallback(
    async (nextOffset: number, reset = false, limitOverride?: number) => {
      if (reset) {
        setIsInitialLoading(true);
        setHasMore(true);
        setSpecialists([]);
        setTotal(null);
      }

      const requestLimit =
        limitOverride ?? resetLimitRef.current ?? Math.max(currentCountRef.current, DEFAULT_LIMIT);

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
            currentCountRef.current = data.items.length;
            return data.items;
          }
          const merged = [...prev, ...data.items];
          currentCountRef.current = merged.length;
          return merged;
        });
        resetLimitRef.current = requestLimit;
      } catch {
        // errors are handled via the RTK query error state
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
    async (limitOverride?: number) => {
      await loadPage(0, true, limitOverride);
    },
    [loadPage]
  );

  const setNextResetLimit = useCallback((limit: number) => {
    resetLimitRef.current = limit;
  }, [loadPage]);

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
    error,
    setNextResetLimit
  };
};

