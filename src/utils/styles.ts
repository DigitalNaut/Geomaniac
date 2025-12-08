import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge classes with clsx and tailwind-merge.
 * @param inputs The classes
 * @returns The merged classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Identity function for prettier-plugin-tailwindcss.
 * @see https://github.com/tailwindlabs/prettier-plugin-tailwindcss?tab=readme-ov-file#sorting-classes-in-template-literals
 * @see https://github.com/tailwindlabs/prettier-plugin-tailwindcss/issues/268#issuecomment-2096059767
 * @param strings
 * @param values
 * @returns The same strings and values as the input
 */
export const tw = (strings: TemplateStringsArray, ...values: unknown[]) => String.raw({ raw: strings }, ...values);
