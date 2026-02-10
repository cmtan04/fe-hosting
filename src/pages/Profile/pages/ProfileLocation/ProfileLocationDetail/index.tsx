import { Button, Checkbox, Col, DatePicker, Form, Row } from "antd";
import { useLoading } from "../../../../../providers/loadingProvider";
import { useLocation, useNavigate } from "react-router-dom";
import { LocationEndpoint } from "../../../../../api/endpoints/location.endpoint";
import { getLocationByCode } from "../../../../../api/configs/location.config";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import information from "../../../../../assets/svg/profile/information.svg";
import { FormInput } from "../../../../../components/FormInput/formInput";
import { FormTextArea } from "../../../../../components/FormTextArea/formTextArea";
import { DATE_FORMAT } from "../../../../../common/constants/constants";
import dayjs from "dayjs";
import { ServiceEndpoint } from "../../../../../api/endpoints/service.endpoint";
import { getAllService } from "../../../../../api/configs/service.config";
import { ServiceTag } from "../../../../Renter/components/ServiceTag/intex";
import { CommonTable } from "../../../../../components/CommonTable";

export const ProfileLocationDetail = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const { setLoading } = useLoading();
  const locationCode = location?.state?.locationCode;
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [filter, setFilter] = useState<any>();

  const { data: locationData, isLoading: locationLoading } = useQuery({
    queryKey: [LocationEndpoint.GET_LOCATION_BY_CODE, locationCode],
    queryFn: () => getLocationByCode(locationCode),
    enabled: !!locationCode,
  });

  const { data: service } = useQuery({
    queryKey: [ServiceEndpoint.GET_ALL_LOCATION_SERVICE],
    queryFn: () => getAllService(),
  });

  useEffect(() => {
    setLoading(locationLoading);
  }, [locationLoading]);

  useEffect(() => {
    if (locationData) {
      form.setFieldsValue({
        locationCode: locationData.locationCode,
        locationName: locationData.locationName,
        minTimeLimit: locationData.minTime ? dayjs(locationData.minTime) : null,
        maxTimeLimit: locationData.maxTime ? dayjs(locationData.maxTime) : null,
        locationDescription: locationData.locationDescription,
        locationNote: locationData.locationNote,
        locationPriceStart: locationData.locationPriceStart,
        locationPriceEnd: locationData.locationPriceEnd,
      });
    }
  }, [locationData, form]);

  const isServiceSelected = (serviceCode: string) => {
    return selectedServices.includes(serviceCode);
  };

  const handleServiceClick = (serviceCode: string) => {
    setSelectedServices((prev) => {
      const isSelected = prev.includes(serviceCode);
      let newSelected: string[];

      if (isSelected) {
        newSelected = prev.filter((code) => code !== serviceCode);
      } else {
        newSelected = [...prev, serviceCode];
      }

      return newSelected;
    });
  };

  const onSubmit = () => {};

  const tableHeader = [
    {
      key: 1,
      label: "Mã địa điểm",
      value: "locationCode",
    },
  ];
  return (
    <div className="profile__location-detail">
      <div className="profile__location-detail-header">
        <div className="text">
          <h1 className="header-title">Thông tin địa điểm của bạn</h1>
          <p className="header-subTitle">
            Đây là thông tin địa điểm mà bạn đã cung cấp trước đó. Người dùng sẽ
            biết đến địa điểm của bạn qua các thông tin này.
          </p>
        </div>
        <div className="action">
          <Button
            htmlType="button"
            icon={<img src={information} />}
            onClick={() => navigate(-1)}
            className="button-infor"
          />
        </div>
      </div>

      <div className="profile__location-detail-body">
        <Form
          form={form}
          onFinish={onSubmit}
          className="profile__location-form"
        >
          <div className="body-row">
            <Row gutter={[16, 16]}>
              <Col span={4}>
                <img src={locationData?.typeLogo} alt="Logo" className="logo" />
              </Col>
              <Col span={20}>
                <h1>Loại địa điểm: {locationData?.typeName} </h1>
                <p>Chú thích: {locationData?.typeDescription}</p>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col span={16}>
                <FormInput
                  label="Mã địa điểm"
                  name="locationCode"
                  disabled
                  placeholder=""
                  vertical={true}
                  formItemProps={{
                    rules: [
                      {
                        required: true,
                        message: "Trường này là trường bắt buộc.",
                      },
                    ],
                  }}
                />

                <FormInput
                  label="Tên địa điểm"
                  name="locationName"
                  placeholder="Nhập tên địa điểm"
                  vertical={true}
                  formItemProps={{
                    rules: [
                      {
                        required: true,
                        message: "Trường này là trường bắt buộc.",
                      },
                    ],
                  }}
                />

                <FormInput
                  label="Giá thấp nhât"
                  name="locationPriceStart"
                  placeholder="Nhập mức giá mong muốn"
                  vertical={true}
                  formItemProps={{
                    rules: [
                      {
                        required: true,
                        message: "Trường này là trường bắt buộc.",
                      },
                    ],
                  }}
                />

                <FormInput
                  label="Giá cho thuê"
                  name="locationPriceAfterDeal"
                  placeholder="Nhập mức giá mong muốn"
                  vertical={true}
                  formItemProps={{
                    rules: [
                      {
                        required: true,
                        message: "Trường này là trường bắt buộc.",
                      },
                    ],
                  }}
                />
              </Col>
              <Col span={8}>
                <img
                  src={locationData?.locationLogo}
                  alt="Logo"
                  className="logo"
                />
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col span={24}>
                <FormTextArea
                  label="Mô tả"
                  name="locationDescription"
                  placeholder="Nhập mô tả"
                  vertical={true}
                  formItemProps={{
                    rules: [
                      {
                        required: false,
                        message: "Trường này là trường bắt buộc.",
                      },
                    ],
                  }}
                />
              </Col>
              <Col span={24}>
                <FormTextArea
                  label="Ghi chú"
                  name="locationNote"
                  placeholder="Nhập ghi chú"
                  vertical={true}
                  formItemProps={{
                    rules: [
                      {
                        required: false,
                        message: "Trường này là trường bắt buộc.",
                      },
                    ],
                  }}
                />
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Form.Item
                  name="hasLimit"
                  valuePropName="checked"
                  className="form-checkbox"
                >
                  <Checkbox>Giới hạn thời gian thuê</Checkbox>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Form.Item
                  noStyle
                  shouldUpdate={(prevValues, currentValues) =>
                    prevValues.hasLimit !== currentValues.hasLimit
                  }
                >
                  {({ getFieldValue }) =>
                    getFieldValue("hasLimit") === true && (
                      <Row gutter={[16, 16]} className="limit-time">
                        <Col span={12}>
                          <Form.Item
                            name="minTimeLimit"
                            label="Từ ngày"
                            vertical={true}
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng chọn ngày bắt đầu",
                              },
                            ]}
                          >
                            <DatePicker
                              format={DATE_FORMAT}
                              placeholder="Chọn ngày bắt đầu"
                              style={{ width: "100%" }}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            name="maxTimeLimit"
                            vertical={true}
                            label="Đến ngày"
                            dependencies={["minTimeLimit"]}
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng chọn ngày kết thúc",
                              },
                              ({ getFieldValue }) => ({
                                validator(_, value) {
                                  const minDate = getFieldValue("minTimeLimit");
                                  if (
                                    !value ||
                                    !minDate ||
                                    value.isAfter(minDate)
                                  ) {
                                    return Promise.resolve();
                                  }
                                  return Promise.reject(
                                    new Error(
                                      "Ngày kết thúc phải sau ngày bắt đầu",
                                    ),
                                  );
                                },
                              }),
                            ]}
                          >
                            <DatePicker
                              format={DATE_FORMAT}
                              placeholder="Chọn ngày kết thúc"
                              style={{ width: "100%" }}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    )
                  }
                </Form.Item>
              </Col>
            </Row>
          </div>
          <div className="body-row">
            <Row gutter={[16, 16]}>
              <h1 className="header-title">Các dịch vụ được cung cấp</h1>
              <p className="header-subTitle">
                Các dịch vụ mà bạn cung cấp sẽ giúp trải nghiệm của khách hàng
                tốt hơn. Nó giúp cho địa điểm của bạn trở nên nổi tiếng hơn.
              </p>
            </Row>

            <div className="wrapper">
              <h1 className="body__section-2-content-title">
                Dịch vụ miễn phí
              </h1>
              <Row gutter={[16, 16]} className="body__section-2-content">
                {service
                  ?.filter((item) => Number(item.servicePrice) === 0)
                  .map((item) => (
                    <div
                      key={item.serviceCode}
                      onClick={() => handleServiceClick(item.serviceCode)}
                      style={{ cursor: "pointer" }}
                    >
                      <ServiceTag
                        icon={item.serviceLogo}
                        name={item.serviceName}
                        price={item.servicePrice}
                        description={item.serviceDescription}
                        active={isServiceSelected(item.serviceCode)}
                      />
                    </div>
                  ))}
              </Row>
            </div>

            <div className="wrapper">
              <h1 className="body__section-2-content-title">Dịch vụ mất phí</h1>
              <Row gutter={[16, 16]} className="body__section-2-content">
                {service
                  ?.filter((item) => Number(item.servicePrice) > 0)
                  .map((item) => (
                    <div
                      key={item.serviceCode}
                      onClick={() => handleServiceClick(item.serviceCode)}
                      style={{ cursor: "pointer" }}
                    >
                      <ServiceTag
                        icon={item.serviceLogo}
                        name={item.serviceName}
                        price={item.servicePrice}
                        description={item.serviceDescription}
                        active={isServiceSelected(item.serviceCode)}
                      />
                    </div>
                  ))}
              </Row>
            </div>

            <div className="wrapper">
              <Row gutter={[16, 16]}>
                <Col span={16}>
                  <p>Tổng tiền dịch vụ:</p>
                </Col>
                <Col span={8}>
                  <p>
                    {service
                      ?.filter((item) => Number(item.servicePrice) > 0)
                      .filter((item) => isServiceSelected(item.serviceCode))
                      .reduce(
                        (sum, item) => sum + Number(item.servicePrice),
                        0,
                      )}
                  </p>
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
                <Col span={16}>
                  <p>Tổng tiền được giảm:</p>
                </Col>
                <Col span={8}>
                  <p>
                    {service
                      ?.filter(
                        (item) =>
                          Number(item.servicePrice) > 0 &&
                          isServiceSelected(item.serviceCode),
                      )
                      .reduce((sum, item) => {
                        const price = Number(item.servicePrice || 0);
                        const discount = Number(item.serviceDiscount || 0);
                        return sum + (price * discount) / 100;
                      }, 0)}
                  </p>
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
                <Col span={16}>
                  <p>Tổng tiền dịch vụ (đã giảm giá):</p>
                </Col>
                <Col span={8}>
                  <p>
                    {service
                      ?.filter(
                        (item) =>
                          Number(item.servicePrice) > 0 &&
                          isServiceSelected(item.serviceCode),
                      )
                      .reduce((sum, item) => {
                        const price = Number(item.servicePrice || 0);
                        const discount = Number(item.serviceDiscount || 0);
                        return sum + price * (1 - discount / 100);
                      }, 0)}
                  </p>
                </Col>
              </Row>
            </div>
          </div>

          <div className="body-row">
            <Row gutter={[16, 16]}>
              <h1 className="header-title">Danh sách cơ sở</h1>
              <p className="header-subTitle">
                Các địa chỉ mà bạn đã cung cấp dưới đây sẽ giúp người dùng tìm
                đến dễ dàng hơn.
              </p>
            </Row>
            <Row gutter={[16, 16]}>
              <CommonTable
                header={tableHeader}
                body={locationData as any}
                className="location__table"
                hasPagination={true}
                pageSize={10}
                filter={filter}
                loading={locationLoading}
              />
            </Row>
            <Row gutter={[16, 16]}>
              <Button
                htmlType="button"
                icon={<img src={information} />}
                onClick={() => navigate(-1)}
                className="button-infor"
              />
            </Row>
          </div>
        </Form>
      </div>
    </div>
  );
};
