import { MessageOutlined } from "@ant-design/icons";
import { Button } from "antd";
import type { LocationDto } from "@/api/dtos/location.dto";
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
  const isRented = locationDetail?.renterCode !== null;
  const displayPrice =
    locationDetail?.locationPriceAfterDeal || locationDetail?.locationPrice || 0;

  return (
    <div className="location-booking">
      <div className="row-1">
        <p className="label">Gia thue</p>
        <p className={`tag ${isRented ? "rented" : "available"}`}>
          {isRented ? "Da thue" : "Co the lien he"}
        </p>
      </div>

      <div className="row-2">
        <div className="sum-price">
          <p className="sum-price-end">
            <sup>d</sup>
            {formatMoney(displayPrice)}/ {locationDetail?.locationPriceUnit}
          </p>
        </div>

        <div className="detail-price">
          <div className="detail-price-rent">
            <p className="detail-price-label">Gia thue</p>
            <p className="detail-price-value">
              <sup>d</sup>
              {formatMoney(displayPrice)}/ {locationDetail?.locationPriceUnit}
            </p>
          </div>

          {locationDetail?.minTime && locationDetail?.maxTime && (
            <div className="detail-price-time">
              <p className="detail-price-label">Thoi gian thue</p>
              <p className="detail-price-value">
                {locationDetail.minTime} - {locationDetail.maxTime}
              </p>
            </div>
          )}
        </div>

        <Button
          type="primary"
          block
          icon={<MessageOutlined />}
          disabled={isRented || !locationDetail?.ownerCode}
          onClick={() =>
            onContactOwner(
              locationDetail?.ownerCode ?? "",
              MessageTypeEnum.RENT,
              locationDetail?.locationCode,
            )
          }
        >
          Nhan chu phong
        </Button>
      </div>
    </div>
  );
};
