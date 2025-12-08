import type { LatLngTuple } from "leaflet";

/**
 * Gives the coordinates of the label of a Record containing a `LABEL_X` and `LABEL_Y` property.
 * @param feature A Record containing a `LABEL_X` and `LABEL_Y` property
 * @returns A tuple of latitude and longitude
 */
export function getLabelCoordinates(country: { LABEL_X: number; LABEL_Y: number }): LatLngTuple {
  const { LABEL_X, LABEL_Y } = country;
  if (LABEL_X && LABEL_Y) return [LABEL_Y, LABEL_X];
  else return [0, 0];
}

/**
 * Removes diacritics from a string
 * @param name A string
 * @returns The string without diacritics
 */
export function normalizeName(name?: string) {
  return name
    ?.trim()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}
