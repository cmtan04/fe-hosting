import { useQuery } from "@tanstack/react-query";
import { Button, Col, Rate, Row } from "antd";
import { useEffect } from "react";
import { useLocation } from "react-router";
import { getLocationByCode } from "../../../../api/configs/location.config";
import { LocationEndpoint } from "../../../../api/endpoints/location.endpoint";
import pin from "../../../../assets/svg/home/pin.svg";
import type { MediaItem } from "../../../../common/config/common-config";
import { formatMoney } from "../../../../common/contexts/format";
import { MediaGallery } from "../../../../components/MediaComponent";
import { useLoading } from "../../../../providers/loadingProvider";
import { ServiceTag } from "../../../Renter/components/ServiceTag/intex";
import profileIcn from "../../../../assets/images/profile/icn_profile.svg";
import address from "../../../../assets/images/address.svg";
import mail from "../../../../assets/images/mail.svg";
import phone from "../../../../assets/images/phone.svg";
import message from "../../../../assets/svg/profile/chat.svg";
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
            <div className="location__detail-address">
              <p className="address">
                <span>
                  <img src={pin} alt="Pin" />
                </span>
                <span>{locationDetail?.address?.[0]?.fullAddress} </span>
                <span className="note">
                  ({locationDetail?.address?.[0]?.addressNote})
                </span>
              </p>
            </div>
          </div>
        </Col>
      </Row>
      <Row gutter={[16, 16]} className="location__detail-row-2">
        <Col span={16}>
          <Row gutter={[16, 16]} className="row-wrap-1">
            <Rate defaultValue={Number(locationDetail?.locationRate)} />
            <span className="code">
              Chưa có đánh giá · Mã: <span>{locationDetail?.locationCode}</span>
            </span>
          </Row>
          <Row gutter={[16, 16]} className="row-wrap">
            <Col span={24}>
              <p className="wrap-label">Giới thiệu</p>
              <p className="wrap-title">Về không gian này</p>
              <p className="wrap-content">
                {locationDetail?.locationDescription}
              </p>
            </Col>
          </Row>
          <Row gutter={[16, 16]} className="row-wrap">
            <Col span={24}>
              <p className="wrap-label">Vị trí</p>
              <p className="wrap-title">Địa chỉ cụ thể</p>
              <div className="wrap-content">
                {locationDetail?.address?.map((item, index) => (
                  <div className="wrap-content-row">
                    <div className="wrap-content-row-info">
                      <img src={pin} alt="" />
                      <div className="content">
                        <p className="name">{item.addressName}</p>
                        <p className="note">({item.fullAddress})</p>
                      </div>
                    </div>

                    <div className="wrap-content-row-map">
                      <iframe
                        title={`map-${index}`}
                        width="100%"
                        height="250"
                        frameBorder="0"
                        scrolling="no"
                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${Number(item.addressLong) - 0.01}%2C${
                          Number(item.addressLat) - 0.01
                        }%2C${Number(item.addressLong) + 0.01}%2C${Number(item.addressLat) + 0.01}&layer=mapnik&marker=${item.addressLat}%2C${item.addressLong}`}
                        style={{
                          border: "none",
                          pointerEvents: "none",
                        }}
                      ></iframe>
                    </div>
                  </div>
                ))}
              </div>
            </Col>
          </Row>
          <Row gutter={[16, 16]} className="row-wrap">
            <Col span={24}>
              <p className="wrap-label">Tiện ích & Dịch vụ</p>
              <p className="wrap-title">Những gì bạn sẽ nhận được</p>
              <div className="wrap-content-service">
                {locationDetail?.services?.map((service) => (
                  <ServiceTag
                    icon={service.serviceLogo}
                    name={service.serviceName}
                    price={service.servicePrice}
                    description={service.serviceDescription}
                    active={true}
                  />
                ))}
              </div>
            </Col>
          </Row>
        </Col>
        <Col span={8}>
          <div className="col-content">
            <div className="row-1">
              <p className="label">Giá thuê</p>
              <p className="tag">
                {locationDetail?.renterCode !== null ? "Đã thuê" : "Còn trống"}
              </p>
            </div>
            <div className="row-2">
              <div className="sum-price">
                <p className="sum-price-end">
                  <sup>đ</sup>
                  {formatMoney(
                    locationDetail?.locationPriceAfterDeal as string,
                  )}
                </p>
                <p className="sum-price-detail">
                  <span>
                    <sup>đ</sup>
                    {formatMoney(locationDetail?.locationPriceStart as string)}
                  </span>
                  <span> - </span>
                  <span>
                    <sup>đ</sup>
                    {formatMoney(locationDetail?.locationPriceEnd as string)}
                  </span>
                </p>
              </div>

              <div className="detail-price">
                <div className="detail-price-start">
                  <p className="detail-price-label">Giá gốc từ</p>
                  <p className="detail-price-value">
                    <sup>đ</sup>
                    {formatMoney(locationDetail?.locationPriceStart as string)}
                  </p>
                </div>

                <div className="detail-price-end">
                  <p className="detail-price-label">Giá gốc đến</p>
                  <p className="detail-price-value">
                    <sup>đ</sup>
                    {formatMoney(locationDetail?.locationPriceEnd as string)}
                  </p>
                </div>

                <div className="detail-price-rent">
                  <p className="detail-price-label">Giá thuê`</p>
                  <p className="detail-price-value">
                    <sup>đ</sup>
                    {formatMoney(
                      locationDetail?.locationPriceAfterDeal as string,
                    )}
                  </p>
                </div>

                {locationDetail?.minTime && locationDetail?.maxTime && (
                  <div className="detail-price-time">
                    <p className="detail-price-label">Thời gian thuê</p>
                    <p className="detail-price-value">
                      {locationDetail?.minTime} - {locationDetail?.maxTime}
                    </p>
                  </div>
                )}
              </div>

              <Button
                type="primary"
                block
                disabled={locationDetail?.renterCode !== null}
              >
                Thuê ngay
              </Button>
            </div>
          </div>

          <div className="col-owner">
            <img src={locationDetail?.ownerAvatar as string} alt="Owner" />
            <div className="owner-info">
              <h1 className="title">Liên hệ</h1>
              <p className="owner-name">
                <span>
                  <img src={profileIcn} alt="Profile" />
                </span>
                <span>{locationDetail?.ownerName}</span>
              </p>
              <p className="owner-address">
                <span>
                  <img src={address} alt="Address" />
                </span>
                <span>{locationDetail?.ownerAddress}</span>
              </p>
              <p className="owner-phone">
                <span>
                  <img src={phone} alt="Phone" />
                </span>
                <span>{locationDetail?.ownerPhone}</span>
              </p>
              <p className="owner-email">
                <span>
                  <img src={mail} alt="Email" />
                </span>
                <span>{locationDetail?.ownerEmail}</span>
              </p>
            </div>

            <div className="owner-contact">
              <Button type="primary">
                <span>
                  <img src={message} alt="Message" />
                </span>
                <span>Liên hệ</span>
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};
