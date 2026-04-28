import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  MapAddressDto,
  NominatimResponseDto,
} from "../../api/dtos/map.dto";
import {
  createEmptyMapAddress,
  createMapAddressFromNominatim,
  createMapViewDataFromDraftAddress,
} from "./address";
import { getCurrentCoordinates } from "./geolocation";
import { hasDefaultCoordinates } from "./locationDefaults";
import { reverseGeocode, searchPlaces } from "../../api/endpoints/nominatim";
import type { CreateLocationDraft } from "../locationCreation/types";

export interface MapCoordinates {
  lat: number;
  lng: number;
}

interface UseMapAddressPickerOptions {
  initialAddress?: Partial<CreateLocationDraft["address"]> | null;
  hasSearch?: boolean;
  debounceMs?: number;
  resultLimit?: number;
  onAddressResolved?: (value: MapAddressDto) => void;
}

export const useMapAddressPicker = ({
  initialAddress,
  hasSearch = false,
  debounceMs = 350,
  resultLimit = 5,
  onAddressResolved,
}: UseMapAddressPickerOptions) => {
  const hasResolvedInitialAddress = Boolean(
    initialAddress?.fullAddress?.trim() ||
    initialAddress?.addressDetail?.trim() ||
    initialAddress?.ward?.trim() ||
    initialAddress?.city?.trim() ||
    initialAddress?.country?.trim() ||
    !hasDefaultCoordinates(initialAddress?.latitude, initialAddress?.longitude),
  );
  const [mapData, setMapData] = useState(() =>
    hasResolvedInitialAddress && initialAddress
      ? createMapViewDataFromDraftAddress(initialAddress)
      : createEmptyMapAddress(),
  );
  const [searchInput, setSearchInput] = useState(
    hasResolvedInitialAddress ? (initialAddress?.fullAddress ?? "") : "",
  );
  const [searchResults, setSearchResults] = useState<NominatimResponseDto[]>(
    [],
  );
  const [isSearching, setIsSearching] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const skipNextSearchRef = useRef(false);
  const hasRequestedCurrentLocationRef = useRef(false);

  useEffect(() => {
    if (!initialAddress || !hasResolvedInitialAddress) {
      return;
    }

    const nextMapData = createMapViewDataFromDraftAddress(initialAddress);
    setMapData(nextMapData);
    setSearchInput(initialAddress.fullAddress ?? nextMapData.fullAddress);
  }, [
    initialAddress?.addressDetail,
    initialAddress?.city,
    initialAddress?.country,
    initialAddress?.fullAddress,
    initialAddress?.latitude,
    initialAddress?.longitude,
    initialAddress?.region,
    initialAddress?.ward,
    hasResolvedInitialAddress,
  ]);

  useEffect(() => {
    const keyword = searchInput.trim();

    if (skipNextSearchRef.current) {
      skipNextSearchRef.current = false;
      return;
    }

    if (!hasSearch || keyword.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      setIsDropdownOpen(false);
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      try {
        setIsSearching(true);
        const results = await searchPlaces(keyword, {
          signal: controller.signal,
          limit: resultLimit,
        });
        setSearchResults(results);
        setIsDropdownOpen(true);
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setSearchResults([]);
          setIsDropdownOpen(true);
        }
      } finally {
        setIsSearching(false);
      }
    }, debounceMs);

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [debounceMs, hasSearch, resultLimit, searchInput]);

  const applyResolvedResult = (result: NominatimResponseDto) => {
    const nextMapData = createMapAddressFromNominatim(
      result,
      Number.parseFloat(result.lat),
      Number.parseFloat(result.lon),
    );

    setMapData(nextMapData);
    setSearchResults([]);
    setIsDropdownOpen(false);
    skipNextSearchRef.current = true;
    setSearchInput(nextMapData.fullAddress);
    onAddressResolved?.(nextMapData);
  };

  const resolveCoordinates = useCallback(
    async ({ lat, lng }: MapCoordinates) => {
      try {
        const result = await reverseGeocode(lat, lng);
        const nextMapData = createMapAddressFromNominatim(result, lat, lng);
        setMapData(nextMapData);
        skipNextSearchRef.current = true;
        setSearchInput(nextMapData.fullAddress);
        onAddressResolved?.(nextMapData);
      } catch {
        const nextMapData = createEmptyMapAddress(lat, lng);
        setMapData(nextMapData);
        onAddressResolved?.(nextMapData);
      }
    },
    [onAddressResolved],
  );

  useEffect(() => {
    if (hasResolvedInitialAddress || hasRequestedCurrentLocationRef.current) {
      return;
    }

    hasRequestedCurrentLocationRef.current = true;

    void (async () => {
      const currentCoordinates = await getCurrentCoordinates();
      await resolveCoordinates(currentCoordinates);
    })();
  }, [hasResolvedInitialAddress, resolveCoordinates]);

  const handleSearchSubmit = async () => {
    if (searchResults.length > 0) {
      applyResolvedResult(searchResults[0]);
      return;
    }

    const keyword = searchInput.trim();
    if (!keyword) {
      return;
    }

    try {
      const results = await searchPlaces(keyword, { limit: 1 });
      if (results[0]) {
        applyResolvedResult(results[0]);
      }
    } catch {
      setSearchResults([]);
      setIsDropdownOpen(true);
    }
  };

  const searchState = useMemo(
    () =>
      hasSearch
        ? {
            input: searchInput,
            results: searchResults,
            isSearching,
            isDropdownOpen,
            onInputChange: setSearchInput,
            onFocus: () => {
              if (searchResults.length > 0) {
                setIsDropdownOpen(true);
              }
            },
            onSubmit: handleSearchSubmit,
            onSelectResult: applyResolvedResult,
            onOpenChange: setIsDropdownOpen,
          }
        : undefined,
    [hasSearch, isDropdownOpen, isSearching, searchInput, searchResults],
  );

  return {
    mapData,
    setMapData,
    resolveCoordinates,
    searchState,
  };
};
