import { Menu } from "antd";
import { createSearchParams, Link } from "react-router-dom";
import background from "../../assets/images/auth/authBackGround.jpg";
import down from "../../assets/svg/icn-down_single.svg";
import menu from "../../assets/svg/icn-menu.svg";
import { USER_ROLE } from "../../common/constants/constants";
import { ROUTER_PATH } from "../../router/Route";
import "./topbar.scss";
import { useState } from "react";

export const TopBar = () => {
  // const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState<boolean>();

  const userRole = localStorage.getItem("userRole");

  const items = [
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

  const profileItems = [
    { key: 1, icon: "", label: "Thông tin cá nhân", href: ROUTER_PATH.HOME },
  ];

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
            items={items as any}
            className="top__bar-menu-list"
          />
        </div>
      </div>
      <div className="right">
        <div className="top__bar-host">
          <span>
            {Number(userRole) === USER_ROLE.OWNER ? (
              <Link to={ROUTER_PATH.RENTER}>Địa điểm của tôi</Link>
            ) : (
              <Link to={ROUTER_PATH.RENTER}>Cho thuê địa điểm</Link>
            )}
          </span>
        </div>
        <div
          className="top__bar-account"
          onClick={() => {
            setShowProfile(!showProfile);
          }}
        >
          <img src={background} alt="" className="avartar" />
          <img src={menu} alt="" className="menu" />
        </div>

        {showProfile && <div className="profile__dropdown"></div>}
      </div>
    </div>
  );
};
