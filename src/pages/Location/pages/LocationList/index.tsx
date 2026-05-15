import { Banner } from "@components/Banner/Banner";
import "../style.scss";
import { useLocationList } from "./hooks/useLocationList";
import { LocationCard } from "../../components/LocationCard";
import { LocationFilterDrawer } from "../../components/LocationFilterDrawer";
import { Button, Row, Col, Grid, Tooltip } from "antd";
import {
  FilterOutlined,
  AppstoreOutlined,
  BarsOutlined,
} from "@ant-design/icons";
import { isAxiosError } from "axios";
import { DEFAULT_MESSAGE } from "@common/constants/constants";
import type { LocationDto } from "@api/dtos/location.dto";
import { useState, useEffect, useRef } from "react";
import { LocationBar } from "../../components/LocationBar";
import { isFavoriteLocation } from "@common/utils/favoriteLocations";

export const LocationList = () => {
  const {
    locationData,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isError,
    error,
    refetch,
    filter,
    handleFilterApply,
    handleSearch,
    handleCardClick,
    isFilterOpen,
    setIsFilterOpen,
  } = useLocationList();

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Gộp tất cả các trang dữ liệu từ infinite query thành một mảng duy nhất
  const locations = locationData?.pages?.flatMap((page) => page.data) ?? [];
  const locationTotal = locationData?.pages?.[0]?.total ?? 0;
  const screens = Grid.useBreakpoint();
  const isDesktop = screens.lg;
  const isSmall = screens.sm;
  const errorMessage = isAxiosError(error)
    ? (error.response?.data?.message ?? DEFAULT_MESSAGE)
    : DEFAULT_MESSAGE;

  // Intersection Observer cho automatic infinite scroll
  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <Row gutter={[24, 24]}>
          {Array.from({ length: 8 }, (_, index) => (
            <Col
              xs={24}
              sm={viewMode === "grid" ? 12 : 24}
              md={viewMode === "grid" ? 8 : 24}
              xl={viewMode === "grid" ? 6 : 24}
              key={index}
            >
              <div
                className={`location__card-skeleton ${viewMode === "list" ? "location__card-skeleton--list" : ""}`}
              />
            </Col>
          ))}
        </Row>
      );
    }

    if (isError) {
      return (
        <div className="location__list-state">
          <p className="location__list-title">
            Không thể tải danh sách địa điểm
          </p>
          <p className="location__list-description">{errorMessage}</p>
          <button
            type="button"
            className="location__list-action"
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
          <p className="location__list-title">
            Không tìm thấy địa điểm nào phù hợp
          </p>
          <p className="location__list-description">
            Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc khu vực/loại hình.
          </p>
        </div>
      );
    }

    return (
      <>
        <Row gutter={[24, 24]}>
          {locations.map((locationItem: LocationDto) => {
            // Khai báo biến ở đây (trong thân hàm map)
            const itemProps = {
              code: locationItem.locationCode,
              typeName: locationItem.typeName,
              name: locationItem.locationName,
              description: locationItem.locationDescription,
              address: locationItem.address?.[0]?.fullAddress,
              rate: locationItem.locationRate,
              price:
                locationItem.locationPrice ||
                locationItem.locationPriceAfterDeal,
              priceUnit: locationItem.locationPriceUnit,
              image: locationItem.locationLogo,
              isFavourite: isFavoriteLocation(locationItem.locationCode),
              onClick: handleCardClick,
            };

            return (
              <Col
                xs={24}
                sm={viewMode === "grid" ? 12 : 24}
                md={viewMode === "grid" ? 8 : 24}
                key={locationItem.locationCode}
              >
                {viewMode === "grid" && isSmall ? (
                  <LocationCard {...itemProps} />
                ) : (
                  <LocationBar {...itemProps} />
                )}
              </Col>
            );
          })}
        </Row>

        {/* Cột mốc để trigger tải thêm */}
        <div ref={loadMoreRef} style={{ height: "20px", margin: "20px 0" }}>
          {isFetchingNextPage && (
            <div
              style={{
                textAlign: "center",
                color: "var(--primary-color)",
                fontWeight: 500,
              }}
            >
              Đang tải thêm kết quả...
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="location">
      <Banner onSearch={handleSearch} />

      <div className="location__list">
        <Row gutter={[24, 24]}>
          {isDesktop && (
            <Col span={8}>
              <LocationFilterDrawer
                open={false}
                onClose={() => {}}
                initialFilter={filter}
                onApply={handleFilterApply}
              />
            </Col>
          )}

          <Col xs={24} lg={16}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <h2 className="location__list-title" style={{ margin: 0 }}>
                Tổng số địa điểm: {locationTotal}
              </h2>

              <div
                style={{ display: "flex", gap: "12px", alignItems: "center" }}
              >
                {isSmall && (
                  <div
                    className="view-mode-toggle"
                    style={{
                      display: "flex",
                      background: "#f0f0f0",
                      padding: "4px",
                      borderRadius: "8px",
                    }}
                  >
                    <Tooltip title="Xem dạng lưới">
                      <Button
                        type={viewMode === "grid" ? "primary" : "text"}
                        icon={<AppstoreOutlined />}
                        onClick={() => setViewMode("grid")}
                        size="small"
                      />
                    </Tooltip>
                    <Tooltip title="Xem dạng danh sách">
                      <Button
                        type={viewMode === "list" ? "primary" : "text"}
                        icon={<BarsOutlined />}
                        onClick={() => setViewMode("list")}
                        size="small"
                      />
                    </Tooltip>
                  </div>
                )}

                {!isDesktop && (
                  <Button
                    icon={<FilterOutlined />}
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                  >
                    Lọc
                  </Button>
                )}
              </div>
            </div>
            {!isDesktop && isFilterOpen && (
              <LocationFilterDrawer
                open={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                initialFilter={filter}
                onApply={handleFilterApply}
              />
            )}

            {isFetching && !isLoading && !isFetchingNextPage && (
              <p className="location__list-status">
                Đang cập nhật danh sách...
              </p>
            )}

            <div className="location__list-content">{renderContent()}</div>
          </Col>
        </Row>
      </div>
    </div>
  );
};
