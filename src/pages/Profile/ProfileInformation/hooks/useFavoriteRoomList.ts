import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getLocationByCode } from "@api/configs/location.config";
import type { LocationDto } from "@api/dtos/location.dto";
import {
  readFavoriteLocations,
  removeFavoriteLocation,
  subscribeFavoriteLocations,
} from "@common/utils/favoriteLocations";

type FavoriteRoomRecord = {
  location: LocationDto;
  savedAt: number;
};

export const useFavoriteRoomList = () => {
  const [favoriteEntries, setFavoriteEntries] = useState(() =>
    readFavoriteLocations(),
  );

  useEffect(() => {
    return subscribeFavoriteLocations(() => {
      setFavoriteEntries(readFavoriteLocations());
    });
  }, []);

  const favoriteKey = useMemo(
    () =>
      favoriteEntries
        .map((item) => `${item.locationCode}:${item.savedAt}`)
        .join("|"),
    [favoriteEntries],
  );

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["favorite-locations", favoriteKey],
    queryFn: async (): Promise<FavoriteRoomRecord[]> => {
      const settledResults = await Promise.allSettled(
        favoriteEntries.map(async (entry) => ({
          savedAt: entry.savedAt,
          location: await getLocationByCode(entry.locationCode),
        })),
      );

      return settledResults
        .filter(
          (result): result is PromiseFulfilledResult<FavoriteRoomRecord> =>
            result.status === "fulfilled",
        )
        .map((result) => result.value)
        .sort((left, right) => right.savedAt - left.savedAt);
    },
    enabled: favoriteEntries.length > 0,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const rooms = useMemo(() => data?.map((item) => item.location) ?? [], [data]);

  const handleRemoveFavorite = useCallback((code: string) => {
    removeFavoriteLocation(code);
  }, []);

  return {
    rooms,
    isLoading,
    isError,
    totalItems: rooms.length,
    refetch,
    handleRemoveFavorite,
  };
};
