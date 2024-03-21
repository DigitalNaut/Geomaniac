import { type PropsWithChildren, createContext, useContext, useEffect, useState } from "react";

import type { CountryData } from "src/hooks/useCountryStore";

export type UserCountryGuess = {
  timestamp: number;
  text: string;
  isCorrect: boolean;
} & Pick<CountryData, "GU_A3" | "ISO_A2_EH">;

export type CountryStats = {
  correctGuesses: number;
  incorrectGuesses: number;
  lastGuessTimestamp: number;
} & Pick<CountryData, "GU_A3" | "ISO_A2_EH" | "GEOUNIT">;

type UserCountryStats = Record<string, CountryStats>;

type GuessRecordContextType = {
  guessHistory: UserCountryGuess[];
  lastGuess?: UserCountryGuess;
  pushGuessToHistory(newGuess: Omit<UserCountryGuess, "timestamp">): void;
  countryStats: UserCountryStats;
  updateCountryStats(stats: Omit<UserCountryGuess, "timestamp" | "text"> & Pick<CountryData, "GEOUNIT">): void;
  clearProgress(): void;
};

const guessRecordContext = createContext<GuessRecordContextType | null>(null);

function useGuessHistory(limit: number) {
  const [guessHistory, setGuessHistory] = useState<UserCountryGuess[]>([]);

  function saveToLocalStorage(history: UserCountryGuess[]) {
    localStorage.setItem("guessHistory", JSON.stringify(history));
  }

  const pushGuessToHistory: GuessRecordContextType["pushGuessToHistory"] = (newGuess) => {
    const timestampedGuess: UserCountryGuess = {
      ...newGuess,
      timestamp: Date.now(),
    };

    setGuessHistory((prev) => {
      const newHistory = [...prev, timestampedGuess];

      if (newHistory.length > limit) newHistory.shift();

      saveToLocalStorage(newHistory);
      return newHistory;
    });
  };

  useEffect(() => {
    const history = localStorage.getItem("guessHistory");
    if (history) setGuessHistory(JSON.parse(history));
  }, []);

  const clearGuessHistory = () => {
    localStorage.removeItem("guessHistory");
    setGuessHistory([]);
  };

  return { guessHistory, pushGuessToHistory, clearGuessHistory };
}

function useCountryStats() {
  const [countryStats, setCountryStats] = useState<UserCountryStats>({});

  const updateCountryStats: GuessRecordContextType["updateCountryStats"] = ({
    ISO_A2_EH,
    GU_A3,
    GEOUNIT,
    isCorrect,
  }) => {
    setCountryStats((prevStats) => {
      const country = prevStats[GU_A3];
      const newStats = {
        ...prevStats,
        [GU_A3]: {
          GEOUNIT,
          ISO_A2_EH,
          GU_A3,
          correctGuesses: (country?.correctGuesses || 0) + (isCorrect ? 1 : 0),
          incorrectGuesses: (country?.incorrectGuesses || 0) + (isCorrect ? 0 : 1),
          lastGuessTimestamp: Date.now(),
        },
      };

      localStorage.setItem("countryStats", JSON.stringify(newStats));
      return newStats;
    });
  };

  // Restore country stats from previous session
  useEffect(() => {
    const stats = localStorage.getItem("countryStats");
    if (stats) setCountryStats(JSON.parse(stats));
  }, []);

  const clearCountryStats = () => {
    localStorage.removeItem("countryStats");
    setCountryStats({});
  };

  return { countryStats, updateCountryStats, clearCountryStats };
}

export default function UserGuessRecordProvider({
  children,
  historyLimit,
}: PropsWithChildren<{
  historyLimit: number;
}>) {
  const { guessHistory, pushGuessToHistory, clearGuessHistory } = useGuessHistory(historyLimit);
  const { countryStats, updateCountryStats, clearCountryStats } = useCountryStats();

  const clearProgress = () => {
    clearGuessHistory();
    clearCountryStats();
  };

  return (
    <guessRecordContext.Provider
      value={{
        guessHistory,
        pushGuessToHistory,
        lastGuess: guessHistory[guessHistory.length - 1],

        countryStats,
        updateCountryStats,
        clearProgress,
      }}
    >
      {children}
    </guessRecordContext.Provider>
  );
}

export function useUserGuessRecordContext() {
  const context = useContext(guessRecordContext);
  if (!context) throw new Error("useUserGuessRecord must be used within a UserGuessRecordProvider");
  return context;
}
