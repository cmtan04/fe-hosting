import { Button, Col, Form, Row } from "antd";
import { useState } from "react";
import { FormInput } from "../../../components/FormInput/formInput";
import { FormTextArea } from "../../../components/FormTextArea/formTextArea";
import { MapViewCommon } from "../../../components/MapViewCommon";

import type { RenterProps } from "../RenterLayout";
import "../renterLayout.scss";
import {
  MapAddressMapper,
  type MapAddressDto,
} from "../../../api/dtos/map.dto";

export const FillAddress = (props: RenterProps) => {
  const [form] = Form.useForm();

  const [location, setLocation] = useState<MapAddressDto>(
    MapAddressMapper.createEmpty(21.0285, 105.8542),
  );

  const handleMapClick = (data: MapAddressDto) => {
    setLocation(data);

    form.setFieldsValue({
      fullAddress: data.fullAddress,
      addressWard: data.addressWard,
      addressDistrict: data.addressDistrict,
      addressCity: data.addressCity,
      addressProvince: data.addressProvince,
      addressCountry: data.addressCountry,
      addressPostal: data.addressPostal,
      addressRegion: data.addressRegion,
    });
  };

  const onSubmit = () => {
    const formValues = form.getFieldsValue();

    const payload = {
      addressName: formValues.addressName,
      fullAddress: location.fullAddress,
      addressWard: formValues.addressWard || location.addressWard,
      addressDistrict: formValues.addressDistrict || location.addressDistrict,
      addressCity: formValues.addressCity || location.addressCity,
      addressProvince: formValues.addressProvince || location.addressProvince,
      addressCountry: formValues.addressCountry || location.addressCountry,
      addressPostal: formValues.addressPostal || location.addressPostal,
      addressLat: location.lat,
      addressLong: location.long,
      addressRegion: formValues.addressRegion || location.addressRegion,
      addressDescription: formValues.addressDescription,
      addressNote: formValues.addressNote,
    };

    props.onSubmit(payload);
  };

  return (
    <div className="renter__fillAddress">
      <div className="renter__fillAddress-header">
        <h1 className="header-title">Thông tin địa chỉ không gian của bạn</h1>
        <p className="header-subTitle">
          Vui lòng cung cấp thông tin về địa chỉ không gian mà bạn cung cấp.
          Điều này giúp mọi người tìm kiếm không gian của bạn dễ dàng hơn.
        </p>
      </div>
      <Row gutter={[24, 24]} className="renter__fillAddress-body">
        <Col className="body__col-left" span={12}>
          <MapViewCommon
            data={location}
            hasInputSearch={true}
            onMapClick={handleMapClick}
          />
        </Col>
        <Col className="body__col-right" span={12}>
          <Form
            form={form}
            onFinish={onSubmit}
            className="renter__fillAdress-form"
          >
            <Row gutter={[16, 16]} className="form-row">
              <Col span={6}>
                <FormInput
                  label="Tên địa chỉ"
                  name="addressName"
                  placeholder="Nhập tên địa chỉ"
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
              <Col span={18}>
                <FormInput
                  label="Địa chỉ chi tiết"
                  name="fullAddress"
                  placeholder="Nhập địa chỉ chi tiết"
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
            </Row>

            <Row gutter={[16, 16]} className="form-row">
              <Col span={12}>
                <FormInput
                  label="Mã bưu chính"
                  name="addressPostal"
                  placeholder="Nhập mã bưu chính."
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
              <Col span={12}>
                <FormInput
                  label="Phường / Xã"
                  name="addressWard"
                  placeholder="Nhập phường / xã."
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
            </Row>

            <Row gutter={[16, 16]} className="form-row">
              <Col span={12}>
                <FormInput
                  label="Quận / Huyện"
                  name="addressDistrict"
                  placeholder="Nhập quận / huyện"
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
              <Col span={12}>
                <FormInput
                  label="Thành phố"
                  name="addressCity"
                  placeholder="Nhập thành phố."
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
            </Row>

            <Row gutter={[16, 16]} className="form-row">
              <Col span={12}>
                <FormInput
                  label="Tỉnh"
                  name="addressProvince"
                  placeholder="Nhập tỉnh"
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
              <Col span={12}>
                <FormInput
                  label="Quốc gia"
                  name="addressCountry"
                  placeholder="Nhập quốc giá"
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
            </Row>

            <Row gutter={[16, 16]} className="form-row">
              <Col span={24}>
                <FormInput
                  label="Vùng"
                  name="addressRegion"
                  placeholder="Nhập vùng"
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
            </Row>

            <Row gutter={[16, 16]} className="form-row">
              <Col span={24}>
                <FormTextArea
                  label="Mô tả"
                  name="addressDescription"
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
            </Row>

            <Row gutter={[16, 16]} className="form-row">
              <Col span={24}>
                <FormTextArea
                  label="Ghi chú"
                  name="addressNote"
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

            <div className="form-action">
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
        </Col>
      </Row>
    </div>
  );
};
