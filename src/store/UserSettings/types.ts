import { z } from "zod";

export const UserSettingsSchema = z
  .object({
    useReducedMotion: z.boolean().optional(),
  })
  .default({
    useReducedMotion: false,
  });

export type UserSettings = z.infer<typeof UserSettingsSchema>;
