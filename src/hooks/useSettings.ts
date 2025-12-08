
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import { resetUserSettings, setUserSettings } from "src/store/UserSettings/slice";

export function useSettings() {
  const dispatch = useAppDispatch();
  const { useReducedMotion } = useAppSelector((state) => state.settings);

  const resetSettings = () => dispatch(resetUserSettings());

  const toggleUseReducedMotion = () => dispatch(setUserSettings({ useReducedMotion: !useReducedMotion }));

  return { useReducedMotion, resetSettings, toggleUseReducedMotion };
}
