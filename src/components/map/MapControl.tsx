import type { PropsWithChildren } from "react";

import { cn } from "src/utils/styles";

const POSITION_CLASSES = {
  bottomleft: "leaflet-bottom leaflet-left",
  bottomright: "leaflet-bottom leaflet-right",
  topleft: "leaflet-top leaflet-left",
  topright: "leaflet-top leaflet-right",
};

export function MapControl({
  position,
  children,
  className,
}: PropsWithChildren<{
  position: keyof typeof POSITION_CLASSES;
  className?: string;
}>) {
  return (
    <div className={cn({ [POSITION_CLASSES[position]]: !!position })}>
      <div className="leaflet-control leaflet-bar rounded-full">
        <div className={className}>{children}</div>
      </div>
    </div>
  );
}
