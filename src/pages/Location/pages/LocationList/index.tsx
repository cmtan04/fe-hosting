import { useLocation } from "react-router-dom";
import { Banner } from "../../../../components/Banner/Banner";
import { LocationListView } from "../../components/LocationListView";
import "../style.scss";
import { locationProps, roomTypeProps } from "../../../../assets/data/mockData";
import { useMemo, useState } from "react";
import type { ProfileLocationFilter } from "../../../../common/types/profile";

interface LocationRouteState {
  rent?: string;
  location?: string;
  page?: number;
}

const normalizeRentBannerId = (value?: string) =>
  value?.trim().toLowerCase().replace(/_/g, "-");

export const LocationList = () => {
  const location = useLocation();
  const [keyword, setKeyword] = useState<string | undefined>(undefined);
  const routeState = (location.state as LocationRouteState | null) ?? null;

  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );

  const routeFilter = useMemo<ProfileLocationFilter>(() => {
    const nextFilter: ProfileLocationFilter = {};

    if (routeState?.location) {
      nextFilter.addressRegion = routeState.location;
    }

    if (routeState?.rent) {
      nextFilter.locationType = routeState.rent;
    }

    if (typeof routeState?.page === "number" && routeState.page > 0) {
      nextFilter.page = routeState.page;
    }

    return nextFilter;
  }, [routeState?.location, routeState?.page, routeState?.rent]);

  const bannerKey =
    searchParams.get("location") ??
    routeState?.location ??
    searchParams.get("rent") ??
    routeState?.rent;

  const props =
    locationProps.find((item) => item.id === bannerKey) ??
    roomTypeProps.find((item) => item.id === normalizeRentBannerId(bannerKey));

  return (
    <div className="location">
      <Banner {...props} onSearch={(value) => setKeyword(value)} />

      <LocationListView searchValue={keyword} routeFilter={routeFilter} />
    </div>
  );
};
