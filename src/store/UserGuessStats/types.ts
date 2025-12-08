import { z } from "zod";

import type { CountryData } from "src/store/CountryStore/types";
import type { CountryGuess } from "src/store/UserGuessHistory/types";

export type CountryStatsPayload = Omit<CountryGuess, "timestamp" | "text"> & Pick<CountryData, "GEOUNIT">;

const GuessStatsSchema = z.object({
  correctGuesses: z.number(),
  incorrectGuesses: z.number(),
  lastGuessTimestamp: z.number(),
  GU_A3: z.string(),
  ISO_A2_EH: z.string(),
  GEOUNIT: z.string(),
});

export const CountryStatsSchema = z.record(z.string(), GuessStatsSchema);

export type GuessStats = z.infer<typeof GuessStatsSchema>;

export type CountryStats = Record<CountryData["GU_A3"], GuessStats>;
