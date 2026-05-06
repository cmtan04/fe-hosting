import { Button } from "antd";
import type { LocationDto } from "@/api/dtos/location.dto";
import address from "@/assets/images/address.svg";
import mail from "@/assets/images/mail.svg";
import phone from "@/assets/images/phone.svg";
import profileIcn from "@/assets/images/profile/icn_profile.svg";
import message from "@/assets/svg/profile/chat.svg";
import { MessageTypeEnum } from "@/common/constants/constants";
import "./style.scss";

interface LocationOwnerProps {
  locationDetail?: LocationDto;
  onContactOwner: (toUserCd: string, type: string, locationCd?: string) => void;
}

export const LocationOwner = ({
  locationDetail,
  onContactOwner,
}: LocationOwnerProps) => {
  return (
    <div className="location-owner">
      <img src={locationDetail?.ownerAvatar || ""} alt="Owner" />
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
