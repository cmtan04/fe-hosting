import { Button, Col, Form, Row } from "antd";
import { FormInput } from "../../../../components/FormInput/formInput";
import { SelectCommon } from "../../../../components/SelectCommon";
import type {
  SelectOptionProps,
  TableCommonProps,
} from "../../../../common/types/common";
import { LocationEndpoint } from "../../../../api/endpoints/location.endpoint";
import { useQuery } from "@tanstack/react-query";
import {
  getAllLocationType,
  getLocationByFilter,
} from "../../../../api/configs/location.config";
import { useLoading } from "../../../../providers/loadingProvider";
import { useEffect, useState } from "react";
import { CommonTable } from "../../../../components/CommonTable";

export const ProfileLocation = () => {
  const [form] = Form.useForm();
  const { setLoading } = useLoading();
  const [filter, setFilter] = useState();

  const { data: typeList, isLoading } = useQuery({
    queryKey: [LocationEndpoint.GET_ALL_LOCATION_TYPE],
    queryFn: () => getAllLocationType(),
  });

  const { data: locationData, isLoading: locationLoading } = useQuery({
    queryKey: [LocationEndpoint.GET_LOCATION_BY_FILTER, filter],
    queryFn: () => getLocationByFilter(filter),
  });

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  const onSubmitSearch = () => {};

  const addNewLocation = () => {};

  const rentOption: SelectOptionProps[] = [
    {
      key: 0,
      value: 0,
      label: "Chưa thuê",
    },
    {
      key: 1,
      value: 1,
      label: "Đã thuê",
    },
  ];

  const header: TableCommonProps[] = [
    {
      key: 1,
      label: "Mã địa điểm",
      value: "locationCode",
    },
    {
      key: 2,
      label: "Tên địa điểm",
      value: "locationName",
    },
    {
      key: 3,
      label: "Giá niêm yết",
      value: "locationPriceStart",
    },
    {
      key: 4,
      label: "Giá thuê",
      value: "locationPriceEnd",
    },
    {
      key: 5,
      label: "Trạng thái",
      value: "hasRent",
      render: (value: number) => {
        console.log(value);
        if (value === 0) {
          return (
            <div className="status ready">
              <p>{rentOption.find((item) => item.value === value)?.label}</p>
            </div>
          );
        } else {
          return (
            <div className="status rented">
              <p>{rentOption.find((item) => item.value === value)?.label}</p>
            </div>
          );
        }
      },
    },
    {
      key: 6,
      label: "Phân loại",
      value: "typeName",
    },
  ];
  return (
    <div className="profile__location">
      <div className="profile__location-header">
        <h1>Danh sách địa điểm của bạn</h1>
        <p>Danh sách các địa điểm mà bạn đã cung cấp.</p>
      </div>
      <div className="profile__location-body">
        <div className="profile__location-body-search">
          <Form form={form} onFinish={onSubmitSearch}>
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <FormInput
                  label="Tên địa chỉ"
                  name="locationName"
                  placeholder="Nhập tên địa chỉ"
                  vertical={true}
                  formItemProps={{
                    rules: [
                      {
                        required: false,
                      },
                    ],
                  }}
                />
              </Col>
              <Col span={8}>
                <SelectCommon
                  label="Trạng thái"
                  name="hasRent"
                  placeholder="Trạng thái"
                  options={rentOption}
                  formItemProps={{
                    rules: [
                      {
                        required: false,
                      },
                    ],
                  }}
                />
              </Col>
              <Col span={8}>
                <SelectCommon
                  label="Phân loại"
                  name="hasRent"
                  placeholder="Phân loại"
                  options={
                    typeList?.map((item) => ({
                      key: Number(item.id),
                      value: item.typeCode,
                      label: item.typeName,
                    })) || []
                  }
                  formItemProps={{
                    rules: [
                      {
                        required: false,
                      },
                    ],
                  }}
                />
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <FormInput
                  label="Tên người thuê"
                  name="locationName"
                  placeholder="Tên người thuê"
                  vertical={true}
                  formItemProps={{
                    rules: [
                      {
                        required: false,
                      },
                    ],
                  }}
                />
              </Col>
              <Col span={12}>
                <FormInput
                  label="Email người thuê"
                  name="locationName"
                  placeholder="Email người thuê"
                  vertical={true}
                  formItemProps={{
                    rules: [
                      {
                        required: false,
                      },
                    ],
                  }}
                />
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <FormInput
                  label="Địa chỉ"
                  name="locationName"
                  placeholder="Địa chỉ"
                  vertical={true}
                  formItemProps={{
                    rules: [
                      {
                        required: false,
                      },
                    ],
                  }}
                />
              </Col>
            </Row>
            <Row gutter={[16, 16]} className="action-row">
              <Button htmlType="submit" className="button-submit">
                Tìm kiếm
              </Button>
            </Row>
          </Form>
        </div>
        <div className="profile__location-body-result">
          <Row gutter={[16, 16]} className="header">
            <p className="result__count">Tổng số địa điểm: </p>
            <Button
              htmlType="button"
              onClick={() => addNewLocation()}
              className="button-add"
            >
              Thêm mới
            </Button>
          </Row>

          <Row gutter={[16, 16]}>
            <CommonTable
              header={header}
              body={locationData as any}
              className="location__table"
              hasPagination={true}
              pageSize={10}
              filter={filter}
              loading={locationLoading}
            />
          </Row>
        </div>
      </div>
    </div>
  );
};
