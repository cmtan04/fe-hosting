import { Col, Row } from "antd";
import barLeft from "../../../../assets/svg/icn-bar-left.svg";
import { profileItems } from "../../../../common/config/config";
import type { ProfileItem } from "../../../../common/types/profile";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../../../providers/notificationProvider";
import { NOTI_SUCCESS } from "../../../../common/constants/constants";
import { ROUTER_PATH } from "../../../../router/Route";
import "./style.scss";
import { useState } from "react";

export const ProfileSideBar = () => {
  const [tabActive, setTabActive] = useState<number>();
  const [colaspe, setColaspe] = useState<boolean>();
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const handleProfileClick = (data: ProfileItem) => {
    if (data.key === 3) {
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      showNotification("Đăng xuất thành công!", NOTI_SUCCESS);
      navigate(ROUTER_PATH.SIGN_IN);
    } else {
      setTabActive(data.key);
      navigate(data.href);
    }
  };
  return (
    <div className={`profile__sideBar ${colaspe && "colaspe"}`}>
      <div className="profile__sideBar-header">
        <img src={barLeft} alt="Close" onClick={() => setColaspe(!colaspe)} />
      </div>
      <div className="profile__sideBar-body">
        {profileItems.map((item: ProfileItem) => (
          <Row
            gutter={[16, 16]}
            className={`profile__sideBar-body-item ${tabActive === item.key && "active"}`}
            onClick={() => handleProfileClick(item)}
          >
            <Col span={4}>
              <img src={item.icon} alt={item.label} />
            </Col>
            <Col span={20}>
              <p>{item.label}</p>
            </Col>
          </Row>
        ))}
      </div>
    </div>
  );
};
