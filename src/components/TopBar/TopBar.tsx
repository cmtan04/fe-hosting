import { Menu, type MenuProps } from "antd";
import { useNavigate } from "react-router-dom";
import background from "../../assets/images/auth/authBackGround.jpg";
import down from "../../assets/svg/icn-down_single.svg";
import menu from "../../assets/svg/icn-menu.svg";
import { childrenPath } from "../../common/contexts/helper";
import { ROUTER_PATH } from "../../router/Route";
import "./topbar.scss";

export const TopBar = () => {
  const navigate = useNavigate();

  const items: MenuProps["items"] = [
    {
      key: ROUTER_PATH.HOME_PAGE,
      label: "Trang chủ",
    },
    {
      key: ROUTER_PATH.RENT,
      label: (
        <span>
          Cho thuê <img src={down} alt="Logo" />
        </span>
      ),
      children: [
        { key: childrenPath(ROUTER_PATH.RENT, "room"), label: "Phòng trọ" },
        { key: childrenPath(ROUTER_PATH.RENT, "room"), label: "Căn hộ" },
        { key: childrenPath(ROUTER_PATH.RENT, "room"), label: "Văn phòng" },
        {
          key: childrenPath(ROUTER_PATH.RENT, "room"),
          label: "Nhà nguyên căn",
        },
        {
          key: childrenPath(ROUTER_PATH.RENT, "room"),
          label: "Địa điểm tổ chức",
        },
      ],
    },
    {
      key: ROUTER_PATH.LOCATION,
      label: (
        <span>
          Khu vực <img src={down} alt="Logo" />
        </span>
      ),
      children: [
        {
          key: childrenPath(ROUTER_PATH.LOCATION, "north"),
          label: "Miền Bắc",
        },
        {
          key: childrenPath(ROUTER_PATH.LOCATION, "middle"),
          label: "Miền Trung",
        },
        { key: childrenPath(ROUTER_PATH.LOCATION, "south"), label: "Miền Nam" },
        { key: childrenPath(ROUTER_PATH.LOCATION, "easth"), label: "Miền Tây" },
      ],
    },
    {
      key: ROUTER_PATH.MAP,
      label: "Bản đồ",
    },
    {
      key: ROUTER_PATH.SUPPORT,
      label: (
        <span>
          Hỗ trợ <img src={down} alt="Logo" />
        </span>
      ),
      children: [
        { key: ROUTER_PATH.SUPPORT, label: "Nhắn tin với Bookings" },
        { key: ROUTER_PATH.DOCS, label: "Hướng dẫn" },
      ],
    },
  ];

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    navigate(e.key);
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
            items={items}
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
