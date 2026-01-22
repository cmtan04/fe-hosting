import { DownOutlined } from "@ant-design/icons";
import { Menu, type MenuProps } from "antd";
import { useNavigate } from "react-router-dom";
import menu from "../../assets/svg/icn-menu.svg";
import background from "../../assets/images/auth/authBackGround.jpg";
import "./topbar.scss";
import down from "../../assets/svg/icn-down_single.svg";

export const TopBar = () => {
  const navigate = useNavigate();

  const items: MenuProps["items"] = [
    {
      key: "/home",
      label: "Trang chủ",
    },
    {
      key: "/home/rent",
      label: (
        <span>
          Cho thuê <img src={down} alt="Logo" />
        </span>
      ),
      children: [
        { key: "/home/rent/room", label: "Phòng trọ" },
        { key: "/home/rent/apartment", label: "Căn hộ" },
        { key: "/home/rent/office", label: "Văn phòng" },
        { key: "/home/rent/house", label: "Nhà nguyên căn" },
        { key: "/home/rent/location", label: "Địa điểm tổ chức" },
      ],
    },
    {
      key: "/home/location",
      label: (
        <span>
          Khu vực <img src={down} alt="Logo" />
        </span>
      ),
      children: [
        { key: "/home/location/hcm", label: "TP. Hồ Chí Minh" },
        { key: "/home/location/hn", label: "Hà Nội" },
        { key: "/home/location/dn", label: "Đà Nẵng" },
        { key: "/home/location/bd", label: "Bình Dương" },
      ],
    },
    {
      key: "/map",
      label: "Bản đồ",
    },
    {
      key: "/support",
      label: (
        <span>
          Hỗ trợ <img src={down} alt="Logo" />
        </span>
      ),
      children: [
        { key: "/home/support/chat", label: "Nhắn tin với Bookings" },
        { key: "/home/support/docs", label: "Hướng dẫn" },
      ],
    },
  ];

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    navigate(e.key);
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
            onClick={handleMenuClick}
            mode="horizontal"
            items={items}
            className="top__bar-menu-list"
          />
        </div>
      </div>
      <div className="right">
        <div className="top__bar-host">
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
