import "../style.scss";
import { Col, Rate, Row, Tooltip } from "antd";
import { useState } from "react";
import { useRequireLoginAction } from "../../../../common/hooks/useRequireLoginAction";

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
  image: string;
  isFavourite: boolean;
  showEdit?: boolean;
  onFavouriteToggle?: (code: string) => void;
  onShare?: (code: string) => void;
  onEdit?: (code: string) => void;
  onClick?: (code: string) => void;
}

export const LocationCard = (props: LocationCardProps) => {
  const [isFavourite, setIsFavourite] = useState(props.isFavourite);
  const { requireLoginAction } = useRequireLoginAction();

  const handleFavourite = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    requireLoginAction(
      () => {
        setIsFavourite((prev) => !prev);
        props.onFavouriteToggle?.(props.code);
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
    props.onShare?.(props.code);
  };

  return (
    <Tooltip
      title={() => (
        <div className="location__card-toolTip">
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <p className="location__card-toolTip-description">
                <InfoCircleOutlined /> {props.description}
              </p>
              <p className="location__card-toolTip-address">
                <EnvironmentOutlined /> {props.address}
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
          <p className="location__card-description">
            <FileTextOutlined /> {props.description}
          </p>
          <p className="location__card-address">
            <EnvironmentOutlined /> {props.address}
          </p>
          <p className="location__card-price">
            <TagOutlined /> <span>{props.price?.toLocaleString()} VNĐ</span>
          </p>
        </div>
      </div>
    </Tooltip>
  );
};
