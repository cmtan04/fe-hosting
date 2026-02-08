import { Button, Col, DatePicker, Form, Row } from "antd";
import type { RenterProps } from "../RenterLayout";
import { FormInput } from "../../../components/FormInput/formInput";
import { FormTextArea } from "../../../components/FormTextArea/formTextArea";
import { DATE_FORMAT } from "../../../common/constants/constants";
import { useQuery } from "@tanstack/react-query";
import { LocationEndpoint } from "../../../api/endpoints/location.endpoint";
import { getAllLocationType } from "../../../api/configs/location.config";
import { useEffect, useMemo, useState } from "react";
import type {
  LocationAddressUpdateDto,
  LocationDto,
  LocationTypeDto,
} from "../../../api/dtos/location.dto";
import { useLoading } from "../../../providers/loadingProvider";
import dayjs from "dayjs";
import { ServiceEndpoint } from "../../../api/endpoints/service.endpoint";
import { getAllService } from "../../../api/configs/service.config";
import { ServiceTag } from "../components/ServiceTag/intex";
import { formatCurrencyVND } from "../../../common/contexts/format";

export const ConfirmInformation = (props: RenterProps) => {
  const [form] = Form.useForm();
  const { setLoading } = useLoading();
  const [locationType, setLocationType] = useState<LocationTypeDto>();

  const { data: typeList, isLoading } = useQuery({
    queryKey: [LocationEndpoint.GET_ALL_LOCATION_TYPE],
    queryFn: () => getAllLocationType(),
  });

  const { data: service } = useQuery({
    queryKey: [ServiceEndpoint.GET_ALL_LOCATION_SERVICE],
    queryFn: () => getAllService(),
  });

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  useEffect(() => {
    if (!typeList || !props.data?.typeCode) return;
    const type = typeList.find((item) => item.typeCode === props.data.typeCode);
    setLocationType(type);
  }, [typeList, props.data?.typeCode]);

  const { locationPriceAfterDeal, locationPriceEnd } = useMemo(() => {
    if (!props.data || !props.data.serviceCode) {
      return { locationPriceAfterDeal: 0, locationPriceEnd: 0 };
    }
    const selectedServiceCodes = props.data.serviceCode.map(
      (item) => item.serviceCode,
    );

    let totalDiscount = 0;
    let totalServicePrice = 0;

    selectedServiceCodes.forEach((code) => {
      const serviceData = service?.find((s) => s.serviceCode === code);
      if (serviceData) {
        const price = parseFloat(serviceData.servicePrice);
        const discountPercent = serviceData.serviceDiscount / 100;

        const discountAmount = price * discountPercent;
        totalDiscount += discountAmount;
        totalServicePrice += price;
      }
    });

    const priceAfterDeal = Math.round(totalDiscount);
    const locationStart = Number(props.data.locationPriceStart) || 0;
    const priceEnd = Math.round(
      locationStart + totalServicePrice - priceAfterDeal,
    );

    return {
      locationPriceAfterDeal: priceAfterDeal,
      locationPriceEnd: priceEnd,
    };
  }, [props.data]);

  useEffect(() => {
    if (!props.data) return;
    const addressData: LocationAddressUpdateDto = props.data
      .locationAddress?.[0] as LocationAddressUpdateDto;

    form.setFieldsValue({
      locationName: props.data.locationName,
      locationPriceStart: props.data.locationPriceStart,
      locationDescription: props.data.locationDescription,
      locationNote: props.data.locationNote,

      minTimeLimit: props.data.minTimeLimit
        ? dayjs(props.data.minTimeLimit, DATE_FORMAT)
        : null,
      maxTimeLimit: props.data.maxTimeLimit
        ? dayjs(props.data.maxTimeLimit, DATE_FORMAT)
        : null,

      addressName: addressData?.addressName,
      fullAddress: addressData?.fullAddress,
      addRessPortal: addressData?.addRessPortal,
      addressDistrict: addressData?.addressDistrict,
      addressCity: addressData?.addressCity,
      addressProvince: addressData?.addressProvince,
      addressWard: addressData?.addressWard,
      addressCountry: addressData?.addressCountry,
      addressRegion: addressData?.addressRegion,
      addressDescription: addressData?.addressDescription,
      addressNote: addressData?.addressNote,
    });
  }, [props.data, form]);

  const isServiceSelected = (serviceCode: string) => {
    if (!props.data?.serviceCode) return false;
    if (Array.isArray(props.data.serviceCode)) {
      return props.data.serviceCode.some(
        (item) => item.serviceCode === serviceCode,
      );
    }
    return (props.data.serviceCode as any).serviceCode === serviceCode;
  };

  const onSubmit = () => {
    const payload: LocationDto = {
      typeCode: props.data.typeCode,
      serviceCode: props.data.serviceCode || [],
      locationAddress: props.data.locationAddress || [],
      locationName: props.data.locationName,
      locationLogo: props.data.locationLogo || "",
      locationPriceStart: Number(props.data.locationPriceStart) || 0,
      locationPriceEnd: locationPriceEnd,
      locationPriceAfterDeal: locationPriceAfterDeal,
      locationStatus: props.data.locationStatus || 0,
      ...(props.data.minTimeLimit && {
        minTimeLimit: dayjs(props.data.minTimeLimit).format(DATE_FORMAT),
      }),
      ...(props.data.maxTimeLimit && {
        maxTimeLimit: dayjs(props.data.maxTimeLimit).format(DATE_FORMAT),
      }),
      ...(props.data.hasRent !== undefined && { hasRent: props.data.hasRent }),
      ...(props.data.userRentCd && { userRentCd: props.data.userRentCd }),
      ...(props.data.locationDescription && {
        locationDescription: props.data.locationDescription,
      }),
      ...(props.data.locationNote && { locationNote: props.data.locationNote }),
      ...(props.data.locationRate !== undefined && {
        locationRate: props.data.locationRate,
      }),
    };

    props.onSubmit(payload);
  };

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
            <Col span={4}>
              <img src={locationType?.typeLogo} alt="Logo" className="logo" />
            </Col>
            <Col span={20}>
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
                <Form.Item name="minTimeLimit" label="Từ ngày" vertical={true}>
                  <DatePicker
                    format={DATE_FORMAT}
                    placeholder="Chọn ngày bắt đầu"
                    disabled
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
          <div className="wrapper">
            <h1 className="wrapper__content-title">Dịch vụ miễn phí</h1>
            <Row gutter={[16, 16]} className="wrapper__content">
              {service
                ?.filter((item) => Number(item.servicePrice) === 0)
                .filter((item) => isServiceSelected(item.serviceCode))
                .map((item) => (
                  <div key={item.serviceCode}>
                    <ServiceTag
                      icon={item.serviceLogo}
                      name={item.serviceName}
                      price={item.servicePrice}
                      description={item.serviceDescription}
                      active={true}
                    />
                  </div>
                ))}
            </Row>
            {service?.filter(
              (item) =>
                Number(item.servicePrice) === 0 &&
                isServiceSelected(item.serviceCode),
            ).length === 0 && (
              <p
                style={{
                  color: "#999",
                  fontStyle: "italic",
                  marginTop: "16px",
                }}
              >
                Không có dịch vụ miễn phí nào được chọn
              </p>
            )}
          </div>

          <div className="wrapper">
            <h1 className="wrapper__content-title">Dịch vụ mất phí</h1>
            <Row gutter={[16, 16]} className="wrapper__content">
              {service
                ?.filter((item) => Number(item.servicePrice) > 0)
                .filter((item) => isServiceSelected(item.serviceCode))
                .map((item) => (
                  <div key={item.serviceCode}>
                    <ServiceTag
                      icon={item.serviceLogo}
                      name={item.serviceName}
                      price={item.servicePrice}
                      description={item.serviceDescription}
                      active={true}
                    />
                  </div>
                ))}
            </Row>
            {service?.filter(
              (item) =>
                Number(item.servicePrice) > 0 &&
                isServiceSelected(item.serviceCode),
            ).length === 0 && (
              <p
                style={{
                  color: "#999",
                  fontStyle: "italic",
                  marginTop: "16px",
                }}
              >
                Không có dịch vụ mất phí nào được chọn
              </p>
            )}
          </div>
        </div>

        <div className="renter__confirm-section row-4">
          <h1 className="renter__confirm-section-title">Tổng chi phí</h1>
          <Row gutter={[16, 16]} className="form-row">
            <Col span={18}>
              <p>Tiền thuê địa điểm:</p>
            </Col>
            <Col span={6}>
              <p>{formatCurrencyVND(props.data.locationPriceStart)}</p>
            </Col>
          </Row>
          <Row gutter={[16, 16]} className="form-row">
            <Col span={18}>
              <p>Chi phí dịch vụ:</p>
            </Col>
          </Row>

          {service
            ?.filter((item) => Number(item.servicePrice) > 0)
            .filter((item) => isServiceSelected(item.serviceCode))
            .map((item) => (
              <Row gutter={[16, 16]} className="form-row service-price">
                <Col span={18}>
                  <p>{item.serviceName}</p>
                </Col>
                <Col span={6}>
                  <p>{formatCurrencyVND(Number(item.servicePrice))}</p>
                </Col>
              </Row>
            ))}

          <Row gutter={[16, 16]} className="form-row">
            <Col span={18}>
              <p>Giảm giá:</p>
            </Col>
            <Col span={6}>
              <p>{formatCurrencyVND(locationPriceAfterDeal)}</p>
            </Col>
          </Row>

          <Row gutter={[16, 16]} className="form-row total-price">
            <Col span={18}>
              <p>Tổng tiền</p>
            </Col>
            <Col span={6}>
              <p>{formatCurrencyVND(locationPriceEnd)}</p>
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
