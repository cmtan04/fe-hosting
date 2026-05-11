import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { getLocationByFilter } from "@/api/configs/location.config";
import type { PaginatedLocationDto } from "@/api/dtos/location.dto";
import { DEFAULT_MESSAGE } from "@/common/constants/constants";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { ProfileLocationFilter } from "@/common/types/profile";
import { LocationEndpoint } from "@/api/endpoints/location.endpoint";
import {
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
  buildMergedFilter,
  parseFilterFromSearchParams,
  normalizeFilter,
  normalizeSearchValue,
  getFilterSignature,
  buildSearchParamsFromFilter,
  hasScopedLocationFilter,
} from "../utils";
import { isAxiosError } from "axios";
import { ROUTER_PATH } from "@/router/Route";

export interface LocationListViewProps {
  searchValue?: string;
  routeFilter?: ProfileLocationFilter;
  embedded?: boolean;
  enabled?: boolean;
  title?: string;
  hideTitle?: boolean;
  queryKeyPrefix?: string;
  fetchLocations?: (
    filter: ProfileLocationFilter,
  ) => Promise<PaginatedLocationDto>;
}
export const useLocationList = (props: LocationListViewProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const isEmbedded = Boolean(props.embedded);
  const fetchLocations = props.fetchLocations ?? getLocationByFilter;
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [filter, setFilter] = useState<ProfileLocationFilter>(() => {
    if (isEmbedded) {
      return normalizeFilter({
        page: DEFAULT_PAGE,
        limit: DEFAULT_LIMIT,
        ...props.routeFilter,
      });
    }

    const queryFilter = parseFilterFromSearchParams(searchParams);
    return buildMergedFilter(props.routeFilter, queryFilter, {
      page: DEFAULT_PAGE,
      limit: DEFAULT_LIMIT,
    });
  });

  const canFetchLocations = isEmbedded
    ? (props.enabled ?? true)
    : hasScopedLocationFilter(filter);

  const {
    data: locationData,
    isLoading: locationLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: [
      props.queryKeyPrefix ?? LocationEndpoint.GET_LOCATION_BY_FILTER,
      filter,
    ],
    queryFn: () => fetchLocations(filter),
    enabled: canFetchLocations,
  });

  useEffect(() => {
    if (isEmbedded) {
      setFilter((prevFilter) => {
        const nextFilter = normalizeFilter({
          ...prevFilter,
          ...props.routeFilter,
        });

        if (getFilterSignature(prevFilter) === getFilterSignature(nextFilter)) {
          return prevFilter;
        }

        return nextFilter;
      });
      return;
    }

    const queryFilter = parseFilterFromSearchParams(searchParams);
    setFilter((prevFilter) => {
      const nextFilter = buildMergedFilter(
        props.routeFilter,
        queryFilter,
        prevFilter,
      );

      if (getFilterSignature(prevFilter) === getFilterSignature(nextFilter)) {
        return prevFilter;
      }

      return nextFilter;
    });
  }, [isEmbedded, props.routeFilter, searchParams]);

  useEffect(() => {
    if (props.searchValue === undefined) {
      return;
    }

    const nextSearchValue = normalizeSearchValue(props.searchValue);

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
  }, [props.searchValue]);

  useEffect(() => {
    if (isEmbedded) {
      return;
    }

    const nextSearchParams = buildSearchParamsFromFilter(filter);

    if (searchParams.toString() !== nextSearchParams.toString()) {
      setSearchParams(nextSearchParams, { replace: true });
    }
  }, [filter, isEmbedded, searchParams, setSearchParams]);

  useEffect(() => {
    const resizeCards = () => {
      const cards =
        containerRef.current?.querySelectorAll<HTMLElement>(".location__card");

      if (!cards || cards.length === 0) return;

      cards.forEach((card) => (card.style.height = "auto"));

      let maxHeight = 0;
      cards.forEach((card) => {
        if (card.offsetHeight > maxHeight) maxHeight = card.offsetHeight;
      });

      cards.forEach((card) => {
        card.style.height = `${maxHeight}px`;
      });
    };

    resizeCards();
    window.addEventListener("resize", resizeCards);
    return () => window.removeEventListener("resize", resizeCards);
  }, [locationData, isError, locationLoading]);

  const handlePageChange = (page: number) => {
    setFilter((prevFilter) => normalizeFilter({ ...prevFilter, page }));
  };

  const totalPages = locationData?.totalPages ?? 1;
  const currentPage = filter.page ?? DEFAULT_PAGE;
  const locations = locationData?.data ?? [];
  const errorMessage = isAxiosError(error)
    ? (error.response?.data?.message ?? DEFAULT_MESSAGE)
    : DEFAULT_MESSAGE;

  const handleCardClick = (code: string) => {
    const url = ROUTER_PATH.LOCATION_DETAIL.replace(":code", code);
    navigate(url, { state: { code } });
  };
  const totalItems = locationData?.total ?? 0;
  return {
    searchParams,
    filter,
    locationData,
    locationLoading,
    isFetching,
    isError,
    error,
    refetch,
    totalPages,
    currentPage,
    totalItems,
    locations,
    errorMessage,
    handlePageChange,
    handleCardClick,
    canFetchLocations,
    containerRef,
    isEmbedded,
    setFilter,
    isFilterOpen,
    setIsFilterOpen,
  };
};
