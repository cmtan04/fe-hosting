import type { ProfileLocationFilter } from "@/common/types/profile";

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 20;

export const cleanString = (value?: string | null) => {
  const trimmedValue = value?.trim();
  return trimmedValue || undefined;
};

export const normalizeSearchValue = (value?: string | null) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  return value;
};

export const parsePositiveInt = (value?: string | null) => {
  if (!value) return undefined;
  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    return undefined;
  }

  return parsedValue;
};

export const parseFilterFromSearchParams = (
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

export const normalizeFilter = (
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

export const stripUndefined = (obj: any): any => {
  const result: any = {};
  for (const key in obj) {
    if (
      Object.prototype.hasOwnProperty.call(obj, key) &&
      obj[key] !== undefined
    ) {
      result[key] = obj[key];
    }
  }
  return result;
};

export const buildMergedFilter = (
  routeFilter?: ProfileLocationFilter,
  queryFilter?: ProfileLocationFilter,
  baseFilter?: ProfileLocationFilter,
): ProfileLocationFilter => {
  const mergedFilter: ProfileLocationFilter = {};

  if (baseFilter) {
    Object.assign(mergedFilter, stripUndefined(baseFilter));
  }

  if (queryFilter) {
    Object.assign(mergedFilter, stripUndefined(queryFilter));
  }

  if (routeFilter) {
    Object.assign(mergedFilter, stripUndefined(routeFilter));
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

export const getFilterSignature = (filter: ProfileLocationFilter) => {
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

export const hasScopedLocationFilter = (filter: ProfileLocationFilter) => {
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

export const buildSearchParamsFromFilter = (filter: ProfileLocationFilter) => {
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
