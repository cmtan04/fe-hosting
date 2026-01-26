import { FormSearch } from "../../../components/FormSearch/formSearch";
import { type HomeCardProps } from "../../../components/HomeCard/HomeCard";
import { HomeCarousel } from "../../../components/HomeCarousel/HomeCarousel";
import "../home.scss";
import "./homePage.scss";
import homeMap1 from "../../../assets/svg/home/home_map1.svg";
import homeMap2 from "../../../assets/svg/home/home_map4.svg";
import homeMap3 from "../../../assets/svg/home/home_map3.svg";
import call from "../../../assets/lotties/home/call.json";
import docs from "../../../assets/lotties/home/docs.json";
import find from "../../../assets/lotties/home/find.json";
import search from "../../../assets/lotties/home/search.json";
import Lottie from "lottie-react";
export const HomePage = () => {
  const sampleHomes: HomeCardProps[] = [
    {
      imageUrl:
        "https://nhn.1cdn.vn/2023/02/06/ve-dep-thien-duong-trang-an.jpg",
      title: "Villa Hiện Đại",
      description: "Biệt thự sang trọng với thiết kế hiện đại",
      address: "123 Đường Lê Lợi, Quận 1, TP.HCM",
      rating: 4.5,
    },
    {
      imageUrl:
        "https://bazaarvietnam.vn/wp-content/uploads/2023/12/harper-bazaar-du-lich-gan-ha-noi-2-ngay-1-dem-5.jpeg",
      title: "Căn Hộ Penthouse",
      description: "Penthouse view đẹp, đầy đủ tiện nghi",
      address: "456 Đường Nguyễn Huệ, Quận 1, TP.HCM",
      rating: 5,
    },
    {
      imageUrl:
        "https://www.vietnambooking.com/wp-content/uploads/2019/07/cau-vang-ba-na-19072019-1.jpg",
      title: "Nhà Phố Cao Cấp",
      description: "Nhà phố 3 tầng, vị trí đắc địa",
      address: "789 Đường Hai Bà Trưng, Quận 3, TP.HCM",
      rating: 4,
    },
    {
      imageUrl:
        "https://static.vinwonders.com/2022/11/khu-du-lich-viet-nam-1.jpg",
      title: "Căn Hộ Studio",
      description: "Studio nhỏ xinh, phù hợp người độc thân",
      address: "321 Đường Pasteur, Quận 1, TP.HCM",
      rating: 4.5,
    },
    {
      imageUrl:
        "https://static.vinwonders.com/2022/11/khu-du-lich-viet-nam-6.jpeg",
      title: "Chung Cư Cao Cấp",
      description: "Chung cư full nội thất, tiện ích 5 sao",
      address: "555 Đường Võ Văn Tần, Quận 3, TP.HCM",
      rating: 4.8,
    },
  ];

  const supportSteps = [
    {
      id: 1,
      title: "Tìm kiếm & chọn chỗ ở",
      description:
        "Tìm kiếm chỗ ở phù hợp theo khu vực, loại hình, mức giá hoặc xem trực tiếp trên bản đồ.",
      icon: search,
    },
    {
      id: 2,
      title: "Liên hệ & đặt lịch",
      description:
        "Nhắn tin trực tiếp với chủ nhà và đặt lịch xem phòng nhanh chóng trên hệ thống.",
      icon: call,
    },
    {
      id: 3,
      title: "Hỗ trợ trong quá trình thuê",
      description:
        "Đội ngũ hỗ trợ sẵn sàng xử lý các vấn đề phát sinh trong quá trình thuê.",
      icon: find,
    },
    {
      id: 4,
      title: "Hướng dẫn & chăm sóc sau thuê",
      description:
        "Cung cấp tài liệu hướng dẫn và hỗ trợ lâu dài sau khi hoàn tất thuê.",
      icon: docs,
    },
  ];

  return (
    <div className="home_page">
      <div className="home_page-row-1">
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
          <FormSearch
            label=""
            name="search"
            formItemProps={{
              className: "row__content-search",
            }}
          />
        </div>
      </div>
      <div className="home_page-row-2">
        <div className="row__content">
          <h1 className="row__content-title">
            Khám phá các loại hình cho thuê phổ biến
          </h1>
          <div className="row__action">
            <div className="row__action-left">
              <p className="row__content-description">
                Chúng tôi cung cấp đa dạng loại hình không gian cho thuê, đáp
                ứng nhu cầu sinh hoạt, làm việc và tổ chức sự kiện của cá nhân
                cũng như doanh nghiệp.
              </p>
            </div>
          </div>
          <div className="row__content-suggest">
            <HomeCarousel
              items={sampleHomes}
              autoPlay={true}
              autoPlaySpeed={3000}
              dots={true}
              slidesToShow={1}
            />
          </div>
        </div>
      </div>
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
      <div className="home_page-row-4">
        <div className="row__content">
          <h1 className="row__content-title">
            Khám phá các loại hình cho thuê phổ biến
          </h1>
          <div className="row__action">
            <div className="row__action-left">
              <p className="row__content-description">
                Chúng tôi cung cấp đa dạng loại hình không gian cho thuê, đáp
                ứng nhu cầu sinh hoạt, làm việc và tổ chức sự kiện của cá nhân
                cũng như doanh nghiệp.
              </p>
            </div>
          </div>
          <div className="row__content-suggest">
            <HomeCarousel
              items={sampleHomes}
              autoPlay={true}
              autoPlaySpeed={3000}
              dots={true}
              slidesToShow={1}
            />
          </div>
        </div>
      </div>
      <div className="home_page-row-5">
        <div className="row__content">
          <h1 className="row__content-title">Hỗ trợ & Đồng hành cùng bạn</h1>
          <p className="row__content-description">
            Chúng tôi luôn sẵn sàng hỗ trợ trong suốt quá trình tìm và thuê chỗ
            ở.
          </p>
        </div>
        <div className="row__description">
          {supportSteps.map((step, index) => (
            <div key={index} className="row__description-item">
              <Lottie className="lottie-icon" animationData={step.icon} />
              <div className="div">
                <h3 className="row__description-title">{step.title}</h3>
                <p className="row__description-description">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
