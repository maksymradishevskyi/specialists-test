import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { specialistsApi } from './features/specialists/specialistsApi';
import { favoritesReducer } from './features/specialists/favoritesSlice';

const rootReducer = combineReducers({
  [specialistsApi.reducerPath]: specialistsApi.reducer,
  favorites: favoritesReducer
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['favorites']
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    }).concat(specialistsApi.middleware)
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

