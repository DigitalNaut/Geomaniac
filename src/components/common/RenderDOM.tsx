import { createElement, useMemo } from "react";
import { twMerge } from "tailwind-merge";

function filterText(text: string) {
  const replacedText = text
    .replace(/<(link|meta).+?>/g, "")
    .replace(/\\n/g, "")
    .replace(/\n/g, "");
  return `<div>${replacedText}</div>`;
}

const domParser = new DOMParser();

function parseInput(input: string) {
  const filteredInput = filterText(input);
  const doc = domParser.parseFromString(filteredInput, "application/xhtml+xml");

  const parserError = doc.querySelector("parsererror");
  if (parserError) {
    return { doc, error: new Error(parserError.textContent || undefined) };
  }

  return { doc };
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
