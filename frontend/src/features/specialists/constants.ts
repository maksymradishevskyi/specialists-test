import type { Filters, SortOption } from './types';

export const DEFAULT_LIMIT = 10;
export const PRICE_RANGE = { min: 50, max: 300 };
export const AGE_RANGE = { min: 18, max: 80 };

export const emptyFilters: Filters = { genders: [] };
export const defaultSort: SortOption = { sortBy: 'rating', sortDirection: 'desc' };

