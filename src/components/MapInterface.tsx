import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

// Create icons for different marker colors
const createIcon = (color: string = "blue") =>
  L.icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    shadowSize: [41, 41],
  });

interface MarkerData {
  position: [number, number];
  label?: string;
  color?: "red" | "green" | "blue";
}

// Map center update component with improved zooming behavior
function MapUpdater({
  center,
  zoom,
  shouldAnimate = false,
}: {
  center: [number, number];
  zoom: number;
  shouldAnimate?: boolean;
}) {
  const map = useMap();

  useEffect(() => {
    if (shouldAnimate && zoom > 2) {
      // Use flyTo for smooth animation when zooming to a specific region
      map.flyTo(center, zoom, {
        animate: true,
        duration: 2,
        easeLinearity: 0.5,
      });
    } else {
      // Use setView for instant updates (initial render and reset)
      map.setView(center, zoom, {
        animate: false,
      });
    }
  }, [center, zoom, map, shouldAnimate]);

  return null;
}

export function MapInterface({
  center,
  zoom,
  onMapClick,
  markers = [],
  animateToLocation = false,
}: {
  center: [number, number];
  zoom: number;
  onMapClick?: (latlng: [number, number]) => void;
  markers: MarkerData[];
  animateToLocation?: boolean;
}) {
  return (
    <MapContainer
      center={[20, 0]} // Default initial center
      zoom={2} // Default initial zoom
      className="h-full w-full rounded-lg border border-gray-300 z-0"
      minZoom={2}
      maxZoom={8}
      maxBounds={[
        [-90, -180], // Southwest coordinates
        [90, 180], // Northeast coordinates
      ]}
      maxBoundsViscosity={1.0}
      worldCopyJump={true}
    >
      <MapUpdater
        center={center}
        zoom={zoom}
        shouldAnimate={animateToLocation}
      />

      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png"
      />

      {onMapClick && <MapClickHandler handler={onMapClick} />}

      {markers.map((marker, idx) => (
        <Marker
          key={idx}
          position={marker.position}
          icon={createIcon(marker.color)}
        >
          {marker.label && (
            <Popup>
              <div className="font-semibold">{marker.label}</div>
            </Popup>
          )}
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
