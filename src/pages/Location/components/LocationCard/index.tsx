import "../style.scss";
import { Button, Col, Rate, Row, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { useRequireLoginAction } from "../../../../common/hooks/useRequireLoginAction";
import { useShare } from "@/common/hooks/useShare";
import { toggleFavoriteLocation } from "@common/utils/favoriteLocations";
import { StarFilled } from "@ant-design/icons";

import {
  EditOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  HeartFilled,
  HeartOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  ShareAltOutlined,
  TagOutlined,
} from "@ant-design/icons";

interface LocationCardProps {
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

interface LocationCardTooltipProps {
  description?: string;
  address?: string;
  rate?: number;
}

const LocationCardTooltip = ({
  description,
  address,
  rate,
}: LocationCardTooltipProps) => (
  <div className="location__card-toolTip">
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <p className="location__card-toolTip-description">
          <InfoCircleOutlined /> {description}
        </p>
        <p className="location__card-toolTip-address">
          <EnvironmentOutlined /> {address}
        </p>
        <Rate disabled defaultValue={Number(rate)} />
      </Col>
    </Row>
  </div>
);

export const LocationCard = (props: LocationCardProps) => {
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

  const handleOpenDetail = () => {
    console.debug("[LocationCard] open detail", {
      code: props.code,
      name: props.name,
    });
    props.onClick?.(props.code);
  };

  return (
    <Tooltip
      title={
        <LocationCardTooltip
          description={props.description}
          address={props.address}
          rate={props.rate}
        />
      }
      placement="topRight"
    >
      <div
        className="location__card"
        onClick={handleOpenDetail}
        role="button"
        tabIndex={0}
        aria-label={`Xem chi tiết ${props.name}`}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleOpenDetail();
          }
        }}
      >
        <div className="location__card-image">
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
        </div>
        <div className="location__card-content">
          <h4 className="location__card-title">
            <HomeOutlined /> {props.name}
          </h4>
          <div className="location__card-rate">{props.rate} <StarFilled /></div>
          <p className="location__card-description">
            <FileTextOutlined /> {props.description}
          </p>
          <p className="location__card-address">
            <EnvironmentOutlined /> {props.address}
          </p>
          <p className="location__card-price">
            <TagOutlined />{" "}
            <span>
              {props.price?.toLocaleString()} VNĐ/ {props.priceUnit || ""}
            </span>
          </p>
        </div>
      </div>
    </Tooltip>
  );
};
