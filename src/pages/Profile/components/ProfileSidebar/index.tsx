import {
  CreditCardOutlined,
  HomeOutlined,
  MessageOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTER_PATH } from "@router/Route";
import "./style.scss";

export const ProfileSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: ROUTER_PATH.PROFILE_INFORMATION,
      icon: <UserOutlined />,
      label: "Thong tin ca nhan",
    },
    {
      key: ROUTER_PATH.PROFILE_CHAT,
      icon: <MessageOutlined />,
      label: "Tin nhan",
    },
    {
      key: ROUTER_PATH.PROFILE_OWNER_PACKAGE,
      icon: <CreditCardOutlined />,
      label: "Goi dang tin",
    },
    {
      type: "divider" as const,
    },
    {
      key: ROUTER_PATH.RENTER,
      icon: <HomeOutlined />,
      label: "Kenh chu phong",
    },
  ];

  const handleMenuClick = (info: { key: string }) => {
    navigate(info.key);
  };

  return (
    <div className="profile-sidebar">
      <Menu
        mode="vertical"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={handleMenuClick}
        className="profile-menu"
      />
    </div>
  );
};
