import type { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

type MainViewProps = PropsWithChildren<{
  className?: string;
}>;

export default function MainView({ children, className }: MainViewProps) {
  return <main className={twMerge("flex flex-1 flex-col sm:flex-row", className)}>{children}</main>;
}
