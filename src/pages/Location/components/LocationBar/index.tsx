import "./style.scss";
import { Col, Rate, Row, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { useRequireLoginAction } from "../../../../common/hooks/useRequireLoginAction";
import { useShare } from "@/common/hooks/useShare";
import { toggleFavoriteLocation } from "@common/utils/favoriteLocations";

import {
  EditOutlined,
  EnvironmentOutlined,
  HeartFilled,
  HeartOutlined,
  ShareAltOutlined,
  StarFilled,
} from "@ant-design/icons";

interface LocationBarProps {
  code: string;
  typeName: string;
  name: string;
  description?: string;
  address?: string;
  rate?: number;
  price?: number;
  priceUnit?: string;
  image: string;
  isFavourite: boolean;
  showEdit?: boolean;
  onFavouriteToggle?: (code: string) => void;
  onShare?: (code: string) => void;
  onEdit?: (code: string) => void;
  onClick?: (code: string) => void;
}

export const LocationBar = (props: LocationBarProps) => {
  const [isFavourite, setIsFavourite] = useState(props.isFavourite);
  const { requireLoginAction } = useRequireLoginAction();
  const { handleShare: shareAction } = useShare();

  useEffect(() => {
    setIsFavourite(props.isFavourite);
  }, [props.isFavourite]);

  const handleFavourite = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    requireLoginAction(
      () => {
        setIsFavourite((prev) => !prev);
        if (props.onFavouriteToggle) {
          props.onFavouriteToggle(props.code);
          return;
        }

        toggleFavoriteLocation({
          locationCode: props.code,
          typeName: props.typeName,
          name: props.name,
          description: props.description,
          address: props.address,
          rate: props.rate,
          price: props.price,
          priceUnit: props.priceUnit,
          image: props.image,
        });
      },
      {
        message: "Bạn cần đăng nhập để thêm địa điểm vào danh sách yêu thích.",
      },
    );
  };

  const handleEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    props.onEdit?.(props.code);
  };

  const handleShare = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (props.onShare) {
      props.onShare(props.code);
    } else {
      shareAction(props.code, props.name);
    }
  };

  return (
    <Row
      gutter={[16, 16]}
      className="location__bar"
      onClick={() => props.onClick?.(props.code)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          props.onClick?.(props.code);
        }
      }}
    >
      <Col xs={24} sm={8} className="location__bar-image">
        <img src={props.image} alt="" />
        <div className="action">
          <button className="action--favourite" onClick={handleFavourite}>
            {isFavourite ? (
              <HeartFilled style={{ color: "#ff1818" }} />
            ) : (
              <HeartOutlined />
            )}
          </button>
          <button className="action--share" onClick={handleShare}>
            <ShareAltOutlined />
          </button>
          {props.showEdit && (
            <button className="action--edit" onClick={handleEdit}>
              <EditOutlined />
            </button>
          )}
        </div>
      </Col>
      <Col xs={24} sm={16} className="location__bar-content">
        <div className="location__bar-header">
          <div className="location__bar-title-wrap">
            <Tooltip title={props.name}>
              <h4 className="location__bar-title">{props.name}</h4>
            </Tooltip>
          </div>
        </div>

        <div className="location__bar-rate">
            {props.rate} <StarFilled />
        </div>

        <p className="location__bar-address">
          <EnvironmentOutlined /> {props.address}
        </p>

        <Tooltip title={props.description}>
          <p className="location__bar-description">{props.description}</p>
        </Tooltip>

        <div className="location__bar-footer">
          <p className="location__bar-price">
            <span>
              {props.price?.toLocaleString()} VNĐ/ {props.priceUnit || ""}
            </span>
          </p>
        </div>
      </Col>
    </Row>
  );
};
