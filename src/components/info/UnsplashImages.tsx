import { faExternalLink, faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import Masonry from "react-responsive-masonry";

import useEdgeKeys from "src/hooks/useEdgeKeys";
import { selectCurrentCountryData } from "src/store/CountryStore/slice";
import { useAppSelector } from "src/store/hooks";
import type { UnsplashSearchResponse, UnsplashSearchResult } from "src/types/unsplash";

const unsplashApiURL = "https://api.unsplash.com";
const unsplashSearch = `${unsplashApiURL}/search/photos?`;

export function UnsplashImages() {
  const { data: keys } = useEdgeKeys();
  const currentCountry = useAppSelector(selectCurrentCountryData("review"));
  const [currentImage, setCurrentImage] = useState<UnsplashSearchResult | null>(null);

  const currentCountryData = currentCountry ? currentCountry : null;
  const query = new URLSearchParams({
    query: currentCountryData?.GEOUNIT ?? "",
  });

  const { isLoading, error, data } = useQuery({
    queryKey: ["country-images", currentCountryData, currentCountryData?.GEOUNIT, query, keys?.unsplash.accessKey],
    queryFn: () =>
      axios
        .get<UnsplashSearchResponse>(`${unsplashSearch}${query}`, {
          headers: {
            Authorization: `Client-ID ${keys?.unsplash.accessKey}`,
          },
        })
        .then(({ data }) => data),
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

  if (!data || data.results.length === 0)
    return <p className="rounded-md bg-sky-900 p-6">No images found for {currentCountryData?.GEOUNIT}.</p>;

  return (
    <>
      <div className="relative scrollbar-thin flex max-h-[60vh] min-w-[20vw] overflow-y-auto scrollbar-thumb-sky-700 scrollbar-track-sky-900">
        {data.results.length > 0 && (
          <Masonry columnsCount={2}>
            {data.results.map((image) => (
              <motion.div
                className="peer/image group/label relative h-auto w-full"
                key={image.id + image.urls.thumb}
                transition={{ duration: 0.5 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <img
                  src={image.urls.thumb}
                  alt={image.alt_description}
                  loading="lazy"
                  width={image.width}
                  height={image.height}
                />
                <a
                  className="absolute inset-0 flex size-full items-center justify-center text-xs shadow-xs"
                  href={image.links.html}
                  target="_blank"
                  rel="noreferrer"
                  title="View on Unsplash"
                  onMouseOver={() => setCurrentImage(image)}
                  onMouseOut={() => setCurrentImage(null)}
                >
                  <div className="flex size-full items-center justify-center bg-linear-to-b from-slate-950/30 to-blue-500/30 opacity-0 backdrop-blur-xs transition-opacity duration-200 ease-out group-hover/label:opacity-100">
                    View original&ensp;
                    <FontAwesomeIcon icon={faExternalLinkAlt} />
                  </div>
                </a>
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

      <AnimatePresence>
        {currentImage && (
          <motion.div
            className="pointer-events-none absolute inset-0 z-10 flex -translate-x-full items-center justify-center"
            key={currentImage.id + currentImage.urls.regular}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex flex-col rounded-sm bg-white shadow-md">
              <img
                className="max-h-full max-w-full rounded-md p-2"
                src={currentImage.urls.regular}
                alt={currentImage.alt_description}
                width={currentImage.width}
                height={currentImage.height}
                loading="lazy"
                decoding="async"
              />
              <div className="px-2 py-1 text-sm text-slate-900">
                <span>Photo by {currentImage.user.name}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
