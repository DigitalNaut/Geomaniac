/**
 * Creates a strategy for an activity.
 *
 * @example
 * ```ts
 * type Strategy<R = void> = Strategy<ActivityType, "kind", R>>
 * ```
 *
 * Gives:
 * ```ts
 * {
 *   "quiz": R;
 *   "review": R;
 *   "typing": R;
 * }
 * ```
 */
export type StrategyFactory<T extends object, P extends keyof T, R = void> = {
  [K in T[P] extends string ? T[P] : never]: R extends infer U ? U : never;
};
