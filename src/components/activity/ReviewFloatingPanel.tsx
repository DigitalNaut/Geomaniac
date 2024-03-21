import { animated } from "@react-spring/web";
import { useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

import { ActionButton } from "src/components/common/ActionButton";
import { useFloatingPanelSlideInAnimation } from "src/components/activity/QuizFloatingPanel";
import { useCountryStore } from "src/hooks/useCountryStore";
import { RenderDOM } from "src/components/common/RenderDOM";
import { useMapActivityContext } from "src/contexts/MapActivityContext";

const wikidataApi = "https://en.wikipedia.org/w/api.php?format=json&action=query";
const wikipediaLogo =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Wikipedia-logo-v2.svg/16px-Wikipedia-logo-v2.svg.png";

function CountryWikiInfo({ onError }: { onError: (error: Error) => void }) {
  const { storedCountry } = useCountryStore();
  const { isLoading, error, data } = useQuery({
    queryKey: ["country-info", storedCountry.data, storedCountry.data?.WIKIDATAID, storedCountry.data?.GEOUNIT],
    queryFn: () =>
      axios
        .get<WikidataSummaryResponse>(
          `${wikidataApi}&prop=info%7Cpageimages%7Cextracts&exintro&inprop=url&piprop=thumbnail%7Coriginal&redirects=1&origin=*&titles=${
            storedCountry.data?.WIKIDATAID ?? storedCountry.data?.GEOUNIT ?? ""
          }`,
          {
            headers: {
              "Api-User-Agent": import.meta.env.VITE_WIKIPEDIA_API_USER_AGENT,
            },
          },
        )
        .then((response) => {
          return response.data;
        }),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (error) onError(error as Error);
  }, [error, onError]);

  if (isLoading) return <div className="rounded-md bg-sky-900/60 p-3">Loading...</div>;

  if (error)
    return (
      <p className="pointer-events-auto max-h-[300px] max-w-xl overflow-y-auto break-all rounded-md bg-sky-900/60 p-3 scrollbar-thin scrollbar-track-sky-900 scrollbar-thumb-sky-700 hover:bg-sky-900">
        Data unavailable at the moment. An error has occurred.
      </p>
    );

  const page = data?.query?.pages && Object.values(data.query.pages)[0];

  if (!page) return <p>Page not found</p>;
  if ("missing" in page) return <p>Data unavailable</p>;

  return (
    <section className="flex max-h-[300px] max-w-xl flex-col p-3">
      <div className="prose visible scroll-pb-3 overflow-y-auto indent-2 text-white scrollbar-thin scrollbar-track-sky-900 scrollbar-thumb-sky-700">
        <div className="float-left mt-5">
          <img
            className="peer m-2"
            alt={storedCountry.data?.GEOUNIT}
            src={page.thumbnail.source}
            width={page.thumbnail.width}
          />

          <span className="pointer-events-none absolute top-0 z-50 hidden -translate-y-1/3 rounded-sm bg-slate-200 p-2 shadow-lg peer-hover:block">
            <img
              className="shadow-md"
              loading="lazy"
              src={page.original.source}
              width={page.original.width}
              height={page.original.height}
            />
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
          <img src={wikipediaLogo} loading="lazy" width={16} />
          Wikipedia &gt;
        </a>
      </span>
    </section>
  );
}

export default function ReviewFloatingPanel({
  shouldShow,
  showNextCountry,
  disabled,
  onError,
}: {
  shouldShow: boolean;
  showNextCountry: () => void;
  disabled: boolean;
  onError: (error: Error) => void;
}) {
  const [showDetails, setShowDetails] = useState(false);
  const { firstTrail } = useFloatingPanelSlideInAnimation(shouldShow);
  const { isRandomReviewMode, setRandomReviewMode } = useMapActivityContext();

  return (
    <animated.div
      className="pointer-events-none absolute inset-x-0 bottom-8 z-[1000] mx-auto flex size-fit flex-col items-center gap-2 rounded-md"
      style={firstTrail}
    >
      {!disabled && (
        <details
          className="pointer-events-auto rounded-md bg-sky-900/70 p-3 shadow-md backdrop-blur-md hover:bg-sky-900"
          open={showDetails}
          onToggle={(event) => setShowDetails(event.currentTarget.open)}
        >
          <summary className="cursor-pointer">Wikipedia summary</summary>
          {shouldShow && showDetails && <CountryWikiInfo onError={onError} />}
        </details>
      )}
      <div className="pointer-events-auto flex w-fit flex-col items-center overflow-hidden rounded-md bg-slate-900 drop-shadow-lg">
        <animated.div className="flex w-full flex-col items-center overflow-hidden rounded-md">
          <ActionButton disabled={disabled || !shouldShow} onClick={showNextCountry} title="Next country">
            Next country
          </ActionButton>
          <label className="flex gap-2 p-1" htmlFor="randomMode">
            <input
              id="randomMode"
              type="checkbox"
              checked={isRandomReviewMode}
              onChange={(event) => setRandomReviewMode(event.currentTarget.checked)}
            />
            Random mode
          </label>
        </animated.div>
      </div>
    </animated.div>
  );
}
