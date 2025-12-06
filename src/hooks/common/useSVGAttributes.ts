import type { SVGAttributes } from "react";

const parser = new DOMParser();

/**
 * Extracts the SVG attributes from the map SVG.
 * @returns Returns the paths, bounds, and set of attributes.
 */
export function useSvgAttributes<K extends keyof SVGAttributes<SVGElement>, R = Record<K, string>>(
  svg: string,
  attributes: K[],
) {
  const doc = parser.parseFromString(svg, "image/svg+xml");

  const errorNode = doc.querySelector("parsererror");
  if (errorNode) throw new Error(`Invalid SVG: ${errorNode.textContent}`);

  // Parse the paths and bounds
  const paths = Array.from(doc.querySelectorAll("path"));

  // Extract the attributes from the SVG
  const extractedAttributes = attributes.reduce<R>(
    (acc, attribute) => ({ ...acc, [attribute]: doc.documentElement.getAttribute(attribute) }),
    {} as R,
  );

  return { paths, ...extractedAttributes, attributes: doc.documentElement.attributes };
}
