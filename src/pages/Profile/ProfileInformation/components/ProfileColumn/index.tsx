import { Col, Button } from "antd";
import locationIcon from "@assets/images/profile/icn_location.svg";
import mailIcon from "@assets/svg/profile/mail.svg";
import phoneIcon from "@assets/svg/profile/phone.svg";
import type { UserProfileResponseDto } from "@api/dtos/user.dto";
import "./style.scss";

interface ProfileColumnProps {
  user: UserProfileResponseDto | null;
  onClick: () => void;
}

export const ProfileColumn = ({ user, onClick }: ProfileColumnProps) => {
  return (
    <div className="column">
      <h2 style={{ marginTop: "0px" }}>Giới thiệu</h2>
      <p className="subtitle">{user?.bio}</p>
      <div className="meta">
        <p className="meta-item">
          <img className="icon" src={locationIcon} alt="" />
          {user?.fullAddress || "Chưa cập nhật địa chỉ"}
        </p>
        <p className="meta-item">
          <img className="icon" src={mailIcon} alt="" />
          {user?.email || "Chưa cập nhật email"}
        </p>
        <p className="meta-item">
          <img className="icon" src={phoneIcon} alt="" />
          {user?.phone || "Chưa cập nhật số điện thoại"}
        </p>
      </div>
      <Button type="primary" size="large" onClick={onClick}>
        Cập nhật thông tin
      </Button>
    </div>
  );
};
