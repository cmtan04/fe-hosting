import { SearchOutlined } from "@ant-design/icons";
import { Input } from "antd";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import React, { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

// Fix icon mặc định của Leaflet
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import "./style.scss";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapViewCommonData {
  lat: number;
  long: number;
  fullAddressText?: string;
}

interface MapViewCommonProps {
  data: MapViewCommonData;
  hasInputSearch?: boolean;
  onMapClick: (e: MapViewCommonData) => void;
}

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

function MapClickHandler({
  onMapClick,
}: {
  onMapClick: (data: MapViewCommonData) => void;
}) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;

      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
      )
        .then((res) => res.json())
        .then((data) => {
          onMapClick({
            lat,
            long: lng,
            fullAddressText: data.display_name,
          });
        })
        .catch(() => {
          onMapClick({
            lat,
            long: lng,
          });
        });
    },
  });
  return null;
}

export const MapViewCommon: React.FC<MapViewCommonProps> = ({
  data,
  hasInputSearch = false,
  onMapClick,
}) => {
  const [searchInput, setSearchInput] = useState("");
  const [markerPosition, setMarkerPosition] = useState<[number, number]>([
    data.lat,
    data.long,
  ]);
  const markerRef = useRef<L.Marker>(null);

  useEffect(() => {
    setMarkerPosition([data.lat, data.long]);
  }, [data.lat, data.long]);

  const handleSearch = async () => {
    if (!searchInput.trim()) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchInput)}`,
      );
      const results = await response.json();

      if (results && results.length > 0) {
        const { lat, lon, display_name } = results[0];
        const newLat = parseFloat(lat);
        const newLng = parseFloat(lon);

        setMarkerPosition([newLat, newLng]);
        onMapClick({
          lat: newLat,
          long: newLng,
          fullAddressText: display_name,
        });
        setSearchInput(display_name);
      }
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const handleMarkerDrag = () => {
    const marker = markerRef.current;
    if (marker) {
      const { lat, lng } = marker.getLatLng();

      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
      )
        .then((res) => res.json())
        .then((data) => {
          onMapClick({
            lat,
            long: lng,
            fullAddressText: data.display_name,
          });
          setSearchInput(data.display_name);
        })
        .catch(() => {
          onMapClick({
            lat,
            long: lng,
          });
        });
    }
  };

  return (
    <div className="map__view">
      {hasInputSearch && (
        <div className="map__view__search">
          <Input
            placeholder="Tìm kiếm địa điểm..."
            prefix={<SearchOutlined />}
            size="large"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onPressEnter={handleSearch}
          />
        </div>
      )}

      <div className="map__view__container">
        <MapContainer center={markerPosition} zoom={15}>
          <ChangeView center={markerPosition} />
          <MapClickHandler onMapClick={onMapClick} />

          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker
            position={markerPosition}
            draggable={true}
            ref={markerRef}
            eventHandlers={{
              dragend: handleMarkerDrag,
            }}
          />
        </MapContainer>
      </div>
    </div>
  );
};
