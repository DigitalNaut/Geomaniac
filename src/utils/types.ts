/**
 * Converts a type into a type with all given properties required.
 */
export type Required<T, K extends keyof T> = {
  [P in K]-?: T[P];
};

/**
 * Type for a record with at least one key.
 * @see https://github.com/reduxjs/redux-toolkit/issues/1423#issuecomment-902680573
 * @see https://redux-toolkit.js.org/usage/usage-with-typescript/#payload-with-all-optional-fields
 */
export type AtLeastOne<T extends Record<string, unknown>> = keyof T extends infer K
  ? K extends string
    ? Pick<T, K & keyof T> & Partial<T>
    : never
  : never;
