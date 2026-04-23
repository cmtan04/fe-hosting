import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Col, Rate, Row } from "antd";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { createConversation } from "../../../../api/configs/chat.config";
import {
  getComment,
  getLocationByCode,
  getRelatedLocation,
} from "../../../../api/configs/location.config";
import type {
  LocationDto,
  LocationParamDto,
} from "../../../../api/dtos/location.dto";
import { LocationEndpoint } from "../../../../api/endpoints/location.endpoint";
import address from "../../../../assets/images/address.svg";
import mail from "../../../../assets/images/mail.svg";
import phone from "../../../../assets/images/phone.svg";
import profileIcn from "../../../../assets/images/profile/icn_profile.svg";
import pin from "../../../../assets/svg/home/pin.svg";
import message from "../../../../assets/svg/profile/chat.svg";
import type { MediaItem } from "../../../../common/config/common-config";
import {
  DEFAULT_MESSAGE,
  MessageTypeEnum,
  NOTI_ERROR,
} from "../../../../common/constants/constants";
import { formatMoney } from "../../../../common/contexts/format";
import { MediaGallery } from "../../../../components/MediaComponent";
import { useLoading } from "../../../../providers/loadingProvider";
import { useNotification } from "../../../../providers/notificationProvider";
import { ROUTER_PATH } from "../../../../router/Route";
import { ServiceTag } from "../../../Renter/components/ServiceTag/intex";
import { useRequireLoginAction } from "../../../../common/hooks/useRequireLoginAction";
import { LocationComment } from "../../components/LocationComment";
import { LocationCard } from "../../components/LocationCard";

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
  const { code: locationCodeFromParams } = useParams<{ code: string }>();
  const locationCode =
    (location.state as { code?: string } | null)?.code ??
    locationCodeFromParams;
  const { setLoading } = useLoading();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { requireLoginAction } = useRequireLoginAction();

  const [filter, setFilter] = useState<LocationParamDto>({
    locationCode: locationCode,
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    if (locationCode) {
      setFilter({
        locationCode: locationCode,
        page: 1,
        limit: 10,
      });
    }
  }, [locationCode]);

  const { data: locationDetail, isLoading } = useQuery({
    queryKey: [LocationEndpoint.GET_LOCATION_BY_CODE, locationCode],
    queryFn: () => getLocationByCode(locationCode),
    enabled: !!locationCode,
  });

  const { data: commentData, refetch: refetchComment } = useQuery({
    queryKey: [LocationEndpoint.GET_LOCATION_COMMENT, filter],
    queryFn: () => getComment(filter),
  });
  const { data: relatedLocationData } = useQuery({
    queryKey: [LocationEndpoint.GET_RELATED_LOCATION, locationCode],
    queryFn: () =>
      getRelatedLocation({
        locationCode: locationCode as string,
        page: 1,
        limit: 8,
      }),
    enabled: Boolean(locationCode),
  });

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  const contactMutation = useMutation({
    mutationFn: ({
      toUserCd,
      type,
      locationCd,
    }: {
      toUserCd: string;
      type: string;
      locationCd?: string;
    }) => {
      console.log("[LocationDetail] createConversation payload", {
        toUserCd,
        type,
        locationCd,
      });
      return createConversation(toUserCd, type, locationCd);
    },
    onSuccess: (data) => {
      console.log("[LocationDetail] createConversation success", data);
      navigate(ROUTER_PATH.PROFILE_CHAT, {
        state: {
          conversationId: data?.id,
          source: "location-detail",
        },
      });
    },
    onError: (error) => {
      console.error("[LocationDetail] createConversation error", error);
      let message = DEFAULT_MESSAGE;
      if (isAxiosError(error)) {
        const apiMessage = error.response?.data?.message;
        console.error("[LocationDetail] createConversation error response", {
          status: error.response?.status,
          data: error.response?.data,
        });
        if (typeof apiMessage === "string") {
          message = apiMessage;
        } else if (Array.isArray(apiMessage) && apiMessage[0]) {
          message = apiMessage[0];
        }
      }
      showNotification(message, NOTI_ERROR);
    },
    onMutate: () => {
      setLoading(true);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const handleContactOwner = (
    toUserCd: string,
    type: string,
    locationCd?: string,
  ) => {
    requireLoginAction(
      () => {
        console.log("[LocationDetail] handleContactOwner", {
          toUserCd,
          type,
          locationCd,
          locationCode,
          ownerCode: locationDetail?.ownerCode,
          ownerName: locationDetail?.ownerName,
        });
        contactMutation.mutate({ toUserCd, type, locationCd });
      },
      {
        message: "Bạn cần đăng nhập để liên hệ chủ địa điểm.",
      },
    );
  };

  const handleCardClick = (code: string) => {
    const url = ROUTER_PATH.LOCATION_DETAIL.replace(":code", code);
    navigate(url, { state: { code } });
  };

  return (
    <div className="location__detail">
      <Row gutter={[16, 16]} className="location__detail-row-1">
        <Col span={24} className="location__detail-row-1-col">
          <div className="location__detail-row-1-media">
            <MediaGallery media={media} />
          </div>
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
        <Col xs={24} lg={16} className="location__detail-row-2-main">
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
                  <div
                    key={`${item.addressName}-${index}`}
                    className="wrap-content-row"
                  >
                    
                    <div className="wrap-content-row-info">
                      <img src={pin} alt="" />
                      <div className="content">
                        <p className="name">{item.addressName}</p>
                      <a
                        className="wrap-content-row-map-open note"
                        href={`https://www.google.com/maps/search/?api=1&query=${item.addressLat},${item.addressLong}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.fullAddress}
                      </a>
                      </div>
                    </div>

                    <div className="wrap-content-row-map">
                      <iframe
                        className="wrap-content-row-map-frame"
                        title={`map-${index}`}
                        frameBorder="0"
                        scrolling="no"
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${Number(item.addressLong) - 0.01}%2C${
                          Number(item.addressLat) - 0.01
                        }%2C${Number(item.addressLong) + 0.01}%2C${Number(item.addressLat) + 0.01}&layer=mapnik&marker=${item.addressLat}%2C${item.addressLong}`}
                        style={{ border: "none" }}
                      />
                      
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
                    key={service.serviceCode}
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
          <Row gutter={[16, 16]} className="row-wrap">
            <Col span={24}>
              <p className="row-3-label">Đánh giá</p>
              <p className="row-3-note">
                {locationDetail?.locationRate > 0 ? (
                  <Rate disabled defaultValue={locationDetail?.locationRate} />
                ) : (
                  <span>Chưa có đánh giá nào</span>
                )}
              </p>
              <div className="row-3-content">
                <p className="row-3-title">Bình luận</p>
                <LocationComment
                  locationCode={locationDetail?.locationCode}
                  data={commentData}
                  onRefetch={() => refetchComment()}
                  onShowMore={(nextPage) =>
                    setFilter((prev) => ({ ...prev, page: nextPage }))
                  }
                />
              </div>
            </Col>
          </Row>
        </Col>
        <Col xs={24} lg={8} className="location__detail-row-2-sidebar">
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
                  <p className="detail-price-label">Giá thuê</p>
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
                onClick={() =>
                  handleContactOwner(
                    locationDetail?.ownerCode as string,
                    MessageTypeEnum.RENT,
                    locationDetail?.locationCode,
                  )
                }
              >
                Thuê ngay
              </Button>
              <Button
                type="default"
                block
                className="contact-action"
                style={{ display: "none" }}
                onClick={() =>
                  handleContactOwner(
                    locationDetail?.ownerCode as string,
                    MessageTypeEnum.CONTACT,
                    locationDetail?.locationCode,
                  )
                }
              >
                <span>
                  <img src={message} alt="Message" />
                </span>
                <span>Liên hệ</span>
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
              <Button
                type="primary"
                onClick={() =>
                  handleContactOwner(
                    locationDetail?.ownerCode as string,
                    MessageTypeEnum.CONTACT,
                    locationDetail?.locationCode,
                  )
                }
              >
                <span>
                  <img src={message} alt="Message" />
                </span>
                <span>Liên hệ</span>
              </Button>
            </div>
          </div>
        </Col>

        <Col
          xs={24}
          md={12}
          lg={3}
          className="location__detail-row-2-sidebar"
          style={{ display: "none" }}
        >
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
              <Button
                type="primary"
                onClick={() =>
                  handleContactOwner(
                    locationDetail?.ownerCode as string,
                    MessageTypeEnum.CONTACT,
                    locationDetail?.locationCode,
                  )
                }
              >
                <span>
                  <img src={message} alt="Message" />
                </span>
                <span>Liên hệ</span>
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="location__detail-row-3">
        <Col span={24}>
          <h1 className="title">Các địa điểm khác</h1>
          <Row gutter={[12, 12]} className="list">
            {relatedLocationData?.data?.map((relatedLocation: LocationDto) => (
              <LocationCard
                key={relatedLocation.locationCode}
                code={relatedLocation.locationCode}
                typeName={relatedLocation.typeName}
                name={relatedLocation.locationName}
                description={relatedLocation.locationDescription}
                address={relatedLocation.address?.[0]?.fullAddress}
                rate={relatedLocation.locationRate}
                image={relatedLocation.locationLogo}
                isFavourite={false}
                onClick={handleCardClick}
              />
            ))}
          </Row>
        </Col>
      </Row>
    </div>
  );
};
