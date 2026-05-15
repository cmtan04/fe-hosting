import { Link } from "react-router-dom";
import { ROUTER_PATH } from "../../router/Route";
import type { ProfileItem } from "../types/profile";
import location from "../../assets/images/profile/icn_location.svg";
import logout from "../../assets/images/profile/icn_logout.svg";
import profile from "../../assets/images/profile/icn_profile.svg";
import down from "../../assets/svg/icn-down_single.svg";
import chat from "../../assets/svg/profile/chat.svg";
import payment from "../../assets/svg/profile/payment.svg";
import { LOCATION_TYPE, RENT_TYPE, TYPE_LOG_OUT } from "../constants/constants";

export const items = () => [
  {
    key: 1,
    label: <Link to={ROUTER_PATH.HOME}>Trang chủ</Link>,
  },
  {
    key: 3,
    label: <span>Khu vực</span>,
    children: [
      {
        key: 31,
        value: LOCATION_TYPE.NORTH,
        label: (
          <Link to={`${ROUTER_PATH.LOCATIONS}?region=north`}>Miền Bắc</Link>
        ),
      },
      {
        key: 32,
        value: LOCATION_TYPE.CENTRAL,
        label: (
          <Link to={`${ROUTER_PATH.LOCATIONS}?region=central`}>Miền Trung</Link>
        ),
      },
      {
        key: 33,
        value: LOCATION_TYPE.SOUTH,
        label: (
          <Link to={`${ROUTER_PATH.LOCATIONS}?region=south`}>Miền Nam</Link>
        ),
      },
    ],
  },
  {
    key: 4,
    label: <Link to={ROUTER_PATH.MAP}>Bản đồ</Link>,
  },
  {
    key: 5,
    label: <span>Hỗ trợ</span>,
    children: [
      {
        key: 51,
        label: <Link to={ROUTER_PATH.SUPPORT}>Nhắn tin với Bookings</Link>,
      },
      {
        key: 52,
        label: <Link to={ROUTER_PATH.DOCS}>Hướng dẫn</Link>,
      },
    ],
  },
];

export const profileItems: ProfileItem[] = [
  {
    key: 1,
    icon: profile,
    label: "Thông tin cá nhân",
    href: ROUTER_PATH.PROFILE_INFORMATION,
  },
  {
    key: 2,
    icon: location,
    label: "Địa điểm của tôi",
    href: ROUTER_PATH.PROFILE_LOCATION,
  },
  {
    key: 3,
    icon: chat,
    label: "Đoạn chat",
    href: ROUTER_PATH.PROFILE_CHAT,
  },
  {
    key: 4,
    icon: payment,
    label: "Gói đăng tin",
    href: ROUTER_PATH.PROFILE_OWNER_PACKAGE,
  },
  {
    key: TYPE_LOG_OUT,
    icon: logout,
    label: "Đăng xuất",
    href: ROUTER_PATH.HOME,
  },
];
