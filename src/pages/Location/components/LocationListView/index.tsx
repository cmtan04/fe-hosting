import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { getLocationByFilter } from "../../../../api/configs/location.config";
import { LocationEndpoint } from "../../../../api/endpoints/location.endpoint";
import type { ProfileLocationFilter } from "../../../../common/types/profile";
import { Pagination } from "../../../../components/PaginationCommon/paginationCommon";
import { useLoading } from "../../../../providers/loadingProvider";
import { LocationCard } from "../LocationCard";
import "../style.scss";
import type { LocationDto } from "../../../../api/dtos/location.dto";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ROUTER_PATH } from "../../../../router/Route";

export const LocationListView = () => {
  const { setLoading } = useLoading();
  const [searchParams] = useSearchParams();
  const location = searchParams.get("location");
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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

  useEffect(() => {
    const resizeCards = () => {
      const cards = containerRef.current?.querySelectorAll(
        ".location__card",
      ) as NodeListOf<HTMLElement>;

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
  }, [locationData]);

  const handlePageChange = (page: number) => {
    setFilter((prev) => ({ ...prev, page }));
  };

  const totalPages = locationData?.totalPages ?? 1;

  const handleCardClick = (code: string) => {
    const url = ROUTER_PATH.LOCATION_DETAIL.replace(":code", code);
    navigate(url);
  };

  return (
    <div className="location__list">
      <h2 className="location__list-title">Danh sách địa điểm</h2>

      <div className="location__list-content" ref={containerRef}>
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
            onClick={handleCardClick}
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
