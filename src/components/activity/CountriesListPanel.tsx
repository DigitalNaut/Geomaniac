import { useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";

import {
  type NullableCountryData,
  type CountryData,
  type CountryDataList,
  useCountryStore,
} from "src/hooks/useCountryStore";
import { continents } from "src/contexts/CountryFiltersContext";
import Toggle from "src/components/common/Toggle";
import { useSearchParams } from "react-router-dom";

type CountryListEntryProps = {
  storedCountry: NullableCountryData;
  countryClickCallback(a3: string): void;
};

function CountryListEntry({
  country,
  storedCountry,
  countryClickCallback,
}: CountryListEntryProps & { country: CountryData }) {
  return (
    <button
      className={twMerge(
        "flex items-center gap-2 pl-4 -ml-2 -mr-1 pr-1 text-left -indent-2 rounded-sm",
        country?.GU_A3 === storedCountry?.GU_A3 && "bg-yellow-700 py-1",
      )}
      id={country?.GU_A3}
      key={country?.GU_A3 + "-country"}
      title={country?.GEOUNIT}
      onClick={() => countryClickCallback(country.GU_A3)}
    >
      {country?.GEOUNIT}
    </button>
  );
}

type ContinentListEntryProps = CountryListEntryProps & {
  isContinentAbridged: boolean;
  index: number;
  continent: string;
  continentCountries: CountryDataList;
  isContinentToggled: boolean;
  toggleContinentCallback(continent: string, toggle: boolean): void;
};

function ContinentListEntry({
  isContinentAbridged,
  index,
  continent,
  continentCountries,
  isContinentToggled,
  toggleContinentCallback,
  storedCountry,
  countryClickCallback,
}: ContinentListEntryProps) {
  return (
    <>
      <div
        key={continent + "-summary"}
        className="sticky flex justify-between bg-slate-900 pb-1 pt-2 font-bold shadow-md"
        style={{
          top: `${index * 2.25}rem`,
        }}
      >
        <span>{continent}</span>
        <div className="flex items-center gap-2 text-base">
          &#40;{continentCountries.length}&#41;
          <Toggle value={isContinentToggled} onChange={(toggle) => toggleContinentCallback(continent, toggle)} />
        </div>
      </div>

      {!isContinentAbridged && (
        <div
          className={twMerge("flex flex-col rounded-sm bg-slate-800 p-1 pl-2", isContinentToggled ? "flex" : "hidden")}
        >
          {continentCountries.map((country) => (
            <CountryListEntry
              key={country.GU_A3}
              country={country}
              countryClickCallback={countryClickCallback}
              storedCountry={storedCountry}
            />
          ))}
        </div>
      )}
    </>
  );
}

export default function CountriesListPanel({ isAbridged = false }: { isAbridged?: boolean }) {
  const { storedCountry, toggleContinentFilter, countryDataByContinent, continentFilters } = useCountryStore();
  const listRef = useRef<HTMLDivElement>(null);
  const [, setURLSearchParams] = useSearchParams();

  const handleCountryClick = (a3: string) => {
    setURLSearchParams((prev) => {
      prev.set("country", a3);
      return prev;
    });
  };

  // Scroll to the active country
  useEffect(() => {
    if (!storedCountry.data || !listRef.current) return;

    const countryButton = listRef.current?.querySelector(`#${storedCountry.data?.GU_A3}`);

    countryButton?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [storedCountry.data]);

  return (
    <div className={twMerge("flex h-max flex-col gap-2", !isAbridged && "overflow-y-auto")}>
      <h3 className="text-center text-slate-300">Countries by Region</h3>

      <div className={twMerge("flex flex-col overflow-y-auto px-2", !isAbridged && "pb-[60vh]")} ref={listRef}>
        {continents.map((continent, index) => (
          <ContinentListEntry
            key={continent}
            index={index}
            isContinentAbridged={isAbridged}
            continent={continent}
            isContinentToggled={continentFilters[continent]}
            continentCountries={countryDataByContinent[continent]}
            toggleContinentCallback={toggleContinentFilter}
            countryClickCallback={handleCountryClick}
            storedCountry={storedCountry.data}
          />
        ))}
      </div>
    </div>
  );
}
