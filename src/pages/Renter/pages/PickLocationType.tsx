import { useQuery } from "@tanstack/react-query";
import type { RenterProps } from "../RenterLayout";
import "../renterLayout.scss";
import { LocationEndpoint } from "../../../api/endpoints/location.endpoint";
import { getAllLocationType } from "../../../api/configs/location.config";
import { LocationTypeCard } from "../components/locationTypeCard";
import { usePagination } from "../../../common/hooks/usePagination";
import { Pagination } from "../../../components/PaginationCommon/paginationCommon";
import { Button } from "antd";
import { useEffect, useState } from "react";
import { useLoading } from "../../../providers/loadingProvider";
import icnClear from "../../../assets/svg/icn-clear.svg";
import { useNavigate } from "react-router-dom";
import { ROUTER_PATH } from "../../../router/Route";
export const PickLocationType = (props: RenterProps) => {
  const { setLoading } = useLoading();
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState<string>();
  const { data: typeList, isLoading } = useQuery({
    queryKey: [LocationEndpoint.GET_ALL_LOCATION_TYPE],
    queryFn: () => getAllLocationType(),
  });

  const { currentPage, totalPages, currentItems, handlePageChange } =
    usePagination({
      items: typeList,
      itemsPerPage: 6,
    });

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  const handlerChoseType = () => {
    props.onSubmit(activeItem);
  };

  return (
    <div className="renter_location-type">
      <div className="renter_location-type-header">
        <h1 className="header-title">Không gian của bạn</h1>
        <p className="header-subTitle">
          Vui lòng cung cấp phân loại mà không gian mà bạn mang tới. Điều này
          giúp mọi người tìm kiếm không gian của bạn dễ dàng hơn.
        </p>
        <img
          src={icnClear}
          className="header-close"
          alt="X"
          onClick={() => navigate(ROUTER_PATH.HOME)}
        />
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
