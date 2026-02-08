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

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import "./style.scss";
import {
  MapAddressMapper,
  type MapAddressDto,
  type NominatimResponseDto,
} from "../../api/dtos/map.dto";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapViewCommonProps {
  data: MapAddressDto;
  hasInputSearch?: boolean;
  onMapClick: (e: MapAddressDto) => void;
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
  onMapClick: (data: MapAddressDto) => void;
}) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;

      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
      )
        .then((res) => res.json())
        .then((data: NominatimResponseDto) => {
          onMapClick(MapAddressMapper.fromNominatim(data, lat, lng));
        })
        .catch(() => {
          onMapClick(MapAddressMapper.createEmpty(lat, lng));
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
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchInput,
        )}&addressdetails=1`,
      );
      const results: NominatimResponseDto[] = await response.json();

      if (results && results.length > 0) {
        const result = results[0];
        if (!result) return;
        const newLat = parseFloat(result.lat);
        const newLng = parseFloat(result.lon);

        setMarkerPosition([newLat, newLng]);
        const parsedData = MapAddressMapper.fromNominatim(
          result,
          newLat,
          newLng,
        );
        onMapClick(parsedData);
        setSearchInput(parsedData.fullAddress);
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
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
      )
        .then((res) => res.json())
        .then((data: NominatimResponseDto) => {
          const parsedData = MapAddressMapper.fromNominatim(data, lat, lng);
          onMapClick(parsedData);
          setSearchInput(parsedData.fullAddress);
        })
        .catch(() => {
          onMapClick(MapAddressMapper.createEmpty(lat, lng));
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
