import { useLocation } from "react-router-dom";
import { Banner } from "../../../../components/Banner/Banner";
import { LocationListView } from "../../components/LocationListView";
import "../style.scss";
import { locationProps } from "../../../../assets/data/mockData";

export const LocationList = () => {
  const location = useLocation();
  const props = locationProps.find(
    (item) => item.id === location?.state?.location,
  );

  return (
    <div className="location__list">
      <div className="location__list-banner">
        <Banner {...props} />
      </div>
      <LocationListView />
    </div>
  );
};
