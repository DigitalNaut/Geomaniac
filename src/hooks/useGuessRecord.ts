import type { CountryData } from "src/store/CountryStore/types";
import { clearGuessHistory, pushGuessToHistory } from "src/store/UserGuessHistory/slice";
import type { CountryGuess } from "src/store/UserGuessHistory/types";
import { clearCountryStats, pushCountryStat } from "src/store/UserGuessStats/slice";
import { useAppDispatch, useAppSelector } from "src/store/hooks";

/**
 * Manages that guess history and stats with a single interface
 */

export function useGuessRecord() {
  const dispatch = useAppDispatch();
  const guessHistory = useAppSelector((state) => state.guessHistory);
  const countryStats = useAppSelector((state) => state.guessStats);

  const lastGuess = guessHistory[guessHistory.length - 1];

  const clearProgress = () => {
    dispatch(clearGuessHistory());
    dispatch(clearCountryStats());
  };

  const createRecord = ({
    text,
    GEOUNIT,
    isCorrect,
    GU_A3,
    ISO_A2_EH,
  }: Omit<CountryGuess, "timestamp"> & Pick<CountryData, "GEOUNIT">) => {
    dispatch(pushGuessToHistory({ text, isCorrect, ISO_A2_EH, GU_A3 }));

    dispatch(pushCountryStat({ GEOUNIT, isCorrect, ISO_A2_EH, GU_A3 }));
  };

  return {
    createRecord,
    guessHistory,
    lastGuess,
    countryStats,
    clearProgress,
  };
}
