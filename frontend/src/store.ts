import { configureStore } from '@reduxjs/toolkit';
import { specialistsApi } from './features/specialists/specialistsApi';

export const store = configureStore({
  reducer: {
    [specialistsApi.reducerPath]: specialistsApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(specialistsApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

