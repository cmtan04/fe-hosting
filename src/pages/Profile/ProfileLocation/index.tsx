import { Button, Form, Row } from "antd";
import "./style.scss";
import type { SelectOptionProps, TableCommonProps } from "@common/types/common";
import { LocationEndpoint } from "@api/endpoints/location.endpoint";
import { useQuery } from "@tanstack/react-query";
import {
  getAllLocationType,
  getOwnerLocations,
} from "@api/configs/location.config";
import { useLoading } from "@providers/loadingProvider";
import { useEffect, useState } from "react";
import { CommonTable } from "@components/CommonTable";
import add from "@assets/svg/profile/add.svg";
import information from "@assets/svg/profile/information.svg";
import type { ProfileLocationFilter } from "@common/types/profile";
import { useNavigate } from "react-router-dom";
import { ROUTER_PATH } from "@/router/Route";
import { useAuth } from "@common/contexts/authContext";
import { FormSearch } from "@components/FormSearch/formSearch";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";

export const ProfileLocation = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { setLoading } = useLoading();
  const [filter, setFilter] = useState<ProfileLocationFilter>({
    page: 1,
    limit: 2,
  });
  const auth = useAuth();
  const ownerCode = auth?.user?.userCode || "";

  const { data: typeList, isLoading } = useQuery({
    queryKey: [LocationEndpoint.GET_ALL_LOCATION_TYPE],
    queryFn: () => getAllLocationType(),
  });

  const { data: locationData, isLoading: locationLoading } = useQuery({
    queryKey: [LocationEndpoint.GET_OWNER_LOCATIONS, ownerCode],
    queryFn: () => getOwnerLocations(ownerCode),
  });

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  const onSubmitSearch = () => {
    setFilter({
      searchValue: form.getFieldValue("locationName"),
      hasRent: form.getFieldValue("hasRent"),
      locationType: form.getFieldValue("locationType"),
      addressRegion: form.getFieldValue("fullAddress"),
      page: 1,
      limit: 2,
    });
  };

  const addNewLocation = () => {
    navigate(ROUTER_PATH.RENTER);
  };

  const EditLocation = (value: string) => {
    navigate(ROUTER_PATH.PROFILE_LOCATION_DETAIL, {
      state: {
        locationCode: value,
      },
    });
  };

  const viewLocation = (value: string) => {
    navigate(ROUTER_PATH.LOCATION_DETAIL.replace(":code", value));
  };

  const header: TableCommonProps[] = [
    {
      key: 2,
      label: "Tên địa điểm",
      value: "locationName",
    },
    {
      key: 3,
      label: "Giá niêm yết",
      value: "locationPrice",
      render: (value: number, record: any) => (
        <span>
          {value?.toLocaleString()} VNĐ{record.locationPriceUnit}
        </span>
      ),
    },
    {
      key: 6,
      label: "Phân loại",
      value: "typeName",
    },
    {
      key: 7,
      label: "",
      value: "action",
      render: (index: any, record: any) => {
        return (
          <div className="action-column" style={{ display: "flex", gap: "8px" }}>
            <Button
              htmlType="button"
              icon={<EyeOutlined />}
              onClick={() => viewLocation(record.locationCode)}
              className="button-infor"
            />
            <Button
              htmlType="button"
              icon={<EditOutlined />}
              onClick={() => EditLocation(record.locationCode)}
              className="button-infor"
            />
          </div>
        );
      },
    },
  ];

  return (
    <div className="profile__location">
      <div className="profile__location-header">
        <h1>Danh sách địa điểm của bạn</h1>
        <p>Danh sách các địa điểm mà bạn đã cung cấp.</p>
      </div>
      <div className="profile__location-body">
        <FormSearch
          name="locationName"
          label=""
          placeholder="Tìm kiếm địa điểm của bạn..."
          onSearch={onSubmitSearch}
        />

        <div className="profile__location-body-result">
          <Row gutter={[16, 16]} className="header">
            <p className="result__count">
              Tổng số địa điểm: {locationData?.length ?? 0}
            </p>
            <Button
              htmlType="button"
              onClick={() => addNewLocation()}
              icon={<img src={add} />}
              className="button-add"
            >
              Thêm mới
            </Button>
          </Row>

          <Row gutter={[16, 16]}>
            <CommonTable
              header={header}
              body={locationData}
              className="location__table"
              loading={locationLoading}
              hasPagination={true}
              currentPage={filter.page ?? 1}
              // totalPages={locationData?.length ?? 1}
              onPageChange={(page) => setFilter((prev) => ({ ...prev, page }))}
            />
          </Row>
        </div>
      </div>
    </div>
  );
};
