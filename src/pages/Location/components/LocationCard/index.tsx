import "../style.scss";
import share from "../../../../assets/svg/location/share.svg";
import favouriteblack from "../../../../assets/svg/location/favourite-black.svg";
import favouritered from "../../../../assets/svg/location/favourite-red.svg";
import { Col, Rate, Row, Tooltip } from "antd";
import { useState } from "react";

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
  onClick?: (code: string) => void;
}

export const LocationCard = (props: LocationCardProps) => {
  const [isFavourite, setIsFavourite] = useState(props.isFavourite);

  const handleFavourite = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsFavourite((prev) => !prev);
    props.onFavouriteToggle?.(props.code);
  };

  const handleShare = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    props.onShare?.(props.code);
  };

  return (
    <Tooltip
      title={() => (
        <div className="location__card-toolTip">
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <img
                className="location__card-toolTip-img"
                src={props.image}
                alt=""
              />
            </Col>
            <Col span={16}>
              <h3 className="location__card-toolTip-title">
                {props.typeName} <span>:</span> {props.name}
              </h3>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <p className="location__card-toolTip-description">
                {props.description}
              </p>
              <p className="location__card-toolTip-address">
                Địa chỉ: {props.address}
              </p>
              <Rate disabled defaultValue={Number(props.rate)} />
            </Col>
          </Row>
        </div>
      )}
      placement="topRight"
    >
      <div
        className="location__card"
        onClick={() => props.onClick?.(props.code)}
      >
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
        <div className="location__card-content">
          <h3 className="location__card-title">
            {props.typeName} <span>:</span> {props.name}
          </h3>
          <p className="location__card-description">{props.description}</p>
          <p className="location__card-address">Địa chỉ: {props.address}</p>
          <Rate disabled defaultValue={Number(props.rate)} />
        </div>
      </div>
    </Tooltip>
  );
};
