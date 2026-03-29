import { useQuery } from "@tanstack/react-query";
import { Col, Row } from "antd";
import { useEffect } from "react";
import { useLocation } from "react-router";
import { getLocationByCode } from "../../../../api/configs/location.config";
import { LocationEndpoint } from "../../../../api/endpoints/location.endpoint";
import type { MediaItem } from "../../../../common/config/common-config";
import { MediaGallery } from "../../../../components/MediaComponent";
import { useLoading } from "../../../../providers/loadingProvider";
import pin from "../../../../assets/svg/home/pin.svg";
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
      <Row gutter={[16, 16]} className="location__detail-row-1">
        <Col span={24} className="location__detail-row-1-col">
          <MediaGallery media={media} />
          <div className="location__detail-row-1-info">
            <p className="content-label">
              <span>
                <img
                  src={locationDetail?.typeLogo}
                  alt={locationDetail?.typeCode}
                />
              </span>
              <span>{locationDetail?.typeName}</span>
            </p>
            <h1 className="content-name">{locationDetail?.locationName}</h1>
            {locationDetail?.address?.map((address, index) => (
              <div className="location__detail-address">
                <p key={index} className="address">
                  <span>
                    <img src={pin} alt="Pin" />
                  </span>
                  <span>{address.fullAddress} </span>
                  <span className="note">({address.addressNote})</span>
                </p>
              </div>
            ))}
          </div>
        </Col>
      </Row>
    </div>
  );
};
