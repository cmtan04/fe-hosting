import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useEffect, useRef, useState } from "react";
import { getLocationByFilter } from "../../../../api/configs/location.config";
import type { PaginatedLocationDto } from "../../../../api/dtos/location.dto";
import { LocationEndpoint } from "../../../../api/endpoints/location.endpoint";
import { DEFAULT_MESSAGE } from "../../../../common/constants/constants";
import type { ProfileLocationFilter } from "../../../../common/types/profile";
import { Pagination } from "../../../../components/PaginationCommon/paginationCommon";
import { ROUTER_PATH } from "../../../../router/Route";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LocationCard } from "../LocationCard";
import "../style.scss";
import type { LocationDto } from "../../../../api/dtos/location.dto";
import { LocationFilterDrawer } from "../LocationFilterDrawer";
import { FilterOutlined } from "@ant-design/icons";
import { Button } from "antd";

interface LocationListViewProps {
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

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

const cleanString = (value?: string | null) => {
  const trimmedValue = value?.trim();
  return trimmedValue || undefined;
};

const normalizeSearchValue = (value?: string | null) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  return value;
};

const parsePositiveInt = (value?: string | null) => {
  if (!value) return undefined;
  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    return undefined;
  }

  return parsedValue;
};

const parseFilterFromSearchParams = (
  searchParams: URLSearchParams,
): ProfileLocationFilter => {
  const querySearchValue = searchParams.get("q") ?? searchParams.get("search");

  return {
    addressRegion: cleanString(searchParams.get("location")),
    locationType: cleanString(searchParams.get("rent")),
    searchValue: normalizeSearchValue(querySearchValue),
    page: parsePositiveInt(searchParams.get("page")),
    limit: parsePositiveInt(searchParams.get("limit")),
    minPrice: parsePositiveInt(searchParams.get("minPrice")),
    maxPrice: parsePositiveInt(searchParams.get("maxPrice")),
    minArea: parsePositiveInt(searchParams.get("minArea")),
    maxArea: parsePositiveInt(searchParams.get("maxArea")),
    addressCity: cleanString(searchParams.get("city")),
  };
};

const normalizeFilter = (
  filter: ProfileLocationFilter,
): ProfileLocationFilter => {
  return {
    ...filter,
    addressRegion: cleanString(filter.addressRegion),
    locationType: cleanString(filter.locationType),
    searchValue: normalizeSearchValue(filter.searchValue),
    minPrice: filter.minPrice,
    maxPrice: filter.maxPrice,
    minArea: filter.minArea,
    maxArea: filter.maxArea,
    addressCity: cleanString(filter.addressCity),
    page:
      typeof filter.page === "number" && filter.page > 0
        ? filter.page
        : DEFAULT_PAGE,
    limit:
      typeof filter.limit === "number" && filter.limit > 0
        ? filter.limit
        : DEFAULT_LIMIT,
  };
};

const buildMergedFilter = (
  routeFilter?: ProfileLocationFilter,
  queryFilter?: ProfileLocationFilter,
  baseFilter?: ProfileLocationFilter,
): ProfileLocationFilter => {
  const mergedFilter: ProfileLocationFilter = {};

  if (baseFilter) {
    Object.assign(mergedFilter, baseFilter);
  }

  if (queryFilter) {
    Object.assign(mergedFilter, queryFilter);
  }

  if (routeFilter) {
    Object.assign(mergedFilter, routeFilter);
  }

  mergedFilter.page =
    routeFilter?.page ?? queryFilter?.page ?? baseFilter?.page ?? DEFAULT_PAGE;
  mergedFilter.limit =
    routeFilter?.limit ??
    queryFilter?.limit ??
    baseFilter?.limit ??
    DEFAULT_LIMIT;

  return normalizeFilter(mergedFilter);
};

const getFilterSignature = (filter: ProfileLocationFilter) => {
  const normalizedFilter = normalizeFilter(filter);
  return JSON.stringify({
    addressRegion: normalizedFilter.addressRegion ?? "",
    locationType: normalizedFilter.locationType ?? "",
    searchValue: normalizedFilter.searchValue ?? "",
    minPrice: normalizedFilter.minPrice ?? "",
    maxPrice: normalizedFilter.maxPrice ?? "",
    minArea: normalizedFilter.minArea ?? "",
    maxArea: normalizedFilter.maxArea ?? "",
    addressCity: normalizedFilter.addressCity ?? "",
    page: normalizedFilter.page ?? DEFAULT_PAGE,
    limit: normalizedFilter.limit ?? DEFAULT_LIMIT,
  });
};

const hasScopedLocationFilter = (filter: ProfileLocationFilter) => {
  return Boolean(
    cleanString(filter.locationType) ||
      cleanString(filter.addressRegion) ||
      cleanString(filter.searchValue) ||
      filter.minPrice !== undefined ||
      filter.maxPrice !== undefined ||
      filter.minArea !== undefined ||
      filter.maxArea !== undefined ||
      cleanString(filter.addressCity),
  );
};

