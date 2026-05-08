import { Button } from "antd";
import type { LocationDto } from "@/api/dtos/location.dto";
import message from "@/assets/svg/profile/chat.svg";
import { MessageTypeEnum } from "@/common/constants/constants";
import { formatMoney } from "@/common/contexts/format";
import "./style.scss";

interface LocationBookingProps {
  locationDetail?: LocationDto;
  onContactOwner: (toUserCd: string, type: string, locationCd?: string) => void;
}

export const LocationBooking = ({
  locationDetail,
  onContactOwner,
}: LocationBookingProps) => {
  return (
    <div className="location-booking">
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
            {formatMoney(locationDetail?.locationPrice || locationDetail?.locationPriceAfterDeal)}/ {locationDetail?.locationPriceUnit}
          </p>
        </div>

        <div className="detail-price">
          <div className="detail-price-rent">
            <p className="detail-price-label">Giá thuê</p>
            <p className="detail-price-value">
              <sup>đ</sup>
              {formatMoney(locationDetail?.locationPrice || locationDetail?.locationPriceAfterDeal)}/ {locationDetail?.locationPriceUnit}
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
            onContactOwner(
              locationDetail?.ownerCode ?? "",
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
            onContactOwner(
              locationDetail?.ownerCode ?? "",
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
  );
};
