import { z } from "zod";

const ReviewKindSchema = z.enum(["countries"]);
const QuizKindSchema = z.enum(["typing", "pointing"]);
export type QuizKind = z.infer<typeof QuizKindSchema>;

export const ActivityTypeSchema = z.union([
  z.object({
    activity: z.literal("review"),
    kind: ReviewKindSchema,
  }),
  z.object({
    activity: z.literal("quiz"),
    kind: QuizKindSchema,
  }),
]);

export type ActivityType = z.infer<typeof ActivityTypeSchema>;
export type ActivityMode = ActivityType["activity"];

export interface MapActivitySlice {
  isRandomReviewMode: boolean;
  activity?: ActivityType;
}

export function isValidActivity(activity: unknown): activity is ActivityType {
  return ActivityTypeSchema.safeParse(activity).success;
}
