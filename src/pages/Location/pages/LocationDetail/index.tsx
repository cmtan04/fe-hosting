import { Col, Row } from "antd";
import { MediaGallery } from "../../../../components/MediaComponent";
import type { MediaItem } from "../../../../common/config/common-config";
import { useQuery } from "@tanstack/react-query";
import { LocationEndpoint } from "../../../../api/endpoints/location.endpoint";
import { useLocation } from "react-router";
import { getLocationByCode } from "../../../../api/configs/location.config";
import { useEffect } from "react";
import { useLoading } from "../../../../providers/loadingProvider";
import { DOUBLE_DOT } from "../../../../common/constants/constants";

export const LocationDetail = () => {
  const media: MediaItem[] = [
    {
      url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=60",
      type: "image",
    },
    {
      url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=60",
      type: "image",
    },
    {
      url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=60",
      type: "image",
    },
  ];

  const location = useLocation();
  const locationCode = location?.state?.code;
  const { setLoading } = useLoading();

  const {
    data: locationDetail,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: [LocationEndpoint.GET_LOCATION_BY_CODE, locationCode],
    queryFn: () => getLocationByCode(locationCode),
    enabled: !!locationCode,
  });

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  console.log("locationDetail", locationDetail);
  return (
    <div className="location__detail">
      <Row gutter={[16, 16]} className="location__detail-content">
        <Col span={16} className="location__detail-content-left">
          <MediaGallery media={media} />
          <div className="location__detail-content-info">
            <h2>
              <span className="location__detail-content-info-code">
                {locationDetail?.locationCode}
              </span>
              <span>{DOUBLE_DOT}</span>
              <span className="location__detail-content-info-name">
                {locationDetail?.locationName}
              </span>
            </h2>

            <p className="location__detail-content-info-description">
              {locationDetail?.locationDescription}
            </p>

            {locationDetail?.address?.map((address, index) => (
              <div className="location__detail-address">
                <p key={index} className="address">
                  Địa chỉ {index + 1}: <span>{address.fullAddress} </span>
                </p>
                <p className="note">({address.addressNote})</p>
              </div>
            ))}
          </div>
        </Col>
        <Col span={8} className="location__detail-content-right" />
      </Row>
    </div>
  );
};
