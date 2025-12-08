import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import { pushToErrorLog } from "src/store/ErrorLog/slice";
import { startMiddlewareListening } from "src/store/listenerMiddleware";
import { LocalStorage } from "src/store/utility/localStorage";
import type { CountryGuess, GuessHistory } from "./types";
import { GuessHistorySchema } from "./types";

const HISTORY_LIMIT = 10;
const HISTORY_KEY = "guessHistory";

function timestampGuess(guess: Omit<CountryGuess, "timestamp">): CountryGuess {
  return {
    ...guess,
    timestamp: Date.now(),
  };
}

export const historyStorage = new LocalStorage<GuessHistory>(HISTORY_KEY, GuessHistorySchema);

const defaultState: GuessHistory = [];
const initialState = historyStorage.load() ?? defaultState;

const userGuessHistory = createSlice({
  name: "userGuessHistory",
  initialState,
  reducers: {
    pushGuessToHistory: (state, { payload }: PayloadAction<Omit<CountryGuess, "timestamp">>) => {
      const newHistory = [...state, timestampGuess(payload)];

      if (newHistory.length > HISTORY_LIMIT) newHistory.shift();

      return newHistory;
    },

    clearGuessHistory: () => defaultState,
  },
});

export const { pushGuessToHistory, clearGuessHistory } = userGuessHistory.actions;
export default userGuessHistory.reducer;

startMiddlewareListening({
  actionCreator: pushGuessToHistory,
  effect: (_, { getState, dispatch }) => {
    const result = historyStorage.set(getState().guessHistory);
    if (!result.success) dispatch(pushToErrorLog(result.error));
  },
});
