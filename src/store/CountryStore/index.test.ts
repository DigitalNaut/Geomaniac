// import { expect, it, suite } from "vitest";

// import countryData from "src/assets/data/features/countries.json" with { type: "json" };

// suite("Utilities", () => {
//   it("should shuffle an array", () => {
//     const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
//     const shuffled = shuffleArray(array);
//     expect(shuffled).not.toEqual(array);
//   });

//   it("should select a random item from an array", () => {
//     const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
//     const incidences = new Map<number, number>();

//     // Select many random items
//     for (let i = 0; i < 1000; i++) {
//       const item = selectRandom(array);
//       const count = incidences.get(item) ?? 0;
//       incidences.set(item, count + 1);
//     }

//     expect(incidences.size).toBe(array.length);

//     // Check limits
//     const projectedAverage = 1000 / array.length;
//     const minLimit = projectedAverage * 0.75;
//     const maxLimit = projectedAverage * 1.25;

//     // Check incidences
//     incidences.forEach((value, key) => {
//       expect(array.includes(key)).toBe(true);
//       expect(value).toBeGreaterThan(minLimit);
//       expect(value).toBeLessThanOrEqual(maxLimit);
//     });
//   });
// });

// suite("Country Catalog", () => {
//   it("should load the country data", () => {
//     expect(countryData).toBeDefined();
//     expect(countryData.length).toBeGreaterThan(0);
//   });

//   it("should create a full country catalog", () => {
//     const catalog = new CountryCatalog(countryData);
//     expect(catalog).toBeDefined();
//     expect(catalog).toBeInstanceOf(CountryCatalog);

//     expect(catalog.continents).toBeDefined();
//     expect(catalog.continents.length).toBeGreaterThan(0);

//     catalog.continents.forEach((continent) => {
//       const countries = catalog.getCountriesIn(continent);
//       expect(countries).toBeDefined();
//       expect(countries).toBeInstanceOf(Array);
//       expect(countries.length).toBeGreaterThan(0);
//     });
//   });

//   it("should create a partial country catalog", () => {
//     const fullCatalog = new CountryCatalog(countryData);
//     const partialCatalog = new CountryCatalog(countryData, { excludedContinents: ["Antarctica"] });
//     const scantCatalog = new CountryCatalog(countryData, { excludedContinents: ["Africa", "Antarctica", "Asia"] });

//     expect(fullCatalog.continents.length).toBe(8);
//     expect(fullCatalog.includes("Antarctica")).toBe(true);

//     expect(partialCatalog.continents.length).toBe(7);
//     expect(partialCatalog.includes("Antarctica")).toBe(false);

//     expect(scantCatalog.continents.length).toBe(5);
//     expect(scantCatalog.includes("Antarctica")).toBe(false);
//     expect(scantCatalog.includes("Asia")).toBe(false);
//     expect(scantCatalog.includes("Africa")).toBe(false);
//   });

//   it("should tally countries by continent", () => {
//     const catalog = new CountryCatalog(countryData);
//     const tally = catalog.tallyCountriesByContinent();

//     expect(tally).toEqual(
//       new Map([
//         ["Africa", 57],
//         ["Antarctica", 1],
//         ["Asia", 55],
//         ["Europe", 59],
//         ["North America", 42],
//         ["Oceania", 27],
//         ["Seven seas (open ocean)", 10],
//         ["South America", 14],
//       ]),
//     );
//   });
// });

// const catalog = new CountryCatalog(countryData);

// suite("Country Queue", () => {
//   it("should have a continent", () => {
//     const continent = "Africa";
//     const queue = new CountryQueue({ catalog, continent });

//     expect(queue).toBeDefined();
//     expect(queue).toBeInstanceOf(CountryQueue);
//   });

//   it("should blacklist one country from the queue", () => {
//     const queue = new CountryQueue({ catalog, continent: "Africa" });
//     const country = selectRandom(catalog.getCountriesIn("Africa"));

//     expect(queue.includes(country)).toBe(true);

//     const originalQueueSize = queue.length;
//     queue.blacklist(country);

//     expect(queue.length).toBe(originalQueueSize - 1);
//     expect(queue.hasBlacklisted(country)).toBe(true);
//     expect(queue.includes(country)).toBe(false);
//   });

//   it("should blacklist countries", () => {
//     const continentQueue = new CountryQueue({ catalog, continent: "Africa" });
//     const countriesToBan = shuffleArray(catalog.getCountriesIn("Africa")).slice(0, countryData.length * 0.5);

//     expect(continentQueue.length).toBeGreaterThan(0);
//     expect(countriesToBan.length).toBeGreaterThan(0);

//     continentQueue.blacklistMany(countriesToBan);
//     expect(continentQueue.blacklisted).toBeDefined();
//     expect(continentQueue.blacklisted.length).toBeGreaterThan(0);

//     for (const country of continentQueue.blacklisted) {
//       expect(continentQueue.includes(country)).toBe(false);
//     }
//   });

//   it("should show low variance of country selection", () => {
//     const queue = new CountryQueue({ catalog, continent: "Africa" });
//     const incidences = new Map<string, number>();

//     // Push 1000 countries
//     const countriesPushed = [];
//     for (let i = 0; i < 1000; i++) {
//       const country = queue.next();
//       if (!country) break;

//       const count = incidences.get(country) ?? 0;
//       incidences.set(country, count + 1);
//       countriesPushed.push(country);
//     }

//     // Calculate stats
//     const counts = [...incidences.values()];
//     const averageCounts = counts.reduce((acc, value) => acc + value, 0) / incidences.size;
//     const countsSD = Math.sqrt(
//       counts.reduce((acc, value) => acc + Math.pow(value - averageCounts, 2), 0) / incidences.size,
//     );

//     // Set limit
//     const countSDLimit = averageCounts * 0.05; // 5%

//     // // Report
//     // console.log("Countries pushed:");
//     // console.log(countriesPushed);

//     // console.log("Incidence log:");
//     // console.table(incidences);

//     // console.log("Stats:");
//     // console.log(`Standard Deviation: ${countsSD}`);
//     // console.log(`Average: ${averageCounts}`);
//     // console.log(`Limit: ${countSDLimit}`);

//     expect(countsSD).toBeLessThan(countSDLimit);
//   });
// });
