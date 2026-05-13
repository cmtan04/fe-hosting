import {
  Avatar,
  Button,
  Col,
  Divider,
  Drawer,
  List,
  Menu,
  Row,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import background from "@assets/images/auth/authBackGround.jpg";
import menu from "@assets/svg/icn-menu.svg";
import defaultAvatar from "@assets/images/profile/default_avt.png";
import { items, profileItems } from "@common/config/config";
import {
  NOTI_SUCCESS,
  TYPE_LOG_OUT,
  USER_ROLE,
} from "@common/constants/constants";
import type { ProfileItem } from "@common/types/profile";
import { useAuth } from "@common/contexts/authContext";
import { useNotification } from "@providers/notificationProvider";
import { ROUTER_PATH } from "@router/Route";
import { useRequireLoginAction } from "@common/hooks/useRequireLoginAction";
import "./topbar.scss";

export const TopBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showNotification } = useNotification();
  const { userRole, signOut, isAuthenticated, user } = useAuth();
  const { requireLoginAction } = useRequireLoginAction();
  const [showProfile, setShowProfile] = useState<boolean>(false);
  const [menuDrawerOpen, setMenuDrawerOpen] = useState<boolean>(false);
  const [actionsDrawerOpen, setActionsDrawerOpen] = useState<boolean>(false);
  const avatarSrc = user?.avatarUrl || defaultAvatar;

  const closeMobileDrawers = () => {
    setMenuDrawerOpen(false);
    setActionsDrawerOpen(false);
    setShowProfile(false);
  };

  useEffect(() => {
    closeMobileDrawers();
  }, [location.pathname]);

  const openMenuDrawer = () => {
    setMenuDrawerOpen(true);
    setActionsDrawerOpen(false);
    setShowProfile(false);
  };

  const openActionsDrawer = () => {
    setActionsDrawerOpen(true);
    setMenuDrawerOpen(false);
    setShowProfile(false);
  };

  const handleProfileClick = (data: ProfileItem) => {
    if (data.key === TYPE_LOG_OUT) {
      signOut();
      showNotification("Đăng xuất thành công!", NOTI_SUCCESS);
      navigate(ROUTER_PATH.HOME);
    } else {
      navigate(data.href);
    }
    closeMobileDrawers();
  };

  const handleDrawerClose = () => {
    closeMobileDrawers();
  };

  // Close drawer on route change
  const handleNavClick = () => {
    closeMobileDrawers();
  };

  // ─── Render: Actions (Cho thuê / Login / Profile) ───
  const renderActions = () => {
    return (
      <>
        <div className="top__bar-host">
          {isAuthenticated ? (
            <span>
              {Number(userRole) === USER_ROLE.OWNER ? (
                <Link
                  to={ROUTER_PATH.PROFILE_LOCATION}
                  onClick={handleNavClick}
                >
                  Địa điểm của tôi
                </Link>
              ) : (
                <Link to={ROUTER_PATH.RENTER} onClick={handleNavClick}>
                  Cho thuê địa điểm
                </Link>
              )}
            </span>
          ) : (
            <button
              type="button"
              className="top__bar-host-action"
              onClick={() => {
                handleNavClick();
                requireLoginAction(() => {}, {
                  title: "Đăng nhập để sử dụng tính năng này",
                  message: "Bạn cần đăng nhập để tiếp tục thao tác này.",
                  signInState: {
                    redirectTo: ROUTER_PATH.RENTER,
                    source: "topbar-renter-cta",
                  },
                });
              }}
            >
              Cho thuê địa điểm
            </button>
          )}
        </div>

        {isAuthenticated ? (
          <div className="topbar__profile-section">
            <button
              type="button"
              className="top__bar-account"
              onClick={() => setShowProfile((prev) => !prev)}
            >
              <img src={avatarSrc} alt="" className="avartar" />
              <img src={menu} alt="" className="menu" />
            </button>

            {showProfile && (
              <div className="profile__dropdown">
                {profileItems.map((item: ProfileItem) => (
                  <button
                    type="button"
                    key={item.key}
                    className="profile__dropdown-item"
                    onClick={() => handleProfileClick(item)}
                  >
                    <div className="profile__dropdown-item-icon">
                      <img src={item.icon} alt={item.label} />
                    </div>
                    <div className="profile__dropdown-item-label">
                      <p>{item.label}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="top__bar-guest">
            <Link
              className="guest-login"
              to={ROUTER_PATH.SIGN_IN}
              onClick={handleNavClick}
            >
              Đăng nhập
            </Link>
            <Link
              className="guest-signup"
              to={ROUTER_PATH.SIGN_UP}
              onClick={handleNavClick}
            >
              Đăng ký
            </Link>
          </div>
        )}
      </>
    );
  };

  const renderMobileActions = () => {
    const profileActionItems = isAuthenticated ? [...profileItems] : [];

    return (
      <div className="topbar__drawer-actions-list">
        <div className="topbar__drawer-actions-group">
          {isAuthenticated ? (
            <Button
              block
              type="text"
              className="topbar__drawer-action-row"
              onClick={handleNavClick}
            >
              {Number(userRole) === USER_ROLE.OWNER
                ? "Địa điểm của tôi"
                : "Cho thuê địa điểm"}
            </Button>
          ) : (
            <Button
              block
              type="text"
              className="topbar__drawer-action-row"
              onClick={() => {
                handleNavClick();
                requireLoginAction(() => {}, {
                  title: "Đăng nhập để sử dụng tính năng này",
                  message: "Bạn cần đăng nhập để tiếp tục thao tác này.",
                  signInState: {
                    redirectTo: ROUTER_PATH.RENTER,
                    source: "topbar-renter-cta",
                  },
                });
              }}
            >
              Cho thuê địa điểm
            </Button>
          )}
        </div>

        {isAuthenticated ? (
          <div className="topbar__drawer-actions-group">
            <List
              split={false}
              dataSource={profileActionItems}
              renderItem={(item: ProfileItem) => (
                <List.Item className="topbar__drawer-action-item">
                  <Button
                    block
                    type="text"
                    className="topbar__drawer-action-row"
                    onClick={() => handleProfileClick(item)}
                  >
                    <Avatar
                      size={22}
                      shape="square"
                      src={item.icon}
                      className="topbar__drawer-action-row-icon"
                    />
                    <span className="topbar__drawer-action-row-label">
                      {item.label}
                    </span>
                  </Button>
                </List.Item>
              )}
            />
          </div>
        ) : (
          <div className="topbar__drawer-actions-group">
            <List
              split={false}
              dataSource={[
                {
                  key: "sign-in",
                  label: "Đăng nhập",
                  onClick: () => navigate(ROUTER_PATH.SIGN_IN),
                },
                {
                  key: "sign-up",
                  label: "Đăng ký",
                  onClick: () => navigate(ROUTER_PATH.SIGN_UP),
                },
              ]}
              renderItem={(item) => (
                <List.Item className="topbar__drawer-action-item">
                  <Button
                    type={item.key === "sign-up" ? "default" : "primary"}
                    className="topbar__drawer-action-row"
                    onClick={() => {
                      handleNavClick();
                      item.onClick();
                    }}
                  >
                    {item.label}
                  </Button>
                </List.Item>
              )}
            />
          </div>
        )}
      </div>
    );
  };

  const renderMobileDrawerHeader = (title: string) => (
    <div className="topbar__drawer-header">
      <div className="top__bar-logo">
        <img src={background} alt="Logo" />
        <span className="title">Hostings</span>
      </div>
      <button
        type="button"
        className="topbar__drawer-close"
        onClick={handleDrawerClose}
        aria-label="Đóng menu"
      >
        ✕
      </button>
    </div>
  );

  return (
    <div className="top__bar">
      <Row
        className="top__bar-desktop"
        align="middle"
        justify="space-between"
        wrap={false}
      >
        <Col className="left">
          <Link to={ROUTER_PATH.HOME} className="top__bar-logo">
            <img src={background} alt="Logo" />
            <span className="title">Hostings</span>
          </Link>

          <div className="top__bar-menu">
            <Menu
              mode="horizontal"
              items={items()}
              className="top__bar-menu-list"
              disabledOverflow
            />
          </div>
        </Col>

        <Col className="right">{renderActions()}</Col>
      </Row>

      <Row
        className="top__bar-mobile"
        align="middle"
        justify="space-between"
        wrap={false}
      >
        <Col className="top__bar-mobile-left">
          <button
            type="button"
            className="topbar__hamburger"
            onClick={openMenuDrawer}
            aria-label="Mở menu"
          >
            <span className={`hamburger-icon ${menuDrawerOpen ? "open" : ""}`}>
              <span />
              <span />
              <span />
            </span>
          </button>
        </Col>

        <Col className="top__bar-mobile-center">
          <Link
            to={ROUTER_PATH.HOME}
            className="top__bar-logo top__bar-logo--mobile"
          >
            <img src={background} alt="Logo" />
            <span className="title">Hostings</span>
          </Link>
        </Col>

        <Col className="top__bar-mobile-right">
          <Button
            type="text"
            className="topbar__actions-trigger"
            onClick={openActionsDrawer}
            aria-label="Mở các hành động"
          >
            <img src={avatarSrc} alt="" className="actions-trigger-avatar" />
          </Button>
        </Col>
      </Row>

      <Drawer
        open={menuDrawerOpen}
        onClose={handleDrawerClose}
        placement="left"
        className="topbar__drawer topbar__drawer--menu"
        closable={false}
        width={"60%"}
        styles={{ body: { overflow: "hidden" } }}
      >
        {renderMobileDrawerHeader("Menu")}

        <div className="topbar__drawer-content topbar__drawer-content--menu">
          <Menu
            mode="inline"
            items={items()}
            className="topbar__drawer-menu"
            onClick={handleNavClick}
          />
        </div>
      </Drawer>

      <Drawer
        open={actionsDrawerOpen}
        onClose={handleDrawerClose}
        placement="right"
        className="topbar__drawer topbar__drawer--actions"
        closable={false}
        width={"60%"}
        styles={{ body: { overflow: "hidden" } }}
      >
        {renderMobileDrawerHeader("Tài khoản")}

        <div className="topbar__drawer-content topbar__drawer-content--actions">
          {renderMobileActions()}
        </div>
      </Drawer>
    </div>
  );
};
