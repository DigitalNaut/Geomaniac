import { suite, it, expect } from "vitest";

import { pivotMap, pivotTable, selectRandom, shuffleArray } from "./utils";

suite("Utilities", () => {
  it("should shuffle an array", () => {
    const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const shuffled = shuffleArray(array);

    expect(shuffled.join(",")).not.toBe(array.join(","));
  });

  it("should select a random item from an array", () => {
    const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const item = array.map(() => selectRandom(array));

    expect(new Set(item)).not.toEqual(new Set(array));
  });

  it("should pivot a map into a map of arrays grouped by a key", () => {
    const map = new Map([
      ["item 1", { group: "Group 1", property: "value 1" }],
      ["item 2", { group: "Group 1", property: "value 2" }],
      ["item 3", { group: "Group 2", property: "value 3" }],
      ["item 4", { group: "Group 2", property: "value 4" }],
    ]);

    const pivot = pivotMap(map, "group", (item) => item.property);

    expect(pivot.get("Group 1")).toEqual(["value 1", "value 2"]);
    expect(pivot.get("Group 2")).toEqual(["value 3", "value 4"]);
  });

  it("should pivot a flat hash map into a hash map of arrays grouped by a key", () => {
    const map = {
      "item 1": { group: "Group 1", property: "value 1" },
      "item 2": { group: "Group 1", property: "value 2" },
      "item 3": { group: "Group 2", property: "value 3" },
      "item 4": { group: "Group 2", property: "value 4" },
    };

    const pivot = pivotTable(map, "group", (item) => item.property);

    expect(pivot["Group 1"]).toEqual(["value 1", "value 2"]);
    expect(pivot["Group 2"]).toEqual(["value 3", "value 4"]);
  });
});
