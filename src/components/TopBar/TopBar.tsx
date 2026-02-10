import { Col, Menu, Row } from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import background from "../../assets/images/auth/authBackGround.jpg";
import menu from "../../assets/svg/icn-menu.svg";
import { items, profileItems } from "../../common/config/config";
import { NOTI_SUCCESS, USER_ROLE } from "../../common/constants/constants";
import type { ProfileItem } from "../../common/types/profile";
import { useNotification } from "../../providers/notificationProvider";
import { ROUTER_PATH } from "../../router/Route";
import "./topbar.scss";

export const TopBar = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const userRole = localStorage.getItem("userRole");
  const [showProfile, setShowProfile] = useState<boolean>();

  const handleProfileClick = (data: ProfileItem) => {
    if (data.key === 3) {
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      showNotification("Đăng xuất thành công!", NOTI_SUCCESS);
      navigate(ROUTER_PATH.SIGN_IN);
    } else {
      navigate(data.href);
    }
    setShowProfile(!showProfile);
  };

  return (
    <div className="top__bar">
      <div className="left">
        <div className="top__bar-logo">
          <img src={background} alt="Logo" />
          <span className="title">Hostings</span>
        </div>

        <div className="top__bar-menu">
          <Menu
            mode="horizontal"
            items={items as any}
            className="top__bar-menu-list"
          />
        </div>
      </div>
      <div className="right">
        <div className="top__bar-host">
          <span>
            {Number(userRole) === USER_ROLE.OWNER ? (
              <Link to={ROUTER_PATH.PROFILE_LOCATION}>Địa điểm của tôi</Link>
            ) : (
              <Link to={ROUTER_PATH.RENTER}>Cho thuê địa điểm</Link>
            )}
          </span>
        </div>
        <div
          className="top__bar-account"
          onClick={() => {
            setShowProfile(!showProfile);
          }}
        >
          <img src={background} alt="" className="avartar" />
          <img src={menu} alt="" className="menu" />
        </div>

        {showProfile && (
          <div className="profile__dropdown">
            {profileItems.map((item: ProfileItem) => (
              <Row
                gutter={[16, 16]}
                className="profile__dropdown-item"
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
        )}
      </div>
    </div>
  );
};
