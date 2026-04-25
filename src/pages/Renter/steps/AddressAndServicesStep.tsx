import { Button, Col, Form, Row, Select, Steps } from "antd";
import { useMemo, useState } from "react";
import {
  MapAddressMapper,
  type MapAddressDto,
} from "../../../api/dtos/map.dto";
import type {
  LocationServiceSelectionDto,
  ServiceDto,
  ServicePricingType,
} from "../../../api/dtos/location.dto";
import { FormInput } from "../../../components/FormInput/formInput";
import { FormTextArea } from "../../../components/FormTextArea/formTextArea";
import { MapViewCommon } from "../../../components/MapViewCommon";
import {
  buildLocationFullAddress,
  mapDraftAddressToMapData,
  mapMapAddressToDraftAddress,
} from "../../../features/locationCreation/address";
import {
  createCatalogServiceSelection,
  createCustomServiceSelection,
  DEFAULT_SERVICE_PRICING_TYPE,
  filterAvailableCatalogServices,
  getServiceDraftPrice,
  isCatalogServiceSelection,
  isServicePaid,
} from "../../../features/locationCreation/services";
import { ServiceTag } from "../components/ServiceTag/intex";
import { STEP_ITEMS } from "./constants";
import type {
  AddressAndServicesStepProps,
  CustomServiceComposerState,
} from "./types";
import icnClear from "../../../assets/svg/icn-clear.svg";

const DEFAULT_CUSTOM_SERVICE_STATE: CustomServiceComposerState = {
  name: "",
  description: "",
  chargeType: "FREE",
  pricingType: DEFAULT_SERVICE_PRICING_TYPE,
  price: "",
};

