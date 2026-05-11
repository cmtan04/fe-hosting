import { Drawer, Menu } from "antd";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
import { useMediaQuery } from "../../common/hooks/useMediaQuery";
import { useRequireLoginAction } from "../../common/hooks/useRequireLoginAction";
import "./topbar.scss";

export const TopBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showNotification } = useNotification();
  const { userRole, signOut, isAuthenticated } = useAuth();
  const { requireLoginAction } = useRequireLoginAction();
  const [showProfile, setShowProfile] = useState<boolean>(false);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  const isMobile = useMediaQuery("(max-width: 1024px)");

  const handleProfileClick = (data: ProfileItem) => {
    if (data.key === TYPE_LOG_OUT) {
      signOut();
      showNotification("Đăng xuất thành công!", NOTI_SUCCESS);
      navigate(ROUTER_PATH.HOME);
    } else {
      navigate(data.href);
    }
    setShowProfile(false);
    setDrawerOpen(false);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setShowProfile(false);
  };

  // Close drawer on route change
  const handleNavClick = () => {
    setDrawerOpen(false);
  };

  // ─── Render: Actions (Cho thuê / Login / Profile) ───
  const renderActions = () => (
    <>
      <div className="top__bar-host">
        {isAuthenticated ? (
          <span>
            {Number(userRole) === USER_ROLE.OWNER ? (
              <Link to={ROUTER_PATH.PROFILE_LOCATION} onClick={handleNavClick}>
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
            <img src={background} alt="" className="avartar" />
            <img src={menu} alt="" className="menu" />
          </button>

          {showProfile && (
            <div className="profile__dropdown">
              {profileItems.map((item: ProfileItem) => (
                <div
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
                </div>
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

  // ─── Render: Drawer content (mobile / tablet) ───
  const renderDrawerContent = () => (
    <div className="topbar__drawer-content">
      <Menu
        mode="inline"
        items={items()}
        className="topbar__drawer-menu"
        onClick={handleNavClick}
      />

      <div className="topbar__drawer-divider" />

      <div className="topbar__drawer-actions">{renderActions()}</div>
    </div>
  );

  return (
    <div className="top__bar">
      {/* ─── Left: Logo + Desktop Menu ─── */}
      <div className="left">
        <Link to={ROUTER_PATH.HOME} className="top__bar-logo">
          <img src={background} alt="Logo" />
          <span className="title">Hostings</span>
        </Link>

        {!isMobile && (
          <div className="top__bar-menu">
            <Menu
              mode="horizontal"
              items={items()}
              className="top__bar-menu-list"
              disabledOverflow
            />
          </div>
        )}
      </div>

      {/* ─── Right: Desktop Actions OR Hamburger ─── */}
      <div className="right">
        {isMobile ? (
          <button
            type="button"
            className="topbar__hamburger"
            onClick={() => setDrawerOpen(true)}
            aria-label="Menu"
          >
            <span className={`hamburger-icon ${drawerOpen ? "open" : ""}`}>
              <span />
              <span />
              <span />
            </span>
          </button>
        ) : (
          renderActions()
        )}
      </div>

      {/* ─── Mobile Drawer ─── */}
      {isMobile && (
        <Drawer
          open={drawerOpen}
          onClose={handleDrawerClose}
          placement="right"
          width={320}
          className="topbar__drawer"
          closable={false}
          styles={{ body: { padding: 0 } }}
        >
          {/* Drawer header */}
          <div className="topbar__drawer-header">
            <div className="topbar__drawer-logo">
              <img src={background} alt="Logo" />
              <span>Hostings</span>
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

          {renderDrawerContent()}
        </Drawer>
      )}
    </div>
  );
};
