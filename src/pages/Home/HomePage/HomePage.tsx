import section1Back from "../../../assets/images/home/home-background2.jpg";
import type { SuggestProps } from "../../../common/types/home";
import { FormSearch } from "../../../components/FormSearch/formSearch";
import "../home.scss";
import "./homePage.scss";
export const HomePage = () => {
  const suggestItem: SuggestProps[] = [
    {
      key: 1,
      label: "Phòng trọ",
    },
    {
      key: 2,
      label: "Văn Phòng",
    },
    {
      key: 3,
      label: "Phòng trọ",
    },
    {
      key: 4,
      label: "Phòng trọ",
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
          <p className="row__content-description">
            Chúng tôi cung cấp đa dạng loại hình không gian cho thuê, đáp ứng
            nhu cầu sinh hoạt, làm việc và tổ chức sự kiện của cá nhân cũng như
            doanh nghiệp.
          </p>
          <div className="row__content-suggest">
            {suggestItem.map((item) => {
              return (
                <div className="suggest-item" key={item.key}>
                  <p className="suggest-item-label">{item.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="home_page-row-3">
        <img src={section1Back} alt="Logo" className="row__background" />
        <div className="row__content">
          <h1 className="row__content-title">Khu vực được tìm kiếm nhiều</h1>
          <p className="row__content-description">
            Danh sách các khu vực có nhu cầu thuê cao, tập trung nhiều lựa chọn
            và mức giá đa dạng, giúp bạn dễ dàng tìm được không gian phù hợp.
          </p>
          <div className="row__content-suggest">
            {suggestLocation.map((item) => {
              return (
                <div className="suggest-item" key={item.key}>
                  <p className="suggest-item-label">{item.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="home_page-row-4">
        <img src={section1Back} alt="Logo" className="row__background" />
        <div className="row__content">
          <h1 className="row__content-title">
            Vì sao nhiều người lựa chọn chúng tôi
          </h1>
          <p className="row__content-description">
            Không chỉ cung cấp danh sách cho thuê, chúng tôi tập trung vào trải
            nghiệm tìm kiếm dễ dàng, thông tin minh bạch và khả năng kết nối
            nhanh chóng giữa người thuê và bên cho thuê.
          </p>
          <div className="row__content-suggest">
            {suggestLocation.map((item) => {
              return (
                <div className="suggest-item" key={item.key}>
                  <p className="suggest-item-label">{item.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="home_page-row-3">
        <img src={section1Back} alt="Logo" className="row__background" />
        <div className="row__content">
          <h1 className="row__content-title">
            Sẵn sàng tìm không gian phù hợp cho bạn?
          </h1>
          <p className="row__content-description">
            Bắt đầu tìm kiếm ngay hôm nay để khám phá hàng ngàn lựa chọn cho
            thuê phù hợp với nhu cầu và ngân sách của bạn.
          </p>
          <div className="row__content-suggest">
            {suggestLocation.map((item) => {
              return (
                <div className="suggest-item" key={item.key}>
                  <p className="suggest-item-label">{item.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
