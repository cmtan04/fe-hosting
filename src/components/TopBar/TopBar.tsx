import { Button, Menu, MenuProps } from "antd";
import { DashOutlined, DownOutlined } from "@ant-design/icons";
import bgLogin from "../../assets/bg-login.jpg";
import { FormSearch } from "../FormSearch/formSearch";
import "./topbar.scss";

interface TopBarProps {
  onSearchSubmit: (value: any) => void;
}

export const TopBar = (props: TopBarProps) => {
  const items: MenuProps["items"] = [
    {
      key: "phimle",
      label: "Phim lẻ",
    },
    {
      key: "phimbo",
      label: "Phim bộ",
    },
    {
      key: "theloai",
      label: (
        <span>
          Thể loại <DownOutlined />
        </span>
      ),
      children: [
        {
          key: "hanh-dong",
          label: "Hành động",
        },
        {
          key: "tinh-cam",
          label: "Tình cảm",
        },
        {
          key: "hai-huoc",
          label: "Hài hước",
        },
        {
          key: "kinh-di",
          label: "Kinh dị",
        },
        {
          key: "vien-tuong",
          label: "Viễn tưởng",
        },
        {
          key: "tam-ly",
          label: "Tâm lý",
        },
        {
          key: "hinh-su",
          label: "Hình sự",
        },
        {
          key: "phieu-luu",
          label: "Phiêu lưu",
        },
      ],
    },
    {
      key: "quocgia",
      label: (
        <span>
          Quốc gia <DownOutlined />
        </span>
      ),
      children: [
        {
          key: "viet-nam",
          label: "Việt Nam",
        },
        {
          key: "han-quoc",
          label: "Hàn Quốc",
        },
        {
          key: "trung-quoc",
          label: "Trung Quốc",
        },
        {
          key: "nhat-ban",
          label: "Nhật Bản",
        },
        {
          key: "thai-lan",
          label: "Thái Lan",
        },
        {
          key: "my",
          label: "Mỹ",
        },
        {
          key: "anh",
          label: "Anh",
        },
        {
          key: "phap",
          label: "Pháp",
        },
      ],
    },
    {
      key: "them",
      label: (
        <span>
          <DashOutlined />
        </span>
      ),
      children: [
        {
          key: "phim-chieu-rap",
          label: "Phim chiếu rạp",
        },
        {
          key: "phim-sap-chieu",
          label: "Phim sắp chiếu",
        },
        {
          key: "top-phim",
          label: "Top phim",
        },
        {
          key: "phim-de-cu",
          label: "Phim đề cử",
        },
      ],
    },
  ];

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    console.log("Menu clicked:", e.key);
  };

  return (
    <div className="top__bar">
      <div className="left">
        <div className="top__bar-logo">
          <img src={bgLogin} alt="Logo" />
        </div>

        <div className="top__bar-search">
          <FormSearch
            label=""
            name="search"
            allowClear
            onSearch={(value) => {
              props.onSearchSubmit(value);
            }}
            placeholder="Tìm kiếm phim, diễn viên"
          />
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
        <div className="top__bar-account">
          <Button className="label">Thành viên</Button>
        </div>
      </div>
    </div>
  );
};
