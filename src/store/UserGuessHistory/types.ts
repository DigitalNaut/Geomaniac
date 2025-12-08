import { z } from "zod";

const CountryGuessSchema = z.object({
  timestamp: z.number(),
  text: z.string(),
  isCorrect: z.boolean(),
  GU_A3: z.string(),
  ISO_A2_EH: z.string(),
});

export const GuessHistorySchema = z.array(CountryGuessSchema);

export type CountryGuess = z.infer<typeof CountryGuessSchema>;
export type GuessHistory = z.infer<typeof GuessHistorySchema>;
