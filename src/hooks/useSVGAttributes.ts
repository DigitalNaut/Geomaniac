import { latLngBounds } from "leaflet";
import { type SVGAttributes } from "react";

const parser = new DOMParser();

/**
 * Extracts the SVG attributes from the map SVG.
 * @returns Returns the paths, bounds, and set of attributes.
 */
export function useSvgAttributes<K extends keyof SVGAttributes<SVGElement>>(
  svg: string,
  attributes: K[],
  { topLeftCorner, bottomRightCorner }: { topLeftCorner: [number, number]; bottomRightCorner: [number, number] },
) {
  const doc = parser.parseFromString(svg, "image/svg+xml");

  const errorNode = doc.querySelector("parsererror");
  if (errorNode) throw new Error(`Invalid SVG: ${errorNode.textContent}`);

  // Parse the paths and bounds
  const paths = Array.from(doc.querySelectorAll("path"));
  const bounds = latLngBounds(topLeftCorner, bottomRightCorner);

  // Extract the attributes from the SVG
  const extractedAttributes: Record<(typeof attributes)[number], string> = Object.create(null);

  for (const attribute of attributes) {
    if (!doc.documentElement.hasAttribute(attribute)) continue;

    const value = doc.documentElement.getAttribute(attribute);
    if (value) extractedAttributes[attribute] = value || "";
  }

  return { paths, bounds, ...extractedAttributes };
}
