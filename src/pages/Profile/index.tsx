import { Col, Row } from "antd";
import { Outlet } from "react-router-dom";
import "./style.scss";
import { TopBar } from "@components/TopBar/TopBar";

export const Profile = () => {
  return (
    <Row className="profile">
      <div className="profile__top">
        <TopBar />
      </div>
      <Row className="profile__body">
        <Col xs={24} md={18} className="profile__body-content">
          <Outlet />
        </Col>
      </Row>
    </Row>
  );
};
