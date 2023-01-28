import type { PropsWithChildren } from 'react';
import Leaflet from 'leaflet';
import { MapContainer, TileLayer } from 'react-leaflet';
// import { GeoJsonObject } from 'geojson';

import 'leaflet/dist/leaflet.css';
import { useMapContext } from 'src/controllers/MapContext';

// * On Styling layers: https://leafletjs.com/examples/choropleth/
// * On Markers: https://codesandbox.io/s/react-leaflet-v3-x-geojson-with-typescript-not-rendering-geojson-points-v28ly?file=/src/Map.tsx

// Properties

const topLeftCorner = Leaflet.latLng(-90, -250);
const bottomRightCorner = Leaflet.latLng(90, 250);
const maxBounds = Leaflet.latLngBounds(topLeftCorner, bottomRightCorner);

export function LeafletMap({ children }: PropsWithChildren) {
  const { setMap } = useMapContext();

  return (
    <MapContainer
      center={maxBounds.getCenter()}
      zoom={1.5}
      maxBounds={maxBounds}
      maxBoundsViscosity={1.0}
      className="shadow-inner"
      style={{ width: "100%", height: "100%" }}
      ref={setMap}
    >
      <TileLayer
        className=""
        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {children}
    </MapContainer >
  );
};

export const markerIcon = Leaflet.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12.5, 41],
});
