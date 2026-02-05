import { useQuery } from "@tanstack/react-query";
import type { RenterProps } from "../RenterLayout";
import "../renterLayout.scss";
import { LocationEndpoint } from "../../../api/endpoints/location.endpoint";
import { getAllLocationType } from "../../../api/configs/location.config";
import { LocationTypeCard } from "../components/locationTypeCard";
import { usePagination } from "../../../common/hooks/usePagination";
import { Pagination } from "../../../components/PaginationCommon/paginationCommon";
import { Button } from "antd";
import { useState } from "react";

export const PickLocationType = (props: RenterProps) => {
  const [activeItem, setActiveItem] = useState<string>();
  const { data: typeList } = useQuery({
    queryKey: [LocationEndpoint.GET_ALL_LOCATION_TYPE],
    queryFn: () => getAllLocationType(),
  });

  const { currentPage, totalPages, currentItems, handlePageChange } =
    usePagination({
      items: typeList,
      itemsPerPage: 6,
    });

  const handlerChoseType = () => {
    props.onSubmit(activeItem);
  };

  return (
    <div className="renter_location-type">
      <div className="renter_location-type-header">
        <h1 className="header-title">Không gian của bạn</h1>
        <p className="header-subTitle">
          Vui lòng cung cấp phân loại mà không gian mà bạn cung cấp. Điều này
          giúp mọi người tìm kiếm không gian của bạn dễ dàng hơn.
        </p>
      </div>

      <div className="renter_location-type-body">
        {currentItems?.map((item, index) => (
          <div
            className={`item ${item.typeCode === activeItem && "active"}`}
            key={item.id || index}
            onClick={() => setActiveItem(item.typeCode)}
          >
            <LocationTypeCard
              typeName={item.typeName}
              typeDescription={item.typeDescription}
              typeBackGround={item.typeBackGround}
              typeLogo={item.typeLogo}
            />
          </div>
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      <div className="renter_location-type-footer">
        <Button
          htmlType="button"
          className="button-submit"
          onClick={() => handlerChoseType()}
        >
          Tiếp tục
        </Button>
      </div>
    </div>
  );
};
