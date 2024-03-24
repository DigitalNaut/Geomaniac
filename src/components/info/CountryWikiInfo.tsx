import { useEffect, useMemo } from "react";
import axios, { type AxiosRequestConfig } from "axios";
import { useQuery } from "@tanstack/react-query";
import { useCountryStore } from "src/hooks/useCountryStore";
import { RenderDOM } from "src/components/common/RenderDOM";

import { type WikidataSummaryResponse } from "src/types/wikipedia";

const wikiLogoURL =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Wikipedia-logo-v2.svg/16px-Wikipedia-logo-v2.svg.png";
const wikiApiURL = "https://en.wikipedia.org/w/api.php";
const wikiDataURL = "https://www.wikidata.org/wiki/Special:EntityData";
const test = "https://www.wikidata.org/w/api.php?action=wbgetentities&ids=Q123&format=json&props=sitelinks";

const api =
  "https://www.wikidata.org/w/api.php?action=wbgetentities&format=xml&props=sitelinks&ids=Q19675&sitefilter=enwiki";

const config: AxiosRequestConfig = {
  headers: {
    "Api-User-Agent": import.meta.env.VITE_WIKIPEDIA_API_USER_AGENT,
  },
};

export function CountryWikiInfo({ onError }: { onError: (error: Error) => void }) {
  const { storedCountry } = useCountryStore();
  const query = useMemo(
    () =>
      new URLSearchParams({
        format: "json",
        action: "query",
        prop: "info|pageimages|extracts",
        exintro: "",
        inprop: "url|thumbnail|original",
        piprop: "thumbnail|original",
        redirects: "1",
        origin: "*",
        titles: storedCountry.data?.GEOUNIT || "",
      }),
    [storedCountry.data?.GEOUNIT],
  );

  const {
    isLoading: isQueryLoading,
    error: queryError,
    data: queryData,
  } = useQuery({
    queryKey: [storedCountry.data?.WIKIDATAID],
    queryFn: () => axios.get(wikiDataURL).then(({ data }) => data),
    // queryFn: () => axios.get(`${wikiDataURL}/${storedCountry.data?.WIKIDATAID}.json`).then(({ data }) => data),
    refetchOnWindowFocus: false,
    enabled: !!storedCountry.data?.WIKIDATAID,
  });

  useEffect(() => {
    console.log(isQueryLoading, queryData, queryError);
  }, [isQueryLoading, queryData, queryError]);

  const {
    isLoading: isSummaryLoading,
    error: summaryError,
    data: summaryData,
  } = useQuery({
    queryKey: ["country-info", storedCountry.data, storedCountry.data?.WIKIDATAID, storedCountry.data?.GEOUNIT, query],
    queryFn: () => axios.get<WikidataSummaryResponse>(`${wikiApiURL}?${query}`, config).then(({ data }) => data),
    refetchOnWindowFocus: false,
    enabled: !!storedCountry.data?.WIKIDATAID,
  });

  useEffect(() => {
    if (summaryError) onError(summaryError as Error);
  }, [summaryError, onError]);

  if (summaryError)
    return (
      <p className="pointer-events-auto max-h-[300px] max-w-xl overflow-y-auto break-all rounded-md bg-sky-900/60 p-3 scrollbar-thin scrollbar-track-sky-900 scrollbar-thumb-sky-700 hover:bg-sky-900">
        Data unavailable at the moment. An error has occurred.
      </p>
    );

  if (isSummaryLoading) return <div className="rounded-md bg-sky-900/60 p-3">Loading wiki...</div>;

  const page = summaryData?.query?.pages && Object.values(summaryData.query.pages)[0];

  if (!page) return <p>Page not found</p>;
  if ("missing" in page)
    return (
      <p className="m-2 rounded-sm border border-slate-400/40 px-4 py-2 italic">
        Page unavailable for {JSON.stringify(storedCountry.data?.GEOUNIT, null, 2)}.
      </p>
    );

  return (
    <section className="flex max-h-[300px] max-w-xl flex-col p-3">
      <div>{JSON.stringify(queryData, null, 2)}</div>

      <div className="prose visible scroll-pb-3 overflow-y-auto indent-2 text-white scrollbar-thin scrollbar-track-sky-900 scrollbar-thumb-sky-700">
        <div className="float-left mt-5">
          {page.thumbnail && (
            <img
              className="peer m-2"
              alt={storedCountry.data?.GEOUNIT}
              src={page.thumbnail.source}
              width={page.thumbnail.width}
            />
          )}

          <span className="pointer-events-none absolute top-0 z-50 hidden -translate-y-1/3 rounded-sm bg-slate-200 p-2 shadow-lg peer-hover:block">
            {page.original && (
              <img
                className="shadow-md"
                loading="lazy"
                src={page.original.source}
                width={page.original.width}
                height={page.original.height}
              />
            )}
          </span>
        </div>
        <RenderDOM input={page.extract} />
      </div>
      <span className="flex justify-end">
        <a
          href={page.fullurl}
          target="_blank"
          rel="noreferrer"
          className="mr-2 flex items-center justify-end gap-1 text-blue-300 hover:underline"
        >
          Read more on
          <img src={wikiLogoURL} loading="lazy" width={16} />
          Wikipedia &gt;
        </a>
      </span>
    </section>
  );
}