export const AddressAndServicesStep = ({
  draft,
  services,
  currentStep,
  onBack,
  onCancel,
  onNext,
  onStepChange,
  onDraftChange,
}: AddressAndServicesStepProps) => {
  const [form] = Form.useForm();
  const [location, setLocation] = useState<MapAddressDto>(
    MapAddressMapper.createEmpty(
      draft.address.latitude,
      draft.address.longitude,
    ),
  );
  const [selectedServices, setSelectedServices] = useState<
    LocationServiceSelectionDto[]
  >(draft.services);
  const [serviceQuery, setServiceQuery] = useState("");
  const [customService, setCustomService] =
    useState<CustomServiceComposerState>(DEFAULT_CUSTOM_SERVICE_STATE);

  const filteredCatalog = useMemo(
    () =>
      filterAvailableCatalogServices(services, selectedServices, serviceQuery),
    [selectedServices, serviceQuery, services],
  );

  const buildAddressPatch = (
    formValues = form.getFieldsValue(true),
    nextLocation = location,
  ) => {
    const ward = formValues.ward ?? "";
    const city = formValues.city ?? "";
    const country = formValues.country ?? "";
    const addressDetail = formValues.addressDetail ?? "";
    const fullAddress = buildLocationFullAddress({
      addressDetail,
      ward,
      city,
      country,
    });

    return {
      addressDetail,
      fullAddress,
      ward,
      city,
      country,
      region: city,
      description: formValues.description ?? "",
      note: formValues.note ?? "",
      latitude: Number(
        nextLocation.lat ?? nextLocation.addressLat ?? draft.address.latitude,
      ),
      longitude: Number(
        nextLocation.long ??
          nextLocation.addressLong ??
          draft.address.longitude,
      ),
    };
  };

  const syncDraft = (
    formValues = form.getFieldsValue(true),
    nextLocation = location,
    nextServices = selectedServices,
  ) => {
    onDraftChange(buildAddressPatch(formValues, nextLocation), nextServices);
  };

  const addCatalogService = (serviceCode: string) => {
    const selectedCatalogService = services?.find(
      (service) => service.serviceCode === serviceCode,
    );

    if (!selectedCatalogService) {
      return;
    }

    const nextServices = [
      ...selectedServices,
      createCatalogServiceSelection(selectedCatalogService),
    ];
    setSelectedServices(nextServices);
    syncDraft(form.getFieldsValue(true), location, nextServices);
    setServiceQuery("");
  };

  const updateSelectedService = (
    index: number,
    value: Partial<LocationServiceSelectionDto>,
  ) => {
    const nextServices = selectedServices.map((service, serviceIndex) =>
      serviceIndex === index ? { ...service, ...value } : service,
    );
    setSelectedServices(nextServices);
    syncDraft(form.getFieldsValue(true), location, nextServices);
  };

  const removeSelectedService = (index: number) => {
    const nextServices = selectedServices.filter(
      (_, serviceIndex) => serviceIndex !== index,
    );
    setSelectedServices(nextServices);
    syncDraft(form.getFieldsValue(true), location, nextServices);
  };

  const addCustomService = () => {
    if (!customService.name.trim()) {
      return;
    }

    const nextServices = [
      ...selectedServices,
      createCustomServiceSelection({
        name: customService.name,
        description: customService.description,
        chargeType: customService.chargeType,
        pricingType: customService.pricingType,
        price: customService.price,
      }),
    ];
    setSelectedServices(nextServices);
    syncDraft(form.getFieldsValue(true), location, nextServices);
    setCustomService(DEFAULT_CUSTOM_SERVICE_STATE);
  };

  const handleMapSelect = (value: MapAddressDto) => {
    setLocation(value);
    const nextAddress = mapMapAddressToDraftAddress(value, {
      ...draft.address,
      addressDetail:
        form.getFieldValue("addressDetail") ?? draft.address.addressDetail,
    });

    form.setFieldsValue({
      addressDetail: nextAddress.addressDetail,
      fullAddress: nextAddress.fullAddress,
      ward: nextAddress.ward,
      city: nextAddress.city,
      country: nextAddress.country,
      region: nextAddress.region,
    });

    syncDraft(
      {
        ...form.getFieldsValue(true),
        addressDetail: nextAddress.addressDetail,
        fullAddress: nextAddress.fullAddress,
        ward: nextAddress.ward,
        city: nextAddress.city,
        country: nextAddress.country,
        region: nextAddress.region,
      },
      value,
    );
  };

  return (
    <div className="renter">
      <div className="renter__fillAddress-header">
        <h1 className="header-title">Địa chỉ & Tiện ích</h1>
        <img
          src={icnClear}
          className="header-close"
          alt="X"
          onClick={onCancel}
        />
      </div>
      <Steps
        current={currentStep}
        items={STEP_ITEMS}
        className="renter-steps"
        onChange={(nextStep) => {
          syncDraft();
          onStepChange(nextStep);
        }}
      />
      <Row gutter={[24, 24]} className="renter__fillAddress-body">
        <Col span={12}>
          <div className="renter-sectionBand renter-sectionBand--sticky">
            <MapViewCommon
              data={{
                ...location,
                ...mapDraftAddressToMapData(draft.address),
              }}
              hasInputSearch={true}
              onMapClick={handleMapSelect}
            />
          </div>
        </Col>
        <Col span={12}>
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              addressDetail: draft.address.addressDetail,
              fullAddress: draft.address.fullAddress,
              ward: draft.address.ward,
              city: draft.address.city,
              country: draft.address.country,
              region: draft.address.region,
              description: draft.address.description,
              note: draft.address.note,
            }}
            onFinish={(values) =>
              onNext({
                ...buildAddressPatch(values, location),
                services: selectedServices,
              })
            }
            onValuesChange={(changedValues, allValues) => {
              if ("addressDetail" in changedValues) {
                form.setFieldValue(
                  "fullAddress",
                  buildLocationFullAddress({
                    addressDetail: allValues.addressDetail,
                    ward: allValues.ward,
                    city: allValues.city,
                    country: allValues.country,
                  }),
                );
              }
              syncDraft(allValues);
            }}
          >
            <div className="renter-sectionBand">
              <div className="renter-sectionBand-header">
                <h2>Thông tin địa chỉ</h2>
                <p>
                  Người dùng phải chọn vị trí từ bản đồ. Hệ thống sẽ tự chuẩn
                  hóa địa chỉ và tọa độ để dùng cho search và điều hướng.
                </p>
              </div>
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <FormInput
                    label="Thông tin chi tiết"
                    name="addressDetail"
                    placeholder="Ví dụ: Số nhà, tòa, tầng, căn hộ"
                    vertical={true}
                  />
                </Col>
                <Col span={24}>
                  <FormInput
                    label="Địa chỉ đầy đủ"
                    name="fullAddress"
                    placeholder="Được tạo tự động từ bản đồ"
                    vertical={true}
                    readOnly={true}
                    disabled={true}
                    formItemProps={{
                      rules: [
                        {
                          required: true,
                          message: "Hãy chọn vị trí trên map.",
                        },
                      ],
                    }}
                  />
                </Col>
                <Col span={12}>
                  <FormInput
                    label="Phường / Xã / Khu trung gian"
                    name="ward"
                    vertical={true}
                    readOnly={true}
                    disabled={true}
                  />
                </Col>
                <Col span={12}>
                  <FormInput
                    label="Tỉnh / Thành phố"
                    name="city"
                    vertical={true}
                    readOnly={true}
                    disabled={true}
                    formItemProps={{
                      rules: [
                        {
                          required: true,
                          message: "Hãy chọn vị trí trên map.",
                        },
                      ],
                    }}
                  />
                </Col>
                <Col span={12}>
                  <FormInput
                    label="Quốc gia"
                    name="country"
                    vertical={true}
                    readOnly={true}
                    disabled={true}
                  />
                </Col>
                <Col span={12}>
                  <FormInput
                    label="Khu vực"
                    name="region"
                    vertical={true}
                    readOnly={true}
                    disabled={true}
                  />
                </Col>
                <Col span={24}>
                  <FormTextArea
                    label="Mô tả địa chỉ"
                    name="description"
                    placeholder="Nhập mô tả"
                    vertical={true}
                  />
                </Col>
                <Col span={24}>
                  <FormTextArea
                    label="Ghi chú địa chỉ"
                    name="note"
                    placeholder="Nhập ghi chú"
                    vertical={true}
                  />
                </Col>
              </Row>
            </div>

            <div className="body__section-2 renter-sectionBand">
              <div className="renter-sectionBand-header">
                <h2>Tiện ích và dịch vụ</h2>
                <p>
                  Tìm trong kho dịch vụ miễn phí có sẵn. Nếu không có, thêm mới
                  ngay tại đây và tự khai báo mức phí theo ngày hoặc trọn gói.
                </p>
              </div>

              <div className="renter-serviceComposer">
                <div className="renter-serviceComposer-search">
                  <label className="composer-label">
                    Tìm trong kho dịch vụ
                  </label>
                  <Select
                    showSearch
                    value={undefined}
                    searchValue={serviceQuery}
                    onSearch={setServiceQuery}
                    onSelect={(value) => addCatalogService(String(value))}
                    placeholder="Nhập tên dịch vụ miễn phí có sẵn"
                    filterOption={false}
                    options={filteredCatalog.map((service: ServiceDto) => ({
                      value: service.serviceCode,
                      label: `${service.serviceName} · Miễn phí`,
                    }))}
                  />
                </div>

                <div className="renter-serviceComposer-custom">
                  <label className="composer-label">Thêm dịch vụ mới</label>
                  <Row gutter={[12, 12]}>
                    <Col span={12}>
                      <label className="composer-subLabel">Tên dịch vụ</label>
                      <input
                        className="renter-nativeInput"
                        value={customService.name}
                        onChange={(event) =>
                          setCustomService((prev) => ({
                            ...prev,
                            name: event.target.value,
                          }))
                        }
                        placeholder="Ví dụ: Thu gom rác"
                      />
                    </Col>
                    <Col span={12}>
                      <label className="composer-subLabel">Tính chất phí</label>
                      <Select
                        value={customService.chargeType}
                        onChange={(value) =>
                          setCustomService((prev) => ({
                            ...prev,
                            chargeType: value as "FREE" | "PAID",
                          }))
                        }
                        options={[
                          { value: "FREE", label: "Miễn phí" },
                          { value: "PAID", label: "Mất phí" },
                        ]}
                      />
                    </Col>
                    <Col span={12}>
                      <label className="composer-subLabel">Kiểu tính giá</label>
                      <Select
                        value={customService.pricingType}
                        onChange={(value) =>
                          setCustomService((prev) => ({
                            ...prev,
                            pricingType: value as ServicePricingType,
                          }))
                        }
                        options={[
                          { value: "FULL", label: "Trọn gói" },
                          { value: "DAILY", label: "Theo ngày" },
                        ]}
                      />
                    </Col>
                    <Col span={16}>
                      <label className="composer-subLabel">Mô tả</label>
                      <textarea
                        className="renter-nativeTextarea"
                        value={customService.description}
                        onChange={(event) =>
                          setCustomService((prev) => ({
                            ...prev,
                            description: event.target.value,
                          }))
                        }
                        placeholder="Mô tả ngắn về dịch vụ"
                      />
                    </Col>
                    <Col span={8}>
                      <label className="composer-subLabel">Giá áp dụng</label>
                      <input
                        className="renter-nativeInput"
                        value={customService.price}
                        onChange={(event) =>
                          setCustomService((prev) => ({
                            ...prev,
                            price: event.target.value,
                          }))
                        }
                        placeholder="0"
                        disabled={customService.chargeType === "FREE"}
                        inputMode="numeric"
                      />
                    </Col>
                  </Row>
                  <div className="composer-action">
                    <Button
                      htmlType="button"
                      className="button-cancel"
                      onClick={addCustomService}
                    >
                      Thêm dịch vụ mới
                    </Button>
                  </div>
                </div>
              </div>

              <div className="wrapper">
                <h1 className="body__section-2-content-title">
                  Danh sách đã chọn
                </h1>
                <div className="renter-selectedServices">
                  {selectedServices.map((service, index) => {
                    const catalogService = services?.find(
                      (item) => item.serviceCode === service.serviceCode,
                    );
                    const serviceName =
                      service.name ||
                      catalogService?.serviceName ||
                      service.serviceCode ||
                      "Dịch vụ";
                    const serviceDescription =
                      service.description || catalogService?.serviceDescription;
                    const servicePrice = getServiceDraftPrice(
                      service,
                      catalogService?.servicePrice,
                    );
                    const paid = isServicePaid(
                      service,
                      catalogService?.servicePrice,
                    );
                    const isCatalogService = isCatalogServiceSelection(service);

                    return (
                      <div
                        key={`${service.serviceCode ?? service.name}-${index}`}
                        className="renter-selectedServiceRow"
                      >
                        <div className="service-meta">
                          <ServiceTag
                            icon={catalogService?.serviceLogo ?? ""}
                            name={serviceName}
                            price={String(servicePrice)}
                            description={serviceDescription ?? ""}
                            active={true}
                          />
                        </div>
                        <div className="service-config">
                          {isCatalogService ? (
                            <div className="config-note">
                              <label className="composer-subLabel">
                                Nguồn dịch vụ
                              </label>
                              <p>Kho dịch vụ chỉ gồm mục miễn phí.</p>
                            </div>
                          ) : (
                            <>
                              <div className="config-field">
                                <label className="composer-subLabel">
                                  Tính chất phí
                                </label>
                                <Select
                                  value={paid ? "PAID" : "FREE"}
                                  onChange={(value) =>
                                    updateSelectedService(index, {
                                      customPrice:
                                        value === "FREE"
                                          ? 0
                                          : Math.max(
                                              getServiceDraftPrice(service, 0),
                                              0,
                                            ),
                                    })
                                  }
                                  options={[
                                    { value: "FREE", label: "Miễn phí" },
                                    { value: "PAID", label: "Mất phí" },
                                  ]}
                                />
                              </div>
                              <div className="config-field">
                                <label className="composer-subLabel">
                                  Kiểu giá
                                </label>
                                <Select
                                  value={
                                    service.pricingType ??
                                    DEFAULT_SERVICE_PRICING_TYPE
                                  }
                                  onChange={(value) =>
                                    updateSelectedService(index, {
                                      pricingType: value as ServicePricingType,
                                    })
                                  }
                                  options={[
                                    { value: "FULL", label: "Trọn gói" },
                                    { value: "DAILY", label: "Theo ngày" },
                                  ]}
                                />
                              </div>
                              <div className="config-field">
                                <label className="composer-subLabel">
                                  Giá áp dụng
                                </label>
                                <input
                                  className="renter-nativeInput"
                                  value={String(servicePrice)}
                                  disabled={!paid}
                                  onChange={(event) =>
                                    updateSelectedService(index, {
                                      customPrice: Number(
                                        event.target.value || 0,
                                      ),
                                    })
                                  }
                                  placeholder="0"
                                  inputMode="numeric"
                                />
                              </div>
                            </>
                          )}
                          <Button
                            htmlType="button"
                            className="renter-inlineDanger"
                            onClick={() => removeSelectedService(index)}
                          >
                            Xoa
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="form-action">
              <Button
                htmlType="button"
                onClick={onBack}
                className="button-cancel"
              >
                Quay lại
              </Button>
              <Button htmlType="submit" className="button-submit">
                Tiếp tục
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </div>
  );
};
