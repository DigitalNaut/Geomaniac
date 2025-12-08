import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

type LogEntry = {
  id: string;
  error: Error;
};

const LOG_SIZE_LIMIT = 10;

const initialState: LogEntry[] = [];

const errorLogSlice = createSlice({
  name: "errorLog",
  initialState,
  reducers: {
    pushToErrorLog: (state, { payload }: PayloadAction<Error>) => {
      const newLog = [...state, { id: crypto.randomUUID(), error: payload }];

      if (newLog.length > LOG_SIZE_LIMIT) newLog.shift();

      return newLog;
    },

    clearErrorLog: () => [],
  },
});

export const { pushToErrorLog, clearErrorLog } = errorLogSlice.actions;
export default errorLogSlice.reducer;
