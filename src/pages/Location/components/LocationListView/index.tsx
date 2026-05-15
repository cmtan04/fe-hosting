import { useLocationList } from "./hooks/useLocationList";
import type { LocationListViewProps } from "./hooks/useLocationList";
import { FilterOutlined } from "@ant-design/icons";
import { Button, Col, Row, Pagination } from "antd";
import { LocationCard } from "../LocationCard";
import type { LocationDto } from "@/api/dtos/location.dto";
import { LocationFilterDrawer } from "../LocationFilterDrawer";
import { isFavoriteLocation } from "@common/utils/favoriteLocations";
import "../style.scss";

export const LocationListView = (props: LocationListViewProps) => {
  const {
    canFetchLocations,
    filter,
    errorMessage,
    locationLoading,
    locations,
    refetch,
    handlePageChange,
    currentPage,
    totalItems,
    handleCardClick,
    isFilterOpen,
    setIsFilterOpen,
    containerRef,
    isEmbedded,
    isError,
    isFetching,
    setFilter,
  } = useLocationList(props);

  return (
    <div className="location__list">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        {props.hideTitle ? (
          <div />
        ) : (
          <h2 className="location__list-title" style={{ margin: 0 }}>
            {props.title ?? "Danh sách địa điểm"}
          </h2>
        )}

        {!isEmbedded && (
          <Button
            icon={<FilterOutlined />}
            onClick={() => setIsFilterOpen(true)}
          >
            Lọc kết quả
          </Button>
        )}
      </div>

      {canFetchLocations && isFetching && !locationLoading && (
        <p className="location__list-status">Đang cập nhật danh sách...</p>
      )}

      <Row
        gutter={[24, 24]}
        className="location__list-content"
        ref={containerRef}
      >
        {!canFetchLocations && !isEmbedded ? (
          <Col span={24}>
            <div className="location__list-state">
              <p className="location__list-state-title">
                Chưa hỗ trợ xem toàn bộ địa điểm
              </p>
              <p className="location__list-state-description">
                Hãy chọn loại hình hoặc khu vực từ menu để xem danh sách phù
                hợp.
              </p>
            </div>
          </Col>
        ) : null}

        {canFetchLocations && locationLoading
          ? Array.from({ length: 8 }, (_, index) => (
              <Col xs={24} sm={12} md={8} lg={6} key={index}>
                <div className="location__card-skeleton" />
              </Col>
            ))
          : null}

        {canFetchLocations && !locationLoading && isError ? (
          <Col span={24}>
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
          </Col>
        ) : null}

        {canFetchLocations &&
        !locationLoading &&
        !isError &&
        locations.length === 0 ? (
          <Col span={24}>
            <div className="location__list-state">
              <p className="location__list-state-title">
                Không tìm thấy địa điểm nào phù hợp
              </p>
              <p className="location__list-state-description">
                Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc khu vực/loại hình.
              </p>
            </div>
          </Col>
        ) : null}

        {canFetchLocations && !locationLoading && !isError
          ? locations.map((location: LocationDto) => (
              <Col xs={24} sm={12} md={8} lg={6} key={location.locationCode}>
                <LocationCard
                  code={location.locationCode}
                  typeName={location.typeName}
                  name={location.locationName}
                  description={location.locationDescription}
                  address={location.address?.[0]?.fullAddress}
                  rate={location.locationRate}
                  price={location.locationPrice}
                  priceUnit={location.locationPriceUnit}
                  image={location.locationLogo}
                  isFavourite={isFavoriteLocation(location.locationCode)}
                  onClick={handleCardClick}
                />
              </Col>
            ))
          : null}
      </Row>

      {canFetchLocations && !locationLoading && !isError && totalItems > 0 ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "32px",
          }}
        >
          <Pagination
            current={currentPage}
            total={totalItems}
            pageSize={filter.limit ?? 20}
            onChange={handlePageChange}
            showSizeChanger={false}
          />
        </div>
      ) : null}

      {!isEmbedded && (
        <LocationFilterDrawer
          open={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          initialFilter={filter}
          onApply={(newFilter) => {
            setFilter(newFilter);
          }}
        />
      )}
    </div>
  );
};
