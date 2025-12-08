import { cn } from "src/utils/styles";

export default function Footer() {
  return (
    <div className="flex w-full flex-0 justify-between p-2 text-xs text-slate-500">
      <span>
        Published under a Creative Commons license. &copy; DigitalNaut, 2023. Sound effects by&nbsp;
        <a href="https://www.zapsplat.com" target="_blank" rel="noreferrer">
          Zapsplat
        </a>
        .
      </span>
      <div className={cn("flex gap-2", { "text-yellow-400": import.meta.env.DEV })}>
        {import.meta.env.DEV && <span>DEV</span>}
        <span>v{import.meta.env.PACKAGE_VERSION}</span>
      </div>
    </div>
  );
}
