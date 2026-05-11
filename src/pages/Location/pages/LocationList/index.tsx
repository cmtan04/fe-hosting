import { Banner } from "../../../../components/Banner/Banner";
import "../style.scss";
import { useLocationList } from "./hooks/useLocationList";
import { LocationCard } from "../../components/LocationCard";
import { Pagination } from "../../../../components/PaginationCommon/paginationCommon";
import { LocationFilterDrawer } from "../../components/LocationFilterDrawer";
import { Button, Row, Col } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import { isAxiosError } from "axios";
import { DEFAULT_MESSAGE } from "../../../../common/constants/constants";
import type { LocationDto } from "../../../../api/dtos/location.dto";

export const LocationList = () => {
  // Tất cả logic nghiệp vụ, state và việc lấy dữ liệu được đóng gói trong custom hook này
  const {
    locationData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    filter,
    setFilter,
    isFilterOpen,
    setIsFilterOpen,
    handlePageChange,
    handleCardClick,
    setKeyword,
    bannerProps,
  } = useLocationList();

  const totalPages = locationData?.totalPages ?? 1;
  const currentPage = filter.page ?? 1;
  const locations = locationData?.data ?? [];
  const errorMessage = isAxiosError(error)
    ? (error.response?.data?.message ?? DEFAULT_MESSAGE)
    : DEFAULT_MESSAGE;

  const renderContent = () => {
    if (isLoading) {
      return (
        <Row gutter={[24, 24]}>
          {Array.from({ length: 8 }, (_, index) => (
            <Col xs={24} sm={12} md={8} lg={6} key={index}>
              <div className="location__card-skeleton" />
            </Col>
          ))}
        </Row>
      );
    }

    if (isError) {
      return (
        <div className="location__list-state">
          <p className="location__list-state-title">
            Không thể tải danh sách địa điểm
          </p>
          <p className="location__list-state-description">{errorMessage}</p>
          <button
            type="button"
            className="location__list-state-action"
            onClick={() => {
              void refetch();
            }}
          >
            Thử lại
          </button>
        </div>
      );
    }

    if (locations.length === 0) {
      return (
        <div className="location__list-state">
          <p className="location__list-state-title">
            Không tìm thấy địa điểm nào phù hợp
          </p>
          <p className="location__list-state-description">
            Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc khu vực/loại hình.
          </p>
        </div>
      );
    }
    return (
      <Row gutter={[24, 24]}>
        {locations.map((locationItem: LocationDto) => (
          <Col xs={24} sm={12} md={8} lg={6} key={locationItem.locationCode}>
            <LocationCard
              code={locationItem.locationCode}
              typeName={locationItem.typeName}
              name={locationItem.locationName}
              description={locationItem.locationDescription}
              address={locationItem.address?.[0]?.fullAddress}
              rate={locationItem.locationRate}
              price={
                locationItem.locationPrice || locationItem.locationPriceAfterDeal
              }
              priceUnit={locationItem.locationPriceUnit}
              image={locationItem.locationLogo}
              isFavourite={false}
              onClick={handleCardClick}
            />
          </Col>
        ))}
      </Row>
    );
  };

  return (
    <div className="location">
      <Banner {...bannerProps} onSearch={(value) => setKeyword(value)} />

      <div className="location__list">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <h2 className="location__list-title" style={{ margin: 0 }}>
            Danh sách địa điểm
          </h2>

          <Button
            icon={<FilterOutlined />}
            onClick={() => setIsFilterOpen(true)}
          >
            Lọc kết quả
          </Button>
        </div>

        {isFetching && !isLoading && (
          <p className="location__list-status">Đang cập nhật danh sách...</p>
        )}

        <div className="location__list-content">{renderContent()}</div>

        {!isLoading && !isError && locations.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      <LocationFilterDrawer
        open={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        initialFilter={filter}
        onApply={(newFilter) => {
          setFilter(newFilter);
        }}
      />
    </div>
  );
};
