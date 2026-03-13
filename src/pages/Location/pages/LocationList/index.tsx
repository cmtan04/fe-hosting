import { useEffect, useState } from "react";
import { Banner } from "../../../../components/Banner/Banner";
import "../style.scss";
import type { ProfileLocationFilter } from "../../../../common/types/profile";
import { LocationEndpoint } from "../../../../api/endpoints/location.endpoint";
import { useQuery } from "@tanstack/react-query";
import { useLoading } from "../../../../providers/loadingProvider";
import { getLocationByFilter } from "../../../../api/configs/location.config";
import { LocationCard } from "../../components/LocationCard";
import { useSearchParams } from "react-router-dom";
import { locationProps } from "../../../../assets/data/mockData";

export const LocationList = () => {
  const { setLoading } = useLoading();
  const [filter, setFilter] = useState<ProfileLocationFilter>();
  const [searchParams] = useSearchParams();
  const location = searchParams.get("location");
  const props = locationProps.find((item) => item.id === location);

  const { data: locationData, isLoading: locationLoading } = useQuery({
    queryKey: [LocationEndpoint.GET_LOCATION_BY_FILTER, filter],
    queryFn: () => getLocationByFilter(filter),
  });

  console.log(locationData);

  useEffect(() => {
    setLoading(locationLoading);
  }, [locationLoading]);
  return (
    <div className="location__list">
      <div className="location__list-banner">
        <Banner {...props} />
      </div>
      <div className="location__list-content">
        <h2 className="location__list-content-title">Danh sách địa điểm</h2>
        <div className="location__card-content-list">
          {locationData?.map((location) => (
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
      </div>
    </div>
  );
};
