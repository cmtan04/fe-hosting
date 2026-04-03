import { Col, Row } from "antd";
import { Outlet } from "react-router-dom";
import "./style.scss";
import { ProfileSideBar } from "../components/ProfileSidebar";
import { TopBar } from "../../../components/TopBar/TopBar";

export const Profile = () => {
  return (
    <Row className="profile">
      <div className="profile__top">
        <TopBar />
      </div>
      <Row gutter={[16, 16]} className="profile__body">
        <Col span={6} className="profile__body-sidebar">
          <ProfileSideBar />
        </Col>
        <Col span={18} className="profile__body-content">
          <Outlet />
        </Col>
      </Row>
    </Row>
  );
};
