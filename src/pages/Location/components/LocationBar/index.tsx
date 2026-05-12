import "./style.scss";
import { Col, Rate, Row, Tooltip } from "antd";
import { useState } from "react";
import { useRequireLoginAction } from "../../../../common/hooks/useRequireLoginAction";
import { useShare } from "@/common/hooks/useShare";

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
    if (props.onShare) {
      props.onShare(props.code);
    } else {
      shareAction(props.code, props.name);
    }
  };

  const truncateText = (text: string = "", maxLength: number) => {
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  return (
    <Row gutter={[16,16]} className="location__bar" onClick={() => props.onClick?.(props.code)}>
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

        <p className="location__bar-address">
          <EnvironmentOutlined /> {" "}
          {props.address}
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
