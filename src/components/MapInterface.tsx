import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icons
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export function MapInterface({
  center,
  zoom,
  onMapClick,
  markers = [],
}: {
  center: [number, number];
  zoom: number;
  onMapClick?: (latlng: [number, number]) => void;
  markers?: Array<{ position: [number, number]; label?: string }>;
}) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className="h-full w-full rounded-lg border border-gray-300 z-0"
      // Add these new props:
      minZoom={3}
      maxBounds={[
        [-90, -180], // Southwest coordinates
        [90, 180], // Northeast coordinates
      ]}
      maxBoundsViscosity={1.0}
    >
      <TileLayer
        attribution="&copy; CartoDB"
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png"
      />

      {onMapClick && <MapClickHandler handler={onMapClick} />}

      {markers.map((marker, idx) => (
        <Marker key={idx} position={marker.position} icon={defaultIcon}>
          {marker.label && <Popup>{marker.label}</Popup>}
        </Marker>
      ))}
    </MapContainer>
  );
}

function MapClickHandler({
  handler,
}: {
  handler: (latlng: [number, number]) => void;
}) {
  useMapEvents({
    click: (e) => handler([e.latlng.lat, e.latlng.lng]),
  });
  return null;
}
