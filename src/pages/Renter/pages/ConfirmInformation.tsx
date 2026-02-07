import { Button, Col, DatePicker, Form, Row } from "antd";
import type { RenterProps } from "../RenterLayout";
import { FormInput } from "../../../components/FormInput/formInput";
import { FormTextArea } from "../../../components/FormTextArea/formTextArea";
import { DATE_FORMAT } from "../../../common/constants/constants";
import { useQuery } from "@tanstack/react-query";
import { LocationEndpoint } from "../../../api/endpoints/location.endpoint";
import { getAllLocationType } from "../../../api/configs/location.config";
import { useEffect, useState } from "react";
import type { LocationTypeDto } from "../../../api/dtos/location.dto";
import { useLoading } from "../../../providers/loadingProvider";

export const ConfirmInformation = (props: RenterProps) => {
  const [form] = Form.useForm();
  const { setLoading } = useLoading();
  const [locationType, setLocationType] = useState<LocationTypeDto>();

  const { data: typeList, isLoading } = useQuery({
    queryKey: [LocationEndpoint.GET_ALL_LOCATION_TYPE],
    queryFn: () => getAllLocationType(),
  });

  useEffect(() => {
    if (typeList) {
      const type = typeList.find((item) => item.id === props.data.typeCode);
      setLocationType(type);
    }
  }, [typeList]);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  const onSubmit = () => {};
  return (
    <div className="renter__confirm">
      <div className="renter__confirm-header">
        <h1 className="header-title">Xác nhận thông tin không gian của bạn</h1>
        <p className="header-subTitle">
          Vui lòng xác nhận lại thông tin về không gian mà bạn cung cấp. Điều
          này giúp thông tin không gian của bạn đầy đủ và chính xác hơn.
        </p>
      </div>
      <Form form={form} onFinish={onSubmit} className="renter__confirm-form">
        <div className="renter__confirm-section row-1">
          <h1 className="renter__confirm-section-title">Thông tin cơ bản</h1>
          <Row gutter={[16, 16]}>
            <Col span={6}>
              <img src={locationType?.typeLogo} alt="Logo" className="logo" />
            </Col>
            <Col span={18}>
              <h1>Loại địa điểm: {locationType?.typeName} </h1>
              <p>Chú thích: {locationType?.typeDescription}</p>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <FormInput
                label="Tên địa điểm"
                name="locationName"
                placeholder=""
                vertical={true}
                disabled
              />
            </Col>
            <Col span={12}>
              <FormInput
                label="Giá thuê"
                name="locationPriceStart"
                placeholder=""
                vertical={true}
                disabled
              />
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <FormTextArea
                label="Mô tả"
                name="locationDescription"
                placeholder="Nhập mô tả"
                disabled
                vertical={true}
              />
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <FormTextArea
                label="Ghi chú"
                name="locationNote"
                placeholder="Nhập ghi chú"
                disabled
                vertical={true}
              />
            </Col>
          </Row>
          {props.data.minTimeLimit && props.data.maxTimeLimit && (
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Col span={12}>
                  <Form.Item
                    name="minTimeLimit"
                    label="Từ ngày"
                    vertical={true}
                  >
                    <DatePicker
                      format={DATE_FORMAT}
                      placeholder="Chọn ngày bắt đầu"
                      disabled
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="maxTimeLimit"
                  vertical={true}
                  label="Đến ngày"
                  dependencies={["minTimeLimit"]}
                >
                  <DatePicker
                    disabled
                    format={DATE_FORMAT}
                    placeholder="Chọn ngày kết thúc"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>
            </Row>
          )}
        </div>

        <div className="renter__confirm-section row-2">
          <h1 className="renter__confirm-section-title">Thông tin địa chỉ</h1>
          <Row gutter={[16, 16]} className="form-row">
            <Col span={6}>
              <FormInput
                disabled
                label="Tên địa chỉ"
                name="addressName"
                placeholder="Nhập tên địa chỉ"
                vertical={true}
              />
            </Col>
            <Col span={18}>
              <FormInput
                disabled
                label="Địa chỉ chi tiết"
                name="fullAddress"
                placeholder="Nhập địa chỉ chi tiết"
                vertical={true}
              />
            </Col>
          </Row>

          <Row gutter={[16, 16]} className="form-row">
            <Col span={12}>
              <FormInput
                disabled
                label="Mã bưu chính"
                name="addRessPortal"
                placeholder="Nhập mã bưu chính."
                vertical={true}
              />
            </Col>

            <Col span={12}>
              <FormInput
                disabled
                label="Quận / Huyện"
                name="addressDistrict"
                placeholder="Nhập quận / huyện"
                vertical={true}
              />
            </Col>
          </Row>

          <Row gutter={[16, 16]} className="form-row">
            <Col span={12}>
              <FormInput
                disabled
                label="Thành phố"
                name="addressCity"
                placeholder="Nhập thành phố."
                vertical={true}
              />
            </Col>
            <Col span={12}>
              <FormInput
                disabled
                label="Tỉnh"
                name="addressProvince"
                placeholder="Nhập tỉnh"
                vertical={true}
              />
            </Col>
          </Row>

          <Row gutter={[16, 16]} className="form-row">
            <Col span={12}>
              <FormInput
                disabled
                label="Phường / Xã"
                name="addressWard"
                placeholder="Nhập phường / xã."
                vertical={true}
              />
            </Col>
            <Col span={12}>
              <FormInput
                disabled
                label="Quốc gia"
                name="addressCountry"
                placeholder="Nhập quốc giá"
                vertical={true}
              />
            </Col>
          </Row>

          <Row gutter={[16, 16]} className="form-row">
            <Col span={24}>
              <FormInput
                disabled
                label="Vùng"
                name="addressRegion"
                placeholder="Nhập vùng"
                vertical={true}
              />
            </Col>
          </Row>

          <Row gutter={[16, 16]} className="form-row">
            <Col span={24}>
              <FormTextArea
                disabled
                label="Mô tả"
                name="addressDescription"
                placeholder="Nhập mô tả"
                vertical={true}
              />
            </Col>
          </Row>

          <Row gutter={[16, 16]} className="form-row">
            <Col span={24}>
              <FormTextArea
                disabled
                label="Ghi chú"
                name="addressNote"
                placeholder="Nhập ghi chú"
                vertical={true}
              />
            </Col>
          </Row>
        </div>

        <div className="renter__confirm-section row-3">
          <h1 className="renter__confirm-section-title">
            Các dịch vụ được cung cấp
          </h1>
        </div>

        <div className="renter__confirm-section row-4">
          <h1 className="renter__confirm-section-title">Tổng chi phí</h1>
          <Row gutter={[16, 16]} className="form-row">
            <Col span={18}>
              <p>Tiền thuê địa điểm:</p>
              <p>Tiền dịch vụ:</p>
              <p>Các chi phí khác:</p>
            </Col>
            <Col span={6}>
              <p>{props.data.locationPriceStart}</p>
              <p>{props.data.locationPriceStart}</p>
              <p>{props.data.locationPriceStart}</p>
            </Col>
          </Row>
          <Row gutter={[16, 16]} className="form-row">
            <Col span={18}>
              <p>Tổng tiền</p>
            </Col>
            <Col span={6}>
              <p>{props.data.locationPriceStart}</p>
            </Col>
          </Row>
        </div>

        <div className="renter__confirm-section row-5">
          <Button
            htmlType="button"
            onClick={props.onCancel}
            className="button-cancel"
          >
            Hủy
          </Button>
          <Button htmlType="submit" className="button-submit">
            Tiếp theo
          </Button>
        </div>
      </Form>
    </div>
  );
};
