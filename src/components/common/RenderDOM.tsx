import { createElement, useEffect, useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";

function filterText(text: string) {
  const replacedText = text
    .replace(/<(link|meta).+?>/g, "")
    .replace(/\\n/g, "")
    .replace(/\n/g, "");
  return `<div>${replacedText}</div>`;
}

const domParser = new DOMParser();

function useDOMParser(input = "") {
  const [error, setError] = useState<Error | null>(null);

  const doc = useMemo(() => {
    const filteredInput = filterText(input);
    return domParser.parseFromString(filteredInput, "application/xhtml+xml");
  }, [input]);

  useEffect(() => {
    if (doc) {
      const errorNode = doc.querySelector("parsererror");

      if (errorNode) {
        setError(new Error(errorNode.textContent || undefined));
      }
    }
  }, [doc]);

  return { doc, error };
}

export function RenderDOM({ className, input }: { className?: string; input: string }) {
  const { doc, error } = useMemo(() => parseInput(input), [input]);

  const htmlSections = useMemo(() => doc?.childNodes[0].childNodes, [doc]);

  if (error)
    return (
      <div className={twMerge("w-full flex-1 grow rounded-xs bg-red-400 p-2 text-white", className)}>
        {error.message}
      </div>
    );

  if (!htmlSections) return null;

  return (
    <>
      {Object.values(htmlSections).map((node, key) =>
        node instanceof Element && node.tagName && node.textContent?.length
          ? createElement(node.tagName, { key, ...node.attributes }, <RenderDOM input={node.innerHTML} />)
          : (node.textContent ?? ""),
      )}
    </>
  );
}
