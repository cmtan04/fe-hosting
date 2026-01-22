import "./homePage.scss";
import "../home.scss";
import section1Back from "../../../assets/images/home/home-background.png";
export const HomePage = () => {
  return (
    <div className="home_page">
      <div className="home_page-row-1">
        <img src={section1Back} alt="Logo" />
        <div className="row__content">
          <h1 className="row__content-title">
            Tìm không gian phù hợp cho mọi nhu cầu của bạn
          </h1>
          <p className="row__content-description">
            Nền tảng kết nối người thuê với hàng ngàn phòng trọ, căn hộ, văn
            phòng và địa điểm cho thuê trên toàn quốc. Tìm kiếm nhanh chóng theo
            khu vực, loại hình và mức giá, với thông tin rõ ràng và được cập
            nhật liên tục.
          </p>
        </div>
      </div>
    </div>
  );
};
