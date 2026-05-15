import { useMemo, useState } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";
import { getLocationByFilter } from "@api/configs/location.config";
import type { LocationDto } from "@api/dtos/location.dto";
import {
  FEATURED_SECTIONS,
  HOME_PAGE_QUERY_KEYS,
} from "../utils/homePage.constants";

type QueryLocationResult = {
  data?: LocationDto[];
};

export const useHomePage = () => {
  const [filter, setFilter] = useState<string>("");

  const featuredQueries = useQueries({
    queries: FEATURED_SECTIONS.map((section) => ({
      queryKey: [HOME_PAGE_QUERY_KEYS.featuredLocations, section.key],
      queryFn: () => getLocationByFilter(section.filter),
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      retry: 1,
    })),
  });

  const featuredSections = useMemo(
    () =>
      FEATURED_SECTIONS.map((section, index) => ({
        ...section,
        locations: featuredQueries[index]?.data?.data ?? [],
        isLoading: featuredQueries[index]?.isLoading ?? false,
        isError: featuredQueries[index]?.isError ?? false,
        renderType: section.key === "featured" ? "map" : "  support",
      })),
    [featuredQueries],
  );

  return {
    featuredSections,
  };
};
