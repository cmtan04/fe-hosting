import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import type { ProfileLocationFilter } from "@common/types/profile";
import { getLocationByFilter } from "@api/configs/location.config";
import { LocationEndpoint } from "@api/endpoints/location.endpoint";
import { ROUTER_PATH } from "@router/Route";
import {
  LOCATION_METADATA,
  ROOM_TYPE_METADATA,
} from "@common/constants/constants";
import {
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  buildMergedFilter,
  buildSearchParamsFromFilter,
  getFilterSignature,
  normalizeFilter,
  normalizeRentBannerId,
  normalizeSearchValue,
  parseFilterFromSearchParams,
} from "../utils";

interface LocationRouteState {
  rent?: string;
  location?: string;
  page?: number;
}

export const useLocationList = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Từ khóa tìm kiếm từ Banner
  const [keyword, setKeyword] = useState<string | undefined>(undefined);
  // Trạng thái hiển thị của ngăn lọc (Filter Drawer)
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Lấy dữ liệu lọc từ location state (được truyền khi chuyển trang)
  const routeState = (location.state as LocationRouteState | null) ?? null;

  // Chuyển đổi routeState thành đối tượng filter
  const routeFilter = useMemo<ProfileLocationFilter>(() => {
    const nextFilter: ProfileLocationFilter = {};
    if (routeState?.location) nextFilter.addressRegion = routeState.location;
    if (routeState?.rent) nextFilter.locationType = routeState.rent;
    if (typeof routeState?.page === "number" && routeState.page > 0)
      nextFilter.page = routeState.page;
    return nextFilter;
  }, [routeState?.location, routeState?.page, routeState?.rent]);

  // State filter nội bộ dùng cho các cuộc gọi API
  const [filter, setFilter] = useState<ProfileLocationFilter>(() => {
    const queryFilter = parseFilterFromSearchParams(searchParams);
    return buildMergedFilter(routeFilter, queryFilter, {
      page: DEFAULT_PAGE,
      limit: DEFAULT_LIMIT,
    });
  });

  // Sử dụng React Query để lấy danh sách địa điểm mỗi khi 'filter' thay đổi
  const {
    data: locationData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: [LocationEndpoint.GET_LOCATION_BY_FILTER, filter],
    queryFn: () => getLocationByFilter(filter),
  });

  // Effect: Đồng bộ filter nội bộ với URL params và Route state
  useEffect(() => {
    const queryFilter = parseFilterFromSearchParams(searchParams);
    setFilter((prevFilter) => {
      const nextFilter = buildMergedFilter(
        routeFilter,
        queryFilter,
        prevFilter,
      );
      if (getFilterSignature(prevFilter) === getFilterSignature(nextFilter)) {
        return prevFilter;
      }
      return nextFilter;
    });
  }, [routeFilter, searchParams]);

  // Effect: Cập nhật filter khi từ khóa tìm kiếm từ Banner thay đổi
  useEffect(() => {
    if (keyword === undefined) return;
    const nextSearchValue = normalizeSearchValue(keyword);
    setFilter((prevFilter) => {
      const nextFilter = normalizeFilter({
        ...prevFilter,
        searchValue: nextSearchValue,
        page: DEFAULT_PAGE,
      });
      if (getFilterSignature(prevFilter) === getFilterSignature(nextFilter)) {
        return prevFilter;
      }
      return nextFilter;
    });
  }, [keyword]);

  // Effect: Đồng bộ trạng thái filter ngược lại URL search params
  useEffect(() => {
    const nextSearchParams = buildSearchParamsFromFilter(filter);
    if (searchParams.toString() !== nextSearchParams.toString()) {
      setSearchParams(nextSearchParams, { replace: true });
    }
  }, [filter, searchParams, setSearchParams]);

  const handlePageChange = (page: number) => {
    setFilter((prevFilter) => normalizeFilter({ ...prevFilter, page }));
  };

  const handleCardClick = (code: string) => {
    const url = ROUTER_PATH.LOCATION_DETAIL.replace(":code", code);
    navigate(url, { state: { code } });
  };

  // Tính toán dữ liệu Banner (tiêu đề, hình ảnh) dựa trên địa điểm/loại hình thuê hiện tại
  const bannerKey =
    searchParams.get("location") ??
    routeState?.location ??
    searchParams.get("rent") ??
    routeState?.rent;
  const bannerProps =
    LOCATION_METADATA[bannerKey] ??
    ROOM_TYPE_METADATA[normalizeRentBannerId(bannerKey)];

  return {
    locationData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    filter,
    setFilter,
    isFilterOpen,
    setIsFilterOpen,
    handlePageChange,
    handleCardClick,
    keyword,
    setKeyword,
    bannerProps,
  };
};
