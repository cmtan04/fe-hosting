import { Menu, type MenuProps } from "antd";
import { Link, useNavigate, createSearchParams, href } from "react-router-dom";
import background from "../../assets/images/auth/authBackGround.jpg";
import down from "../../assets/svg/icn-down_single.svg";
import menu from "../../assets/svg/icn-menu.svg";
import { childrenPath } from "../../common/contexts/helper";
import { ROUTER_PATH } from "../../router/Route";
import "./topbar.scss";
// interface FilterProps {
//   pathname: string;
//   search?: any;
// }

// const buildPathWithSearch = ({ pathname, search }: FilterProps) => {
//   if (search) {
//     return `${pathname}?${createSearchParams(search)}`;
//   }
//   return pathname;
// };



export const TopBar = () => {
  const navigate = useNavigate();

  const items = [
    {
      key: 1,
      label: <Link to={ROUTER_PATH.HOME}>Trang chủ</Link>,
    },
    {
      key: 2,
      label: (
        <Link to={ROUTER_PATH.RENT}>
          Cho thuê <img src={down} alt="Logo" />
        </Link>
      ),
      children: [
        {
          key: 21,
          value: "motel",
          label: <Link to={{
            pathname: ROUTER_PATH.RENT,
            search: `?${createSearchParams({ rent: 'motel' }).toString()}`,
          }}>Phòng trọ</Link>
        },
        {
          key: 22,
          value: "apartment",
          label: <Link to={{
            pathname: ROUTER_PATH.RENT,
            search: `?${createSearchParams({ rent: 'apartment' }).toString()}`,
          }}>Căn hộ</Link>
        },
        {
          key: 23,
          value: "office",
          label: <Link to={{
            pathname: ROUTER_PATH.RENT,
            search: `?${createSearchParams({ rent: 'office' }).toString()}`,
          }}>Văn phòng</Link>
        },
        {
          key: 24,
          value: "full-house",
          label: <Link to={{
            pathname: ROUTER_PATH.RENT,
            search: `?${createSearchParams({ rent: 'full-house' }).toString()}`,
          }}>Nhà nguyên căn</Link>
        },
        {
          key: 25,
          value: "venue",
          label: <Link to={{
            pathname: ROUTER_PATH.RENT,
            search: `?${createSearchParams({ rent: 'venue' }).toString()}`,
          }}>Địa điểm tổ chức sự kiện</Link>
        },
      ],
    },
    {
      key: 3,
      label: (
        <Link to={ROUTER_PATH.LOCATION}>
          Khu vực <img src={down} alt="Logo" />
        </Link>
      ),
      children: [
        {
          key: 31,
          value: "north",
          label: <Link to={{
            pathname: ROUTER_PATH.LOCATION,
            search: `?${createSearchParams({ location: 'north' }).toString()}`,
          }}>Miền Bắc</Link>,
        },
        {
          key: 32,
          value: "central",
          label: <Link to={{
            pathname: ROUTER_PATH.LOCATION,
            search: `?${createSearchParams({ location: 'central' }).toString()}`,
          }}>Miền Trung</Link>,
        },
        {
          key: 33,
          value: "south",
          label: <Link to={{
            pathname: ROUTER_PATH.LOCATION,
            search: `?${createSearchParams({ location: 'south' }).toString()}`,
          }}>Miền Nam</Link>,
        },
        {
          key: 34,
          value: "west",
          label: <Link to={{
            pathname: ROUTER_PATH.LOCATION,
            search: `?${createSearchParams({ location: 'west' }).toString()}`,
          }}>Miền Tây</Link>,
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
        { key: 51, label: <Link to={ROUTER_PATH.SUPPORT}>Nhắn tin với Bookings</Link> },
        { key: 52, label: <Link to={ROUTER_PATH.DOCS}>Hướng dẫn</Link> },
      ],
    },
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
          <span><Link to={ROUTER_PATH.MYLOCATION}>Địa điểm của tôi</Link></span>
        </div>
        <div className="top__bar-account">
          <img src={background} alt="" className="avartar" />
          <img src={menu} alt="" className="menu" />
        </div>
      </div>
    </div>
  );
};
