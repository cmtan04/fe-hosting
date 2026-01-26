import { Menu, type MenuProps } from "antd";
import { href, useNavigate } from "react-router-dom";
import background from "../../assets/images/auth/authBackGround.jpg";
import down from "../../assets/svg/icn-down_single.svg";
import menu from "../../assets/svg/icn-menu.svg";
import { childrenPath } from "../../common/contexts/helper";
import { ROUTER_PATH } from "../../router/Route";
import "./topbar.scss";

export const TopBar = () => {
  const navigate = useNavigate();

  const items = [
    {
      key: 1,
      href: ROUTER_PATH.HOME,
      label: "Trang chủ",
    },
    {
      key: 2,
      href: ROUTER_PATH.RENT,
      label: (
        <span>
          Cho thuê <img src={down} alt="Logo" />
        </span>
      ),
      children: [
        {
          key: 21,
          href: childrenPath(ROUTER_PATH.RENT, "room"),
          label: "Phòng trọ",
        },
        {
          key: 22,
          href: childrenPath(ROUTER_PATH.RENT, "room"),
          label: "Căn hộ",
        },
        {
          key: 23,
          href: childrenPath(ROUTER_PATH.RENT, "room"),
          label: "Văn phòng",
        },
        {
          key: 24,
          href: childrenPath(ROUTER_PATH.RENT, "room"),
          label: "Nhà nguyên căn",
        },
        {
          key: 25,
          href: childrenPath(ROUTER_PATH.RENT, "room"),
          label: "Địa điểm tổ chức",
        },
      ],
    },
    {
      key: 3,
      href: ROUTER_PATH.LOCATION,
      label: (
        <span>
          Khu vực <img src={down} alt="Logo" />
        </span>
      ),
      children: [
        {
          key: 31,
          href: childrenPath(ROUTER_PATH.LOCATION, "north"),
          label: "Miền Bắc",
        },
        {
          key: 32,
          href: childrenPath(ROUTER_PATH.LOCATION, "middle"),
          label: "Miền Trung",
        },
        {
          key: 33,
          href: childrenPath(ROUTER_PATH.LOCATION, "south"),
          label: "Miền Nam",
        },
        {
          key: 34,
          href: childrenPath(ROUTER_PATH.LOCATION, "easth"),
          label: "Miền Tây",
        },
      ],
    },
    {
      key: 4,
      href: ROUTER_PATH.MAP,
      label: "Bản đồ",
    },
    {
      key: 5,
      href: ROUTER_PATH.SUPPORT,
      label: <span>Hỗ trợ</span>,
      children: [
        { key: 51, href: ROUTER_PATH.SUPPORT, label: "Nhắn tin với Bookings" },
        { key: 52, href: ROUTER_PATH.DOCS, label: "Hướng dẫn" },
      ],
    },
  ];

  const handleMenuClick = (e: any) => {
    navigate(e.href);
  };

  const handleMyLocationClick = () => {};

  return (
    <div className="top__bar">
      <div className="left">
        <div className="top__bar-logo">
          <img src={background} alt="Logo" />
          <span className="title">Hostings</span>
        </div>

        <div className="top__bar-menu">
          <Menu
            onClick={handleMenuClick}
            mode="horizontal"
            items={items as any}
            className="top__bar-menu-list"
          />
        </div>
      </div>
      <div className="right">
        <div className="top__bar-host" onClick={() => handleMyLocationClick()}>
          <span>Địa điểm của tôi</span>
        </div>
        <div className="top__bar-account">
          <img src={background} alt="" className="avartar" />
          <img src={menu} alt="" className="menu" />
        </div>
      </div>
    </div>
  );
};
