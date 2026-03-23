import { useSearchParams } from "react-router-dom";
import { locationProps } from "../../../../assets/data/mockData";
import { Banner } from "../../../../components/Banner/Banner";
import { useLoading } from "../../../../providers/loadingProvider";
import "../style.scss";
import { LocationListView } from "../../components/LocationListView";

export const LocationList = () => {
  const [searchParams] = useSearchParams();
  const location = searchParams.get("location");
  const props = locationProps.find((item) => item.id === location);

  return (
    <div className="location__list">
      <div className="location__list-banner">
        <Banner {...props} />
      </div>
      <LocationListView />
    </div>
  );
};
