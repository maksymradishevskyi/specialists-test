import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

const FAVORITES_KEY = 'specialist-favorites';

export type FavoritesState = {
  ids: string[];
};

const loadFavorites = (): string[] => {
  if (typeof localStorage === 'undefined') return [];
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? (parsed.filter((id) => typeof id === 'string') as string[]) : [];
  } catch {
    return [];
  }
};

const initialState: FavoritesState = {
  ids: loadFavorites()
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const index = state.ids.indexOf(id);
      if (index >= 0) {
        state.ids.splice(index, 1);
      } else {
        state.ids.push(id);
      }
    },
    hydrateFavorites: (state, action: PayloadAction<string[]>) => {
      state.ids = action.payload;
    }
  }
});

export const { toggleFavorite, hydrateFavorites } = favoritesSlice.actions;
export const favoritesReducer = favoritesSlice.reducer;

export const selectFavoriteIds = (state: { favorites: FavoritesState }): string[] =>
  state.favorites.ids;

export { FAVORITES_KEY };


