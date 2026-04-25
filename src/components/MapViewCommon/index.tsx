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

const SEARCH_DEBOUNCE_MS = 350;
const SEARCH_RESULT_LIMIT = 5;

const DefaultIcon = L.icon({
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

function ChangeView({
  center,
}: {
  center: [number, number];
}): null {
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
}): null {
  useMapEvents({
    click(event) {
      const { lat, lng } = event.latlng;

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

const getSuggestionTitle = (result: NominatimResponseDto) =>
  result.address?.amenity ||
  result.address?.road ||
  result.address?.hamlet ||
  result.address?.suburb ||
  result.address?.neighbourhood ||
  result.address?.city ||
  result.address?.town ||
  result.address?.village ||
  result.display_name;

export const MapViewCommon: React.FC<MapViewCommonProps> = ({
  data,
  hasInputSearch = false,
  onMapClick,
}) => {
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState<NominatimResponseDto[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [markerPosition, setMarkerPosition] = useState<[number, number]>([
    data.lat,
    data.long,
  ]);
  const markerRef = useRef<L.Marker>(null);
  const searchWrapperRef = useRef<HTMLDivElement>(null);
  const skipNextSearchRef = useRef(false);

  useEffect(() => {
    setMarkerPosition([data.lat, data.long]);
  }, [data.lat, data.long]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchWrapperRef.current &&
        !searchWrapperRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const keyword = searchInput.trim();

    if (skipNextSearchRef.current) {
      skipNextSearchRef.current = false;
      return;
    }

    if (!hasInputSearch || keyword.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      setIsDropdownOpen(false);
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      try {
        setIsSearching(true);
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            keyword,
          )}&addressdetails=1&limit=${SEARCH_RESULT_LIMIT}`,
          {
            signal: controller.signal,
          },
        );
        const results: NominatimResponseDto[] = await response.json();
        setSearchResults(results);
        setIsDropdownOpen(true);
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          console.error("Search error:", error);
          setSearchResults([]);
          setIsDropdownOpen(true);
        }
      } finally {
        setIsSearching(false);
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [hasInputSearch, searchInput]);

  const applySearchResult = (result: NominatimResponseDto) => {
    const newLat = Number.parseFloat(result.lat);
    const newLng = Number.parseFloat(result.lon);
    const parsedData = MapAddressMapper.fromNominatim(result, newLat, newLng);

    setMarkerPosition([newLat, newLng]);
    onMapClick(parsedData);
    skipNextSearchRef.current = true;
    setSearchInput(parsedData.fullAddress);
    setSearchResults([]);
    setIsDropdownOpen(false);
  };

  const handleSearch = async () => {
    if (searchResults.length > 0) {
      applySearchResult(searchResults[0]);
      return;
    }

    if (!searchInput.trim()) {
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchInput,
        )}&addressdetails=1&limit=1`,
      );
      const results: NominatimResponseDto[] = await response.json();
      const firstResult = results[0];

      if (firstResult) {
        applySearchResult(firstResult);
      }
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const handleMarkerDrag = () => {
    const marker = markerRef.current;

    if (!marker) {
      return;
    }

    const { lat, lng } = marker.getLatLng();

    fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
    )
      .then((res) => res.json())
      .then((result: NominatimResponseDto) => {
        const parsedData = MapAddressMapper.fromNominatim(result, lat, lng);
        onMapClick(parsedData);
        skipNextSearchRef.current = true;
        setSearchInput(parsedData.fullAddress);
      })
      .catch(() => {
        onMapClick(MapAddressMapper.createEmpty(lat, lng));
      });
  };

  return (
    <div className="map__view">
      {hasInputSearch && (
        <div className="map__view__search" ref={searchWrapperRef}>
          <Input
            placeholder="Tim kiem dia diem..."
            prefix={<SearchOutlined />}
            size="large"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            onFocus={() => {
              if (searchResults.length > 0) {
                setIsDropdownOpen(true);
              }
            }}
            onPressEnter={handleSearch}
          />
          {isDropdownOpen && (
            <div className="map-autocomplete-dropdown">
              {isSearching && (
                <div className="map-autocomplete-dropdown__state">
                  Dang tim dia diem...
                </div>
              )}

              {!isSearching &&
                searchResults.map((result, index) => (
                  <button
                    key={`${result.lat}-${result.lon}-${index}`}
                    type="button"
                    className="map-autocomplete-dropdown__item"
                    onClick={() => applySearchResult(result)}
                  >
                    <span className="map-autocomplete-dropdown__item__title">
                      {getSuggestionTitle(result)}
                    </span>
                    <span className="map-autocomplete-dropdown__item__address">
                      {result.display_name}
                    </span>
                  </button>
                ))}

              {!isSearching &&
                searchInput.trim().length >= 2 &&
                searchResults.length === 0 && (
                  <div className="map-autocomplete-dropdown__state">
                    Khong tim thay ket qua phu hop.
                  </div>
                )}
            </div>
          )}
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
