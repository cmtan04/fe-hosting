import { Button, Col, Form, Row } from "antd";
import { FormInput } from "../../../../components/FormInput/formInput";
import { SelectCommon } from "../../../../components/SelectCommon";
import type { SelectOptionProps } from "../../../../common/types/common";
import { LocationEndpoint } from "../../../../api/endpoints/location.endpoint";
import { useQuery } from "@tanstack/react-query";
import { getAllLocationType } from "../../../../api/configs/location.config";
import { useLoading } from "../../../../providers/loadingProvider";
import { useEffect } from "react";

export const ProfileLocation = () => {
  const [form] = Form.useForm();
  const { setLoading } = useLoading();

  const { data: typeList, isLoading } = useQuery({
    queryKey: [LocationEndpoint.GET_ALL_LOCATION_TYPE],
    queryFn: () => getAllLocationType(),
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
            <Row gutter={[16, 16]}>
              <Button htmlType="submit" className="button-submit">
                Tìm kiếm
              </Button>
            </Row>
          </Form>
        </div>
        <div className="profile__location-body-result">
          <Row gutter={[16, 16]}>
            <p className="result__count">Tổng số địa điểm: </p>
            <Button
              htmlType="button"
              onClick={() => addNewLocation()}
              className="button-add"
            >
              Thêm mới
            </Button>
          </Row>
        </div>
      </div>
    </div>
  );
};
