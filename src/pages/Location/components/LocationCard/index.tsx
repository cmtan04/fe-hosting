import "./style.scss";
import share from "../../../../assets/svg/location/share.svg";
import favouriteblack from "../../../../assets/svg/location/favourite-black.svg";
import favouritered from "../../../../assets/svg/location/favourite-red.svg";
import { Rate } from "antd";

interface LocationCardProps {
  code: string;
  typeName: string;
  name: string;
  description?: string;
  address?: string;
  rate?: number;
  image: string;
  isFavourite: boolean;
  onFavouriteToggle?: (code: string) => void;
  onShare?: (code: string) => void;
}

export const LocationCard = (props: LocationCardProps) => {
  let isFavourite = false;

  const handleFavourite = () => {
    isFavourite = !isFavourite;
    props.onFavouriteToggle?.(props.code);
  };

  const handleShare = () => {
    props.onShare?.(props.code);
  };
  return (
    <div className="location__card">
      <div className="location__card-image">
        <img src={props.image} alt="" />
        <div className="action">
          <button className="action--favourite" onClick={handleFavourite}>
            <img src={isFavourite ? favouritered : favouriteblack} alt="" />
          </button>
          <button className="action--share" onClick={handleShare}>
            <img src={share} alt="" />
          </button>
        </div>
      </div>
      <div className="location__card-content"></div>
      <h3 className="location__card-title">{props.name}</h3>
      <p className="location__card-description">{props.description}</p>
      <div className="location__card-details">
        <span className="location__card-type">{props.typeName}</span>
        <span className="location__card-address">{props.address}</span>
        <span className="location__card-rate">
          <Rate disabled defaultValue={Number(props.rate)} />
        </span>
      </div>
    </div>
  );
};
