import { type PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

export function InlineButton({
  children,
  onClick,
  className,
  small,
  title,
}: PropsWithChildren<{ onClick: () => void; className?: string; small?: true; title: string }>) {
  return (
    <button
      className={twMerge(
        "flex h-full cursor-pointer items-center justify-center gap-2 rounded-md bg-white px-4 py-2 text-slate-800 hover:bg-slate-100 active:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50",
        small ? "gap-1 px-2 py-0" : "text-base",
        className,
      )}
      role="button"
      title={title}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
