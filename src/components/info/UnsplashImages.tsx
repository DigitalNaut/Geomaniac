import { faExternalLink, faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import axios, { type AxiosRequestConfig } from "axios";
import { motion } from "motion/react";
import Masonry from "react-responsive-masonry";

import useEdgeKeys from "src/hooks/useEdgeKeys";
import { selectCurrentCountryData } from "src/store/CountryStore/slice";
import { useAppSelector } from "src/store/hooks";
import type { UnsplashSearchResponse } from "src/types/unsplash";

const unsplashApiURL = "https://api.unsplash.com";
const unsplashSearch = `${unsplashApiURL}/search/photos?`;

export function UnsplashImages() {
  const { data: keys } = useEdgeKeys();
  const currentCountry = useAppSelector(selectCurrentCountryData("review"));

  const currentCountryData = currentCountry ? currentCountry : null;
  const query = new URLSearchParams({
    query: currentCountryData?.GEOUNIT ?? "",
  });

  const config: AxiosRequestConfig = {
    headers: {
      Authorization: `Client-ID ${keys?.unsplash.accessKey}`,
    },
  };

  const { isLoading, error, data } = useQuery({
    queryKey: ["country-images", currentCountryData, currentCountryData?.GEOUNIT, query, config],
    queryFn: () => axios.get<UnsplashSearchResponse>(`${unsplashSearch}${query}`, config).then(({ data }) => data),
    refetchOnWindowFocus: false,
    enabled: !!keys?.unsplash.accessKey && !!currentCountryData?.GEOUNIT,
  });

  if (error)
    return (
      <p className="rounded-md bg-sky-900 p-6 text-center">
        <span>Images are unavailable at the moment.</span>
        {error.message && (
          <>
            <br />
            <span>({error.message})</span>
          </>
        )}
      </p>
    );

  if (isLoading)
    return <div className="rounded-md bg-sky-900 p-3">Loading images for {currentCountryData?.GEOUNIT}...</div>;

  if (!data || data.results.length === 0) {
    return <p className="rounded-md bg-sky-900 p-6">No images found for {currentCountryData?.GEOUNIT}.</p>;
  }

  return (
    <>
      <div className="scrollbar-thin flex max-h-[60vh] min-w-[20vw] overflow-y-auto scrollbar-thumb-sky-700 scrollbar-track-sky-900">
        {data.results.length > 0 && (
          <Masonry columnsCount={2}>
            {data.results.map((image) => (
              <motion.div
                key={image.id}
                transition={{ duration: 0.5 }}
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                exit={{
                  opacity: 0,
                }}
              >
                <div className="peer/image group/label relative h-auto w-full" key={image.id}>
                  <img src={image.urls.thumb} alt={image.alt_description} loading="lazy" />
                  <a
                    className="absolute inset-0 flex size-full items-center justify-center text-xs shadow-xs"
                    href={image.links.html}
                    target="_blank"
                    rel="noreferrer"
                    title="View on Unsplash"
                  >
                    <div className="flex size-full items-center justify-center bg-linear-to-b from-slate-950/30 to-blue-500/30 opacity-0 backdrop-blur-xs transition-opacity duration-200 ease-out group-hover/label:opacity-100">
                      View original&ensp;
                      <FontAwesomeIcon icon={faExternalLinkAlt} />
                    </div>
                  </a>
                </div>

                <div
                  className="pointer-events-none absolute inset-0 z-10 flex -translate-x-full items-center justify-center opacity-0 duration-250 peer-hover/image:opacity-100"
                  key={image.id + "hover"}
                >
                  <div className="flex flex-col rounded-sm bg-white shadow-md">
                    <img
                      className="max-h-full max-w-full rounded-md p-2"
                      src={image.urls.regular}
                      alt={image.alt_description}
                      width={image.width}
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="rounded-b-sm p-2 text-sm text-slate-900">
                      <span>Photo by {image.user.name}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </Masonry>
        )}
      </div>

      <span className="flex items-baseline justify-end border-t-2 border-sky-800 p-2 text-xs text-blue-300">
        Courtesy of&nbsp;
        <a
          className="mr-2 flex items-center justify-end gap-1 hover:underline"
          href="https://unsplash.com/?utm_source=Geomaniac&utm_medium=referral"
          target="_blank"
          rel="noreferrer"
        >
          Unsplash
        </a>
        <FontAwesomeIcon icon={faExternalLink} />
      </span>
    </>
  );
}
