import { DownOutlined } from "@ant-design/icons";
import { Menu, type MenuProps } from "antd";
import { useNavigate } from "react-router-dom";
import menu from "../../assets/svg/icn-menu.svg";
import background from "../../assets/images/auth/authBackGround.jpg";
import "./topbar.scss";

export const TopBar = () => {
  const navigate = useNavigate();

  const items: MenuProps["items"] = [
    {
      key: "/home",
      label: "Trang chủ",
    },
    {
      key: "/rent",
      label: (
        <span>
          Cho thuê <DownOutlined />
        </span>
      ),
      children: [
        { key: "/rent/room", label: "Phòng trọ" },
        { key: "/rent/apartment", label: "Căn hộ" },
        { key: "/rent/office", label: "Văn phòng" },
        { key: "/rent/house", label: "Nhà nguyên căn" },
        { key: "/rent/location", label: "Địa điểm tổ chức" },
      ],
    },
    {
      key: "/location",
      label: (
        <span>
          Khu vực <DownOutlined />
        </span>
      ),
      children: [
        { key: "/location/hcm", label: "TP. Hồ Chí Minh" },
        { key: "/location/hn", label: "Hà Nội" },
        { key: "/location/dn", label: "Đà Nẵng" },
        { key: "/location/bd", label: "Bình Dương" },
      ],
    },
    {
      key: "/map",
      label: "Bản đồ",
    },
    {
      key: "/support",
      label: "Hỗ trợ",
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
