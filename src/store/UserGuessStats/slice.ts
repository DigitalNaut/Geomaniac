import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import { pushToErrorLog } from "src/store/ErrorLog/slice";
import { startMiddlewareListening } from "src/store/listenerMiddleware";
import { LocalStorage } from "src/store/utility/localStorage";
import type { CountryStats, CountryStatsPayload } from "./types";
import { CountryStatsSchema } from "./types";

const STATS_KEY = "countryStats";
export const statsStorage = new LocalStorage<CountryStats>(STATS_KEY, CountryStatsSchema);

const defaultState = CountryStatsSchema.parse({});
const initialState: CountryStats = statsStorage.load() ?? defaultState;

const userGuessStatsSlice = createSlice({
  name: "userGuessStats",
  initialState,
  reducers: {
    pushCountryStat: (
      state,
      { payload: { ISO_A2_EH, GU_A3, GEOUNIT, isCorrect } }: PayloadAction<CountryStatsPayload>,
    ) => {
      const country = state[GU_A3];

      const newState: CountryStats = {
        ...state,
        [GU_A3]: {
          GEOUNIT,
          ISO_A2_EH,
          GU_A3,
          correctGuesses: (country?.correctGuesses ?? 0) + (isCorrect ? 1 : 0),
          incorrectGuesses: (country?.incorrectGuesses ?? 0) + (isCorrect ? 0 : 1),
          lastGuessTimestamp: Date.now(),
        },
      };

      return newState;
    },

    clearCountryStats: () => defaultState,
  },
});

export const { pushCountryStat, clearCountryStats } = userGuessStatsSlice.actions;
export default userGuessStatsSlice.reducer;

startMiddlewareListening({
  actionCreator: pushCountryStat,
  effect: (_, { getState, dispatch }) => {
    const result = statsStorage.set(getState().guessStats);
    if (!result.success) dispatch(pushToErrorLog(result.error));
  },
});

startMiddlewareListening({
  actionCreator: clearCountryStats,
  effect: () => statsStorage.clear(),
});
