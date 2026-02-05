import { useQuery } from "@tanstack/react-query";
import type { RenterProps } from "../RenterLayout";
import "../renterLayout.scss";
import { LocationEndpoint } from "../../../api/endpoints/location.endpoint";
import { getAllLocationType } from "../../../api/configs/location.config";
import { LocationTypeCard } from "../components/locationTypeCard";
import { usePagination } from "../../../common/hooks/usePagination";
import { Pagination } from "../../../components/PaginationCommon/paginationCommon";
import { Button } from "antd";

export const PickLocationType = (props: RenterProps) => {
  const { data: typeList } = useQuery({
    queryKey: [LocationEndpoint.GET_ALL_LOCATION_TYPE],
    queryFn: () => getAllLocationType(),
  });

  const { currentPage, totalPages, currentItems, handlePageChange } =
    usePagination({
      items: typeList,
      itemsPerPage: 6,
    });

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
          <div className="item" key={item.id || index}>
            <LocationTypeCard
              typeName={item.typeName}
              typeDescription={item.typeDescription}
              typeBackGround={item.typeBackGround}
              typeLogo={item.typeLogo}
            />
          </div>
        ))}
      </div>
      <div className="renter_location-type-footer">
        <Button htmlType="button" className="button-submit">
          Tiếp tục
        </Button>
      </div>
    </div>
  );
};
