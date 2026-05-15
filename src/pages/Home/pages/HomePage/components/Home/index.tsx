import {Row, Col } from "antd";
import Lottie from "lottie-react";
import homeMap1 from "@assets/svg/home-map-1.svg";
import homeMap2 from "@assets/svg/home-map-2.svg";
import homeMap3 from "@assets/svg/home-map-3.svg";
import { supportSteps } from "../../utils/homePage.constants";
import "./home.scss";

export const Home = () => {
  return (
    <div className="home_page">
      <div className="home_page-row-3">
        <div className="row__content">
          <h1 className="row__content-title">
            Khám phá các không gian theo vị trí của bạn.
          </h1>
          <p className="row__content-description">
            Xem phòng trọ, căn hộ, văn phòng cho thuê trực tiếp trên bản đồ, so
            sánh khoảng cách và giá thuê dễ dàng.
          </p>
        </div>
        <div className="row__description">
          <img src={homeMap1} alt="" className="map1" />
          <img src={homeMap2} alt="" className="map2" />
          <img src={homeMap3} alt="" className="map3" />
        </div>
      </div>
      <div className="home_page-row-5">
        <div className="row__content">
          <h1 className="row__content-title">Hỗ trợ & Đồng hành cùng bạn</h1>
        </div>
        <div className="row__action">
          <div className="row__action-left">
            <p className="row__content-description">
              Đội ngũ hỗ trợ luôn sẵn sàng giải đáp thắc mắc và hỗ trợ bạn trong
              suốt quá trình sử dụng.
            </p>
          </div>
        </div>
        <Row gutter={[16, 16]} justify={"center"} className="row__description">
          {supportSteps.map((step) => (
            <Col xs={24} md={12} lg={6} key={step.id}>
              <div className="row__description-item">
                <Lottie className="lottie-icon" animationData={step.icon} />
                <div className="div">
                  <h3 className="row__description-title">{step.title}</h3>
                  <p className="row__description-description">
                    {step.description}
                  </p>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};
