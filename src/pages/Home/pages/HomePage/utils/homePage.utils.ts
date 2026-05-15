import type { ProfileLocationFilter } from "@common/types/profile";
import { ROUTER_PATH } from "@router/Route";

export const buildLocationSearchUrl = (filter: ProfileLocationFilter) => {
  const params = new URLSearchParams();

  if (filter.searchValue) params.set("q", filter.searchValue);
  if (filter.locationType) params.set("typeCode", filter.locationType);
  if (filter.addressRegion) params.set("region", filter.addressRegion);
  if (typeof filter.minPrice === "number") {
    params.set("minPrice", String(filter.minPrice));
  }
  if (typeof filter.maxPrice === "number") {
    params.set("maxPrice", String(filter.maxPrice));
  }
  if (filter.sortBy) params.set("sortBy", filter.sortBy);
  if (filter.sortOrder) params.set("sortOrder", filter.sortOrder);
  params.set("page", String(filter.page ?? 1));
  if (filter.limit) params.set("limit", String(filter.limit));

  return `${ROUTER_PATH.LOCATIONS}?${params.toString()}`;
};

export const formatLocationPrice = (price?: number, priceUnit?: string) => {
  if (!price || price <= 0) {
    return "Đang cập nhật giá";
  }

  return `${price.toLocaleString()} VNĐ/${priceUnit || "tháng"}`;
};

export const formatLocationRating = (rating?: number) =>
  rating ? rating.toFixed(1) : "0.0";

export const getHomePageFallbackImage = (variant: "hero" | "listing") => {
  if (variant === "hero") {
    return "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80";
  }

  return "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80";
};
