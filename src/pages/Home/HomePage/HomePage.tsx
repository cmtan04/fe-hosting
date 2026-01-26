import { useRef } from "react";
import section1Back from "../../../assets/images/home/home-background2.jpg";
import IcnNext from "../../../assets/svg/home/icn-next.svg";
import type { SuggestProps } from "../../../common/types/home";
import { FormSearch } from "../../../components/FormSearch/formSearch";
import { type HomeCardProps } from "../../../components/HomeCard/HomeCard";
import {
  HomeCarousel,
  type HomeCarouselRef,
} from "../../../components/HomeCarousel/HomeCarousel";
import "../home.scss";
import "./homePage.scss";
export const HomePage = () => {
  const carouselRef = useRef<HomeCarouselRef>(null);
  const sampleHomes: HomeCardProps[] = [
    {
      imageUrl:
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      title: "Villa Hiện Đại",
      description: "Biệt thự sang trọng với thiết kế hiện đại",
      address: "123 Đường Lê Lợi, Quận 1, TP.HCM",
      rating: 4.5,
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      title: "Căn Hộ Penthouse",
      description: "Penthouse view đẹp, đầy đủ tiện nghi",
      address: "456 Đường Nguyễn Huệ, Quận 1, TP.HCM",
      rating: 5,
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
      title: "Nhà Phố Cao Cấp",
      description: "Nhà phố 3 tầng, vị trí đắc địa",
      address: "789 Đường Hai Bà Trưng, Quận 3, TP.HCM",
      rating: 4,
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
      title: "Căn Hộ Studio",
      description: "Studio nhỏ xinh, phù hợp người độc thân",
      address: "321 Đường Pasteur, Quận 1, TP.HCM",
      rating: 4.5,
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800",
      title: "Chung Cư Cao Cấp",
      description: "Chung cư full nội thất, tiện ích 5 sao",
      address: "555 Đường Võ Văn Tần, Quận 3, TP.HCM",
      rating: 4.8,
    },
  ];

  const suggestLocation: SuggestProps[] = [
    {
      key: 1,
      label: "Hà Nội",
    },
    {
      key: 2,
      label: "Tp Hồ Chí Minh",
    },
    {
      key: 3,
      label: "Hải Phòng",
    },
    {
      key: 4,
      label: "Bình Dương",
    },
  ];

  const handlePrev = () => {
    carouselRef.current?.prev();
  };

  const handleNext = () => {
    carouselRef.current?.next();
  };

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
            <div className="row__action-right">
              <img
                src={IcnNext}
                alt=""
                className="button-prev"
                onClick={handlePrev}
              />
              <img
                src={IcnNext}
                alt=""
                className="button-next"
                onClick={handleNext}
              />
            </div>
          </div>
          <div className="row__content-suggest">
            {sampleHomes.map((item) => {
              return (
                <HomeCarousel
                  ref={carouselRef}
                  items={sampleHomes}
                  autoPlay={true}
                  autoPlaySpeed={3000}
                  dots={true}
                  slidesToShow={1}
                />
              );
            })}
          </div>
        </div>
      </div>
      <div className="home_page-row-3">
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
            <div className="row__action-right">
              <img
                src={IcnNext}
                alt=""
                className="button-prev"
                onClick={handlePrev}
              />
              <img
                src={IcnNext}
                alt=""
                className="button-next"
                onClick={handleNext}
              />
            </div>
          </div>
          <div className="row__content-suggest">
            {sampleHomes.map((item) => {
              return (
                <HomeCarousel
                  ref={carouselRef}
                  items={sampleHomes}
                  autoPlay={true}
                  autoPlaySpeed={3000}
                  dots={true}
                  slidesToShow={1}
                />
              );
            })}
          </div>
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
            <div className="row__action-right">
              <img
                src={IcnNext}
                alt=""
                className="button-prev"
                onClick={handlePrev}
              />
              <img
                src={IcnNext}
                alt=""
                className="button-next"
                onClick={handleNext}
              />
            </div>
          </div>
          <div className="row__content-suggest">
            {sampleHomes.map((item) => {
              return (
                <HomeCarousel
                  ref={carouselRef}
                  items={sampleHomes}
                  autoPlay={true}
                  autoPlaySpeed={3000}
                  dots={true}
                  slidesToShow={1}
                />
              );
            })}
          </div>
        </div>
      </div>
      <div className="home_page-row-5">
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
            <div className="row__action-right">
              <img
                src={IcnNext}
                alt=""
                className="button-prev"
                onClick={handlePrev}
              />
              <img
                src={IcnNext}
                alt=""
                className="button-next"
                onClick={handleNext}
              />
            </div>
          </div>
          <div className="row__content-suggest">
            {sampleHomes.map((item) => {
              return (
                <HomeCarousel
                  ref={carouselRef}
                  items={sampleHomes}
                  autoPlay={true}
                  autoPlaySpeed={3000}
                  dots={true}
                  slidesToShow={1}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
