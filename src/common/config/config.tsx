import { createSearchParams, Link } from "react-router-dom";
import { ROUTER_PATH } from "../../router/Route";
import type { ProfileItem } from "../types/profile";
import location from "../../assets/images/profile/icn_location.svg";
import logout from "../../assets/images/profile/icn_logout.svg";
import profile from "../../assets/images/profile/icn_profile.svg";
import down from "../../assets/svg/icn-down_single.svg";

export const items = [
  {
    key: 1,
    label: <Link to={ROUTER_PATH.HOME}>Trang chủ</Link>,
  },
  {
    key: 2,
    label: (
      <span>
        Cho thuê <img src={down} alt="Logo" />
      </span>
    ),
    children: [
      {
        key: 21,
        value: "motel",
        label: (
          <Link
            to={{
              pathname: ROUTER_PATH.RENT,
              search: `?${createSearchParams({ rent: "motel", page: "1" }).toString()}`,
            }}
          >
            Phòng trọ
          </Link>
        ),
      },
      {
        key: 22,
        value: "apartment",
        label: (
          <Link
            to={{
              pathname: ROUTER_PATH.RENT,
              search: `?${createSearchParams({ rent: "apartment", page: "1" }).toString()}`,
            }}
          >
            Căn hộ
          </Link>
        ),
      },
      {
        key: 23,
        value: "office",
        label: (
          <Link
            to={{
              pathname: ROUTER_PATH.RENT,
              search: `?${createSearchParams({ rent: "office", page: "1" }).toString()}`,
            }}
          >
            Văn phòng
          </Link>
        ),
      },
      {
        key: 24,
        value: "full-house",
        label: (
          <Link
            to={{
              pathname: ROUTER_PATH.RENT,
              search: `?${createSearchParams({ rent: "full-house", page: "1" }).toString()}`,
            }}
          >
            Nhà nguyên căn
          </Link>
        ),
      },
      {
        key: 25,
        value: "venue",
        label: (
          <Link
            to={{
              pathname: ROUTER_PATH.RENT,
              search: `?${createSearchParams({ rent: "venue", page: "1" }).toString()}`,
            }}
          >
            Địa điểm tổ chức sự kiện
          </Link>
        ),
      },
    ],
  },
  {
    key: 3,
    label: (
      <span>
        Khu vực <img src={down} alt="Logo" />
      </span>
    ),
    children: [
      {
        key: 31,
        value: "north",
        label: (
          <Link
            to={{
              pathname: ROUTER_PATH.LOCATION,
              search: `?${createSearchParams({ location: "north", page: "1" }).toString()}`,
            }}
          >
            Miền Bắc
          </Link>
        ),
      },
      {
        key: 32,
        value: "central",
        label: (
          <Link
            to={{
              pathname: ROUTER_PATH.LOCATION,
              search: `?${createSearchParams({ location: "central", page: "1" }).toString()}`,
            }}
          >
            Miền Trung
          </Link>
        ),
      },
      {
        key: 33,
        value: "south",
        label: (
          <Link
            to={{
              pathname: ROUTER_PATH.LOCATION,
              search: `?${createSearchParams({ location: "south", page: "1" }).toString()}`,
            }}
          >
            Miền Nam
          </Link>
        ),
      },
      {
        key: 34,
        value: "west",
        label: (
          <Link
            to={{
              pathname: ROUTER_PATH.LOCATION,
              search: `?${createSearchParams({ location: "west", page: "1" }).toString()}`,
            }}
          >
            Miền Tây
          </Link>
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
      { key: 52, label: <Link to={ROUTER_PATH.DOCS}>Hướng dẫn</Link> },
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
    icon: logout,
    label: "Đăng xuất",
    href: ROUTER_PATH.HOME,
  },
];
