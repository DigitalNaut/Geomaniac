import type { ControlPosition } from "leaflet";
import { LayersControl, TileLayer } from "react-leaflet";

const tileLayerProviders = [
  {
    name: "OpenStreetMap",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  {
    name: "None",
    url: "",
    attribution: "",
  },
] as const;

type Provider = (typeof tileLayerProviders)[number];

export function TileLayersControl({ checked, position }: { checked: Provider["name"]; position: ControlPosition }) {
  return (
    <LayersControl position={position}>
      {tileLayerProviders.map((provider) => (
        <LayersControl.BaseLayer key={provider.name} name={provider.name} checked={provider.name === checked}>
          <TileLayer url={provider.url} attribution={provider.attribution} />
        </LayersControl.BaseLayer>
      ))}
    </LayersControl>
  );
}
