import type { SpecialistGender } from './specialistsApi';

export type Filters = {
  minAge?: number;
  maxAge?: number;
  genders?: SpecialistGender[];
  minPrice?: number;
  maxPrice?: number;
};

export type SortOption = {
  sortBy: 'rating' | 'price' | 'age' | 'name';
  sortDirection: 'asc' | 'desc';
};

