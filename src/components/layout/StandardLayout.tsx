import type { PropsWithChildren } from "react";

import { cn } from "src/utils/styles";

/**
 * A standard layout with a gradient background.
 */
export default function StandardLayout({ children, className }: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={cn(
        "flex h-screen w-full flex-col bg-linear-to-br from-slate-800 via-slate-900 to-gray-900 text-white",
        className,
      )}
    >
      {children}
    </div>
  );
}
