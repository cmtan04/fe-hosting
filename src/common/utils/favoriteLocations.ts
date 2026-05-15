import type { LocationDto } from "@api/dtos/location.dto";

const FAVORITE_LOCATIONS_STORAGE_KEY = "fe-hosting:favorites:locations";
const FAVORITE_LOCATIONS_EVENT = "favorite-locations-changed";

export interface FavoriteLocationSnapshot {
  locationCode: string;
  typeName: string;
  name: string;
  description?: string;
  address?: string;
  rate?: number;
  price?: number;
  priceUnit?: string;
  image?: string;
  savedAt: number;
}

export interface FavoriteLocationPayload {
  locationCode: string;
  typeName: string;
  name: string;
  description?: string;
  address?: string;
  rate?: number;
  price?: number;
  priceUnit?: string;
  image?: string;
}

const getStorage = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage;
};

const dispatchFavoritesChanged = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(FAVORITE_LOCATIONS_EVENT));
};

const normalizeFavoriteLocations = (
  items: FavoriteLocationSnapshot[],
): FavoriteLocationSnapshot[] => {
  const uniqueMap = new Map<string, FavoriteLocationSnapshot>();

  items.forEach((item) => {
    const existing = uniqueMap.get(item.locationCode);
    if (!existing || item.savedAt >= existing.savedAt) {
      uniqueMap.set(item.locationCode, item);
    }
  });

  return Array.from(uniqueMap.values()).sort(
    (left, right) => right.savedAt - left.savedAt,
  );
};

export const readFavoriteLocations = (): FavoriteLocationSnapshot[] => {
  const storage = getStorage();
  if (!storage) {
    return [];
  }

  try {
    const rawValue = storage.getItem(FAVORITE_LOCATIONS_STORAGE_KEY);
    if (!rawValue) {
      return [];
    }

    const parsedValue = JSON.parse(rawValue) as FavoriteLocationSnapshot[];
    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return normalizeFavoriteLocations(
      parsedValue.filter((item) => Boolean(item?.locationCode)),
    );
  } catch {
    return [];
  }
};

const writeFavoriteLocations = (items: FavoriteLocationSnapshot[]) => {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  storage.setItem(
    FAVORITE_LOCATIONS_STORAGE_KEY,
    JSON.stringify(normalizeFavoriteLocations(items)),
  );
  dispatchFavoritesChanged();
};

export const subscribeFavoriteLocations = (listener: () => void) => {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleChange = () => listener();

  window.addEventListener(FAVORITE_LOCATIONS_EVENT, handleChange);
  window.addEventListener("storage", handleChange);

  return () => {
    window.removeEventListener(FAVORITE_LOCATIONS_EVENT, handleChange);
    window.removeEventListener("storage", handleChange);
  };
};

export const isFavoriteLocation = (locationCode: string) =>
  readFavoriteLocations().some((item) => item.locationCode === locationCode);

export const saveFavoriteLocation = (location: FavoriteLocationPayload) => {
  const currentItems = readFavoriteLocations();
  const filteredItems = currentItems.filter(
    (item) => item.locationCode !== location.locationCode,
  );

  const nextItem: FavoriteLocationSnapshot = {
    locationCode: location.locationCode,
    typeName: location.typeName,
    name: location.name,
    description: location.description,
    address: location.address,
    rate: location.rate,
    price: location.price,
    priceUnit: location.priceUnit,
    image: location.image,
    savedAt: Date.now(),
  };

  writeFavoriteLocations([nextItem, ...filteredItems]);
};

export const removeFavoriteLocation = (locationCode: string) => {
  const currentItems = readFavoriteLocations();
  writeFavoriteLocations(
    currentItems.filter((item) => item.locationCode !== locationCode),
  );
};

export const toggleFavoriteLocation = (location: FavoriteLocationPayload) => {
  if (isFavoriteLocation(location.locationCode)) {
    removeFavoriteLocation(location.locationCode);
    return;
  }

  saveFavoriteLocation(location);
};
