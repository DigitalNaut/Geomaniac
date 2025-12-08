import type { Action, ThunkAction } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";

import countryStoreReducer, { initialState as initialCountryStore } from "./CountryStore/slice";
import errorLogReducer from "./ErrorLog/slice";
import { listenerMiddleware } from "./listenerMiddleware";
import guessHistoryReducer, { historyStorage } from "./UserGuessHistory/slice";
import userGuessStatsReducer, { statsStorage } from "./UserGuessStats/slice";
import userSettingsReducer, { settingsStorage } from "./UserSettings/slice";
import { UserSettingsSchema } from "./UserSettings/types";

export const store = configureStore({
  devTools: import.meta.env.DEV,
  preloadedState: {
    errorLog: [],
    settings: settingsStorage.load() ?? UserSettingsSchema.parse(undefined),
    guessHistory: historyStorage.load() ?? [],
    guessStats: statsStorage.load() ?? {},
    countryStore: initialCountryStore,
  },
  reducer: {
    errorLog: errorLogReducer,
    guessHistory: guessHistoryReducer,
    settings: userSettingsReducer,
    guessStats: userGuessStatsReducer,
    countryStore: countryStoreReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action>;
