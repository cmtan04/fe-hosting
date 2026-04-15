import { Col, Menu, Row } from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import background from "../../assets/images/auth/authBackGround.jpg";
import menu from "../../assets/svg/icn-menu.svg";
import { items, profileItems } from "../../common/config/config";
import {
  NOTI_SUCCESS,
  TYPE_LOG_OUT,
  USER_ROLE,
} from "../../common/constants/constants";
import type { ProfileItem } from "../../common/types/profile";
import { useAuth } from "../../common/contexts/authContext";
import { useNotification } from "../../providers/notificationProvider";
import { ROUTER_PATH } from "../../router/Route";
import "./topbar.scss";

export const TopBar = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { userRole, signOut, isAuthenticated } = useAuth();
  const [showProfile, setShowProfile] = useState<boolean>(false);

  const handleProfileClick = (data: ProfileItem) => {
    if (data.key === TYPE_LOG_OUT) {
      signOut();
      showNotification("Đăng xuất thành công!", NOTI_SUCCESS);
      navigate(ROUTER_PATH.HOME);
    } else {
      navigate(data.href);
    }
    setShowProfile(false);
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
            items={items()}
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
        {isAuthenticated ? (
          <>
            <button
              type="button"
              className="top__bar-account"
              onClick={() => {
                setShowProfile((prev) => !prev);
              }}
            >
              <img src={background} alt="" className="avartar" />
              <img src={menu} alt="" className="menu" />
            </button>

            {showProfile && (
              <div className="profile__dropdown">
                {profileItems.map((item: ProfileItem) => (
                  <Row
                    key={item.key}
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
          </>
        ) : (
          <div className="top__bar-guest">
            <Link className="guest-signup" to={ROUTER_PATH.SIGN_UP}>
              Đăng ký
            </Link>
            <Link className="guest-login" to={ROUTER_PATH.SIGN_IN}>
              Đăng nhập
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
