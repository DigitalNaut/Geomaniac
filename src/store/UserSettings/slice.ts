import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import { pushToErrorLog } from "src/store/ErrorLog/slice";
import { startMiddlewareListening } from "src/store/listenerMiddleware";
import { LocalStorage } from "src/store/utility/localStorage";
import type { AtLeastOne } from "src/utils/types";
import type { UserSettings } from "./types";
import { UserSettingsSchema } from "./types";

const STATS_KEY = "userSettings";
export const settingsStorage = new LocalStorage<UserSettings | undefined>(STATS_KEY, UserSettingsSchema);

const defaultState = UserSettingsSchema.parse(undefined);
const initialState: UserSettings = settingsStorage.load() ?? defaultState;

const userSettingsSlice = createSlice({
  name: "userSettings",
  initialState,
  reducers: {
    setUserSettings: (state, { payload }: PayloadAction<AtLeastOne<UserSettings>>) => ({ ...state, ...payload }),
    resetUserSettings: () => defaultState,
  },
});

export const { setUserSettings, resetUserSettings } = userSettingsSlice.actions;
export default userSettingsSlice.reducer;

startMiddlewareListening({
  actionCreator: setUserSettings,
  effect: ({ payload }, { dispatch }) => {
    const result = settingsStorage.set(payload);
    if (!result.success) dispatch(pushToErrorLog(result.error));
  },
});
