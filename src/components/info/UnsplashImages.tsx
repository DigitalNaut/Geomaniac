import { faExternalLink, faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import axios, { type AxiosRequestConfig } from "axios";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { useEffect } from "react";
import Masonry from "react-responsive-masonry";

import useEdgeKeys from "src/hooks/useEdgeKeys";
import { selectCurrentCountryData } from "src/store/CountryStore/slice";
import { useAppSelector } from "src/store/hooks";
import type { UnsplashSearchResponse } from "src/types/unsplash";

const unsplashApiURL = "https://api.unsplash.com";
const unsplashSearch = `${unsplashApiURL}/search/photos?query=`;

const newImageSearchParams = (query = "") =>
  new URLSearchParams({
    query,
  });

const overlayVariants: Variants = {
  initial: {
    opacity: 0,
    onAnimationEnd: () => ({ display: "none" }),
  },
  hover: {
    opacity: 1,
    display: "flex",
  },
};

export function UnsplashImages({ onError }: { onError: (error: Error) => void }) {
  const { data: keys } = useEdgeKeys();
  const currentCountry = useAppSelector(selectCurrentCountryData("review"));

  const currentCountryData = currentCountry ? currentCountry : null;
  const query = newImageSearchParams(currentCountryData?.GEOUNIT);

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

  useEffect(() => {
    if (error) onError(error);
  }, [error, onError]);

  if (error) return <p className="rounded-md bg-sky-900 p-3">Images are unavailable at the moment.</p>;

  if (isLoading)
    return <div className="rounded-md bg-sky-900 p-3">Loading images for {currentCountryData?.GEOUNIT}...</div>;

  return (
    <section className="pt-2">
      <div className="scrollbar-thin scrollbar-track-sky-900 scrollbar-thumb-sky-700 flex max-h-[60vh] min-w-[20vw] overflow-y-auto">
        {data?.results.length && (
          <Masonry columnsCount={2}>
            {data.results.map((image) => (
              <motion.div key={image.id} whileHover="hover" transition={{ duration: 0.05 }} variants={overlayVariants}>
                <div className="peer/image group/label relative h-auto w-full" key={image.id}>
                  <img src={image.urls.thumb} alt={image.alt_description} loading="lazy" />

                  <div className="absolute inset-x-0 bottom-0 flex-col border-t border-white/10 bg-linear-to-b from-slate-950/30 to-blue-500/30 p-4 text-right opacity-0 backdrop-blur-md transition-opacity duration-200 ease-out group-hover/label:opacity-100">
                    <div className="text-sm">
                      <span>Photo by&ensp;</span>
                      <a
                        className="underline"
                        href={`https://unsplash.com/@${image.user.username}?utm_source=Geomaniac&utm_medium=referral`}
                        target="_blank"
                        rel="noreferrer"
                        title="Visit Unsplash profile"
                      >
                        {image.user.name}
                      </a>
                    </div>
                    <div className="rounded-bl-md text-xs shadow-xs">
                      <a
                        className="hover:underline"
                        href={image.links.html}
                        target="_blank"
                        rel="noreferrer"
                        title="View on Unsplash"
                      >
                        View original&ensp;
                        <FontAwesomeIcon icon={faExternalLinkAlt} />
                      </a>
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  <motion.div
                    className="pointer-events-none absolute inset-0 z-10 hidden -translate-x-full items-center justify-center"
                    key={image.id}
                    variants={overlayVariants}
                  >
                    <img
                      className="max-h-full max-w-full rounded-md bg-white p-2 shadow-md"
                      src={image.urls.regular}
                      alt={image.alt_description}
                      width={image.width}
                      loading="lazy"
                      decoding="async"
                    />
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            ))}
          </Masonry>
        )}
      </div>

      <span className="flex items-baseline justify-end border-t-2 border-sky-800 p-2 pt-2 text-blue-300">
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
    </section>
  );
}
