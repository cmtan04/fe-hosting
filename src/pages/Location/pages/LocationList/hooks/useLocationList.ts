import { useInfiniteQuery, keepPreviousData } from "@tanstack/react-query";
import { useCallback, useRef, useEffect, useState } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import type { ProfileLocationFilter } from "@common/types/profile";
import {
  getLocationByFilter,
  normalizeLocationTypeCode,
} from "@api/configs/location.config";
import { LocationEndpoint } from "@api/endpoints/location.endpoint";
import { ROUTER_PATH } from "@router/Route";
import {
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  parseFilterFromURL,
  buildURLFromFilter,
} from "../utils";

export const useLocationList = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Trạng thái hiển thị của ngăn lọc trên mobile
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // ── Xử lý location.state lần đầu (tương thích cũ) ─────
  const hasHandledState = useRef(false);
  useEffect(() => {
    if (hasHandledState.current) return;
    const routeState = location.state as { rent?: string; location?: string } | null;
    if (!routeState?.rent && !routeState?.location) return;

    hasHandledState.current = true;
    const params = new URLSearchParams(searchParams);

    if (routeState.rent) {
      const typeCode = normalizeLocationTypeCode(routeState.rent);
      if (typeCode) params.set("typeCode", typeCode);
    }
    if (routeState.location) {
      params.set("region", routeState.location);
    }

    // Clear state và chuyển sang URL params
    navigate(`${ROUTER_PATH.LOCATIONS}?${params.toString()}`, {
      replace: true,
      state: null,
    });
  }, [location.state, navigate, searchParams]);

  // ── Derived filter từ URL (nguồn sự thật duy nhất) ─────
  const filter = parseFilterFromURL(searchParams);

  // ── API call (Infinite) ────────────────────────────────
  const {
    data: locationData,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isError,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey: [
      LocationEndpoint.GET_LOCATION_BY_FILTER,
      filter.searchValue,
      filter.locationType,
      filter.addressCity,
      filter.addressRegion,
      filter.minPrice,
      filter.maxPrice,
      filter.minArea,
      filter.maxArea,
      filter.sortBy,
      filter.sortOrder,
      // Lưu ý: filter.page không đưa vào queryKey vì infinite scroll quản lý pageParam riêng
    ],
    queryFn: ({ pageParam = 1 }) => 
      getLocationByFilter({ ...filter, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const currentPage = Number(lastPage.page) || 1;
      const totalPages = Number(lastPage.totalPages) || 1;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    placeholderData: keepPreviousData,
  });

  // ── Cập nhật filter (ghi vào URL) ─────────────────────
  const updateFilter = useCallback(
    (newFilter: ProfileLocationFilter) => {
      const nextParams = buildURLFromFilter({
        ...newFilter,
        page: undefined, // Xóa page khỏi URL khi thay đổi filter để reset về đầu
      });
      setSearchParams(nextParams, {
        replace: true,
        preventScrollReset: true,
      });
    },
    [setSearchParams],
  );

  // ── Banner search: set q=, xóa hết filter cũ ──────────
  const handleSearch = useCallback(
    (keyword: string) => {
      const trimmed = keyword.trim();
      if (!trimmed) return;
      updateFilter({
        searchValue: trimmed,
      });
    },
    [updateFilter],
  );

  // ── Sidebar filter: giữ nguyên q=, cập nhật filter ────
  const handleFilterApply = useCallback(
    (sidebarFilter: ProfileLocationFilter) => {
      updateFilter({
        ...sidebarFilter,
        searchValue: filter.searchValue,
      });
    },
    [updateFilter, filter.searchValue],
  );

  const handleCardClick = useCallback(
    (code: string) => {
      const url = ROUTER_PATH.LOCATION_DETAIL.replace(":code", code);
      navigate(url, { state: { code } });
    },
    [navigate],
  );

  return {
    locationData,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isError,
    error,
    refetch,
    filter,
    updateFilter,
    handleFilterApply,
    handleSearch,
    handleCardClick,
    isFilterOpen,
    setIsFilterOpen,
  };
};
