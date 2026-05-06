import { useQuery } from "@tanstack/react-query";
import { getOwnerLocations } from "@api/configs/location.config";
import { LocationEndpoint } from "@api/endpoints/location.endpoint";
import { useMemo } from "react";

export const useProfileRoomList = (userCode?: string) => {
  const {
    data: allRoomsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [LocationEndpoint.GET_OWNER_LOCATIONS, userCode],
    queryFn: () => getOwnerLocations(userCode!),
    enabled: !!userCode,
  });

  const rooms = useMemo(() => {
    if (!allRoomsData) return [];
    
    // Đảm bảo không có phòng bị lặp lại dựa trên locationCode
    const uniqueMap = new Map();
    allRoomsData.forEach((room) => {
      if (!uniqueMap.has(room.locationCode)) {
        uniqueMap.set(room.locationCode, room);
      }
    });
    return Array.from(uniqueMap.values());
  }, [allRoomsData]);

  return {
    rooms,
    isLoading,
    isError,
    totalItems: rooms.length,
  };
};
