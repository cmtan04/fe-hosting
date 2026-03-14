import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getLocationByFilter } from "../../../../api/configs/location.config";
import { LocationEndpoint } from "../../../../api/endpoints/location.endpoint";
import type { ProfileLocationFilter } from "../../../../common/types/profile";
import { Pagination } from "../../../../components/PaginationCommon/paginationCommon";
import { useLoading } from "../../../../providers/loadingProvider";
import { LocationCard } from "../LocationCard";
import "../style.scss";
import type { LocationDto } from "../../../../api/dtos/location.dto";
import { useSearchParams } from "react-router-dom";

export const LocationListView = () => {
  const { setLoading } = useLoading();
  const [searchParams] = useSearchParams();
  const location = searchParams.get("location");
  const [filter, setFilter] = useState<ProfileLocationFilter>({
    page: 1,
    limit: 20,
  });

  const { data: locationData, isLoading: locationLoading } = useQuery({
    queryKey: [LocationEndpoint.GET_LOCATION_BY_FILTER, filter],
    queryFn: () => getLocationByFilter(filter),
  });

  useEffect(() => {
    setLoading(locationLoading);
  }, [locationLoading]);

  useEffect(() => {
    if (location) {
      setFilter((prev) => ({
        ...prev,
        addressRegion: location,
      }));
    }
  }, [location]);

  const handlePageChange = (page: number) => {
    setFilter((prev) => ({ ...prev, page }));
  };

  const totalPages = locationData?.totalPages ?? 1;

  return (
    <div className="location__list">
      <h2 className="location__list-title">Danh sách địa điểm</h2>
      <div className="location__list-content">
        {locationData?.data?.map((location: LocationDto) => (
          <LocationCard
            key={location.locationCode}
            code={location.locationCode}
            typeName={location.typeName}
            name={location.locationName}
            description={location.locationDescription}
            address={location.address[0]?.fullAddress}
            rate={location.locationRate}
            image={location.locationLogo}
            isFavourite={false}
          />
        ))}
      </div>
      <Pagination
        currentPage={filter.page ?? 1}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};
