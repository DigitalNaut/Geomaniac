import { suite, describe, it, expect } from "vitest";

import { groupBy, selectRandom, shuffleArray } from "./utils";

suite("Utilities", () => {
  describe(shuffleArray.name, () => {
    const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    it("should shuffle an array", () => {
      const shuffled = shuffleArray(array);
      expect(shuffled).not.toEqual(array);
    });
  });

  describe(selectRandom.name, () => {
    it("should select a random item from an array", () => {
      const array = ["a", "b", "c", "d", "e", 1, 2, 3, 4, 5];
      const item1 = selectRandom(array);
      expect(item1).toBeDefined();
      expect(item1).toBeOneOf(array);

      array.splice(array.indexOf(item1!), 1);

      const item2 = selectRandom(array);
      expect(item2).toBeDefined();
      expect(item2).toBeOneOf(array);
      expect(item1).not.toBe(item2);
    });
  });

  describe(groupBy.name, () => {
    it("should group items by a shared property", () => {
      const products = {
        p1: { category: "Electronics", name: "Keyboard" },
        p2: { category: "Electronics", name: "Monitor" },
        p3: { category: "Furniture", name: "Desk" },
        p4: { category: "Furniture", name: "Chair" },
      };
      const grouped = groupBy(products, "category", (v) => v);
      expect(grouped).toEqual({
        Electronics: [products.p1, products.p2],
        Furniture: [products.p3, products.p4],
      });
    });
  });
});