const buildSearchParamsFromFilter = (filter: ProfileLocationFilter) => {
  const normalizedFilter = normalizeFilter(filter);
  const nextSearchParams = new URLSearchParams();

  if (normalizedFilter.addressRegion) {
    nextSearchParams.set("location", normalizedFilter.addressRegion);
  }

  if (normalizedFilter.locationType) {
    nextSearchParams.set("rent", normalizedFilter.locationType);
  }

  if (normalizedFilter.searchValue) {
    nextSearchParams.set("q", normalizedFilter.searchValue);
  }
  
  if (normalizedFilter.minPrice !== undefined) {
    nextSearchParams.set("minPrice", String(normalizedFilter.minPrice));
  }
  
  if (normalizedFilter.maxPrice !== undefined) {
    nextSearchParams.set("maxPrice", String(normalizedFilter.maxPrice));
  }
  
  if (normalizedFilter.minArea !== undefined) {
    nextSearchParams.set("minArea", String(normalizedFilter.minArea));
  }
  
  if (normalizedFilter.maxArea !== undefined) {
    nextSearchParams.set("maxArea", String(normalizedFilter.maxArea));
  }
  
  if (normalizedFilter.addressCity) {
    nextSearchParams.set("city", normalizedFilter.addressCity);
  }

  if ((normalizedFilter.page ?? DEFAULT_PAGE) > DEFAULT_PAGE) {
    nextSearchParams.set("page", String(normalizedFilter.page));
  }

  if ((normalizedFilter.limit ?? DEFAULT_LIMIT) !== DEFAULT_LIMIT) {
    nextSearchParams.set("limit", String(normalizedFilter.limit));
  }

  return nextSearchParams;
};

export const LocationListView = (props: LocationListViewProps) => {
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
    queryKey: [props.queryKeyPrefix ?? LocationEndpoint.GET_LOCATION_BY_FILTER, filter],
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

  return (
    <div className="location__list">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        {props.hideTitle ? <div /> : (
          <h2 className="location__list-title" style={{ margin: 0 }}>
            {props.title ?? "Danh sách địa điểm"}
          </h2>
        )}
        
        {!isEmbedded && (
          <Button 
            icon={<FilterOutlined />} 
            onClick={() => setIsFilterOpen(true)}
          >
            Lọc kết quả
          </Button>
        )}
      </div>

      {canFetchLocations && isFetching && !locationLoading && (
        <p className="location__list-status">Đang cập nhật danh sách...</p>
      )}

      <div className="location__list-content" ref={containerRef}>
        {!canFetchLocations && !isEmbedded ? (
          <div className="location__list-state">
            <p className="location__list-state-title">
              Chưa hỗ trợ xem toàn bộ địa điểm
            </p>
            <p className="location__list-state-description">
              Hãy chọn loại hình hoặc khu vực từ menu để xem danh sách phù hợp.
            </p>
          </div>
        ) : null}

        {canFetchLocations && locationLoading
          ? Array.from({ length: 8 }, (_, index) => (
              <div key={index} className="location__card-skeleton" />
            ))
          : null}

        {canFetchLocations && !locationLoading && isError ? (
          <div className="location__list-state">
            <p className="location__list-state-title">
              Không thể tải danh sách địa điểm
            </p>
            <p className="location__list-state-description">{errorMessage}</p>
            <button
              type="button"
              className="location__list-state-action"
              onClick={() => {
                void refetch();
              }}
            >
              Thử lại
            </button>
          </div>
        ) : null}

        {canFetchLocations &&
        !locationLoading &&
        !isError &&
        locations.length === 0 ? (
          <div className="location__list-state">
            <p className="location__list-state-title">
              Không tìm thấy địa điểm nào phù hợp
            </p>
            <p className="location__list-state-description">
              Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc khu vực/loại hình.
            </p>
          </div>
        ) : null}

        {canFetchLocations && !locationLoading && !isError
          ? locations.map((location: LocationDto) => (
              <LocationCard
                key={location.locationCode}
                code={location.locationCode}
                typeName={location.typeName}
                name={location.locationName}
                description={location.locationDescription}
                address={location.address?.[0]?.fullAddress}
                rate={location.locationRate}
                image={location.locationLogo}
                isFavourite={false}
                onClick={handleCardClick}
              />
            ))
          : null}
      </div>

      {canFetchLocations && !locationLoading && !isError ? (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      ) : null}

      {!isEmbedded && (
        <LocationFilterDrawer
          open={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          initialFilter={filter}
          onApply={(newFilter) => {
            setFilter(newFilter);
          }}
        />
      )}
    </div>
  );
};
