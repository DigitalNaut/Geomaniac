/**
 * Shuffles an array using the Durstenfeld shuffle
 * See: https://stackoverflow.com/a/12646864/17461306
 * @param array The array to shuffle
 * @returns A new shuffled array
 */
export function shuffleArray<T>(array: T[]) {
  if (array.length === 0) return [];

  const result = array.slice();

  for (let i = result.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i] as unknown, result[j] as unknown] = [result[j], result[i]];
  }

  return result;
}

/**
 * Selects a random item from an array
 *  @param array The array to select from
 * @returns A random item from the array
 */
export function selectRandom<T extends NonNullable<unknown>>(list: T[]) {
  const randomIndex = Math.floor(Math.random() * list.length);
  return list[randomIndex];
}

/**
 * Groups the entries of a record by a shared property, collecting transformed values under each group key.
 *
 * @param records - The record whose values are to be grouped.
 * @param property - The property of each entry whose value is used as the group key.
 *   Must resolve to a `PropertyKey` (`string`, `number`, or `symbol`).
 * @param getValue - A function that maps each entry to the value stored in its group.
 * @returns A record mapping each distinct group key to an array of mapped values.
 *
 * @example
 * ```ts
 * const products = {
 *   "p1": { category: "Electronics", name: "Keyboard" },
 *   "p2": { category: "Electronics", name: "Monitor" },
 *   "p3": { category: "Furniture",   name: "Desk" },
 *   "p4": { category: "Furniture",   name: "Chair" },
 * };
 *
 * groupBy(products, "category", (product) => product.name);
 * // {
 * //   "Electronics": ["Keyboard", "Monitor"],
 * //   "Furniture":   ["Desk", "Chair"],
 * // }
 * ```
 */
export function groupBy<TObject extends Record<TKey, unknown>, TKey extends PropertyKey, TValue>(
  records: Record<PropertyKey, TObject>,
  property: TObject[TKey] extends PropertyKey ? TKey : never,
  getValue: (value: TObject) => TValue,
): Record<PropertyKey, TValue[]> {
  const result: ReturnType<typeof groupBy> = {};

  for (const item of Object.values(records)) {
    const key = item[property];
    if (key === undefined || key === null || typeof key === "object") continue;

    const prevValues = result[key];
    const newValue = getValue(item);

    if (prevValues) {
      prevValues.push(newValue);
    } else {
      result[key] = [newValue];
    }
  }

  return result;
}

/**
 * Transforms an array of items into a record by deriving a key and value from each item.
 *
 * @param items - The array of items to transform.
 * @param getKey - A function that derives the record key from each item.
 * @param getValue - A function that derives the record value from each item.
 * @returns A record mapping each derived key to its derived value.
 *
 * @example
 * Group items by type
 *
 * ```ts
 * const fruits = [{ type: "fruit", name: "apple" },
 *  { type: "fruit", name: "banana" },
 *  { type: "vegetable", name: "carrot" }
 * ];
 *
 * const sortedFruits = keyBy(fruits, (f) => f.type, (f) => f.name);
 * // {
 * //   "fruit": ["apple", "banana"],
 * //   "vegetable": ["carrot"],
 * // }
 * ```
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/groupBy Object.groupBy}
 * for a native alternative that always groups items into arrays.
 */
export function keyBy<TItem extends Record<PropertyKey, unknown>, TKey extends PropertyKey, TValue>(
  items: TItem[],
  getKey: (item: TItem) => TKey,
  getValue: (item: TItem) => TValue,
): Record<TKey, TValue> {
  const result: Record<PropertyKey, TValue> = {};

  for (const item of items) {
    if (!item) continue;
    const key = getKey(item);
    result[key] = getValue(item);
  }

  return result;
}
