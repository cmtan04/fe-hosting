import { Button, Checkbox, Col, Form, Row, Select, Steps } from "antd";
import { useMemo, useState } from "react";
import type {
  LocationServiceSelectionDto,
  ServiceDto,
  ServicePricingType,
} from "../../../../api/dtos/location.dto";
import icnClear from "../../../../assets/svg/icn-clear.svg";
import { STEP_ITEMS, DEFAULT_CUSTOM_SERVICE_STATE } from "../../../../common/constants/renter";
import type {
  AddressDraftPatch,
  AddressAndServicesStepSubmitValue,
  CustomServiceComposerState,
} from "../../../../common/types/renter";
import { FormInput } from "../../../../components/FormInput/formInput";
import { FormTextArea } from "../../../../components/FormTextArea/formTextArea";
import { MapViewCommon } from "../../../../components/MapViewCommon";
import type { CreateLocationDraft } from "../../../../features/locationCreation/types";
import {
  createCatalogServiceSelection,
  createCustomServiceSelection,
  filterAvailableCatalogServices,
} from "../../../../features/locationCreation/services";
import { useCreateService } from "../../../../features/locationCreation/useCreateService";
import { useMapAddressPicker } from "../../../../features/mapAddress/useMapAddressPicker";
import { useAddressDraftController } from "../../hooks/useAddressDraftController";
import { ServiceList } from "../../components/ServiceList";
import "./addressAndServicesStep.scss";

interface AddressAndServicesStepProps {
  draft: CreateLocationDraft;
  services?: ServiceDto[];
  currentStep: number;
  onBack: () => void;
  onCancel: () => void;
  onNext: (value: AddressAndServicesStepSubmitValue) => void;
  onStepChange: (nextStep: number) => void;
  onAddressDraftChange: (patch: AddressDraftPatch) => void;
  onServicesDraftChange: (services: LocationServiceSelectionDto[]) => void;
}

export const AddressAndServicesStep = ({
  draft,
  services,
  currentStep,
  onBack,
  onCancel,
  onNext,
  onStepChange,
  onAddressDraftChange,
  onServicesDraftChange,
}: AddressAndServicesStepProps) => {
  const [form] = Form.useForm();
  const { mutate: createService } = useCreateService();
  const {
    initialFormValues,
    handleMapAddressResolved,
    handleFormValuesChange,
    buildSubmitValue,
  } = useAddressDraftController({
    form,
    draftAddress: draft.address,
    onAddressDraftChange,
  });
  const { mapData, resolveCoordinates, searchState } = useMapAddressPicker({
    initialAddress: draft.address,
    hasSearch: true,
    onAddressResolved: handleMapAddressResolved,
  });
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

  const getServiceOptions = useMemo(() => {
    if (filteredCatalog.length > 0) {
      return filteredCatalog.map((service: ServiceDto) => ({
        value: service.serviceCode,
        label: `${service.serviceName}`,
      }));
    }

    if (serviceQuery.trim()) {
      return [
        {
          value: "__create_new__",
          label: `Tạo mới: ${serviceQuery}`,
        },
      ];
    }

    return [];
  }, [filteredCatalog, serviceQuery]);

  const updateSelectedService = (
    index: number,
    value: Partial<LocationServiceSelectionDto>,
  ) => {
    const nextServices = selectedServices.map((service, serviceIndex) =>
      serviceIndex === index ? { ...service, ...value } : service,
    );
    setSelectedServices(nextServices);
    onServicesDraftChange(nextServices);
  };

  const removeSelectedService = (index: number) => {
    const nextServices = selectedServices.filter(
      (_, serviceIndex) => serviceIndex !== index,
    );
    setSelectedServices(nextServices);
    onServicesDraftChange(nextServices);
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
        unit: customService.unit,
        basePrice: customService.basePrice,
        quantity: customService.quantity,
      }),
    ];
    setSelectedServices(nextServices);
    onServicesDraftChange(nextServices);
    setCustomService(DEFAULT_CUSTOM_SERVICE_STATE);
  };

  return (
    <div className="renter">
      <div className="renter__fillAddress-header">
        <h1 className="header-title">Địa chỉ & Tiện ích</h1>
        <button
          className="header-close"
          onClick={onCancel}
          type="button"
          aria-label="Close"
        >
          <img
            src={icnClear}
            alt="X"
          />
        </button>
      </div>
      <Steps
        current={currentStep}
        items={STEP_ITEMS}
        className="renter-steps"
        onChange={(nextStep) => {
          onAddressDraftChange(buildSubmitValue(form.getFieldsValue(true)));
          onServicesDraftChange(selectedServices);
          onStepChange(nextStep);
        }}
      />
      <Row gutter={[24, 24]} className="renter__fillAddress-body">
        <Col span={12}>
          <div className="renter-sectionBand renter-sectionBand--sticky">
            <MapViewCommon
              center={{
                lat: mapData.lat,
                lng: mapData.long,
              }}
              searchState={searchState}
              onCoordinateSelect={resolveCoordinates}
            />
          </div>
        </Col>
        <Col span={12}>
          <Form
            form={form}
            layout="vertical"
            initialValues={initialFormValues}
            onFinish={(values) =>
              onNext({
                ...buildSubmitValue(values),
                services: selectedServices,
              })
            }
            onValuesChange={(_, allValues) => handleFormValuesChange(allValues)}
          >
            <div className="renter-sectionBand">
              <div className="renter-sectionBand-header">
                <h2>Thông tin địa chỉ</h2>
                <p>
                  Chọn vị trí trên bản đồ để tự động điền địa chỉ đầy đủ và các
                  trường địa lý liên quan. Sau đó, bổ sung thông tin chi tiết và
                  mô tả để khách dễ dàng tìm thấy bạn hơn nhé.
                </p>
              </div>
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <FormTextArea
                    label="Thông tin chi tiết"
                    name="addressDetail"
                    placeholder="Ví dụ: Số nhà, tòa, tầng, căn hộ"
                    vertical={true}
                  />
                </Col>
                <Col span={24}>
                  <FormTextArea
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
                    label="Phường / Xã "
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
              </div>

              <div>
                <label htmlFor="service-select" className="composer-label">
                  Thêm dịch vụ mới
                </label>
              </div>
              <Row gutter={[12, 12]}>
                <Col span={18}>
                  <Select
                    id="service-select"
                    showSearch
                    filterOption={false}
                    value={customService.name || undefined}
                    options={getServiceOptions}
                    placeholder=" Thêm dịch vụ"
                    style={{ width: "100%" }}
                    onSearch={(value) => setServiceQuery(value)}
                    notFoundContent={
                      serviceQuery.trim() ? (
                        <div
                          onClick={() => {
                            createService(
                              { name: serviceQuery, category: "GENERAL" },
                              {
                                onSuccess: (newService) => {
                                  const nextServices = [
                                    ...selectedServices,
                                    createCatalogServiceSelection(newService),
                                  ];
                                  setSelectedServices(nextServices);
                                  onServicesDraftChange(nextServices);
                                  setServiceQuery("");
                                  setCustomService(
                                    DEFAULT_CUSTOM_SERVICE_STATE,
                                  );
                                },
                              },
                            );
                          }}
                          style={{ padding: "8px 12px", cursor: "pointer" }}
                        >
                          Tạo mới: {serviceQuery}
                        </div>
                      ) : null
                    }
                    onChange={(value) => {
                      if (value === "__create_new__") {
                        createService(
                          { name: serviceQuery, category: "GENERAL" },
                          {
                            onSuccess: (newService) => {
                              const nextServices = [
                                ...selectedServices,
                                createCatalogServiceSelection(newService),
                              ];
                              setSelectedServices(nextServices);
                              onServicesDraftChange(nextServices);
                              setServiceQuery("");
                              setCustomService(DEFAULT_CUSTOM_SERVICE_STATE);
                            },
                          },
                        );
                      } else {
                        const selectedService = services?.find(
                          (service) => service.serviceCode === value,
                        );

                        setCustomService((prev) => ({
                          ...prev,
                          name: selectedService?.serviceName ?? String(value),
                        }));
                      }
                    }}
                  />
                </Col>
                <Col span={6}>
                  <Checkbox
                    checked={customService.chargeType === "FREE"}
                    onChange={(event) =>
                      setCustomService((prev) => ({
                        ...prev,
                        chargeType: event.target.checked ? "FREE" : "PAID",
                      }))
                    }
                  >
                    {" "}
                    Miễn phí
                  </Checkbox>
                </Col>
                {customService.chargeType === "PAID" && (
                  <>
                    <Col span={10}>
                      <label
                        htmlFor="pricing-type"
                        className="composer-subLabel"
                      >
                        Kiểu tính giá
                      </label>
                      <Select
                        id="pricing-type"
                        value={customService.unit}
                        onChange={(value) =>
                          setCustomService((prev) => ({
                            ...prev,
                            unit: value as ServicePricingType,
                          }))
                        }
                        options={[
                          { value: "FULL", label: "Trọn gói" },
                          { value: "DAILY", label: "Theo ngày" },
                        ]}
                      />
                    </Col>
                    <Col span={14}>
                      <label htmlFor="base-price" className="composer-subLabel">
                        Giá áp dụng(vnđ)
                      </label>
                      <input
                        id="base-price"
                        className="renter-nativeInput"
                        value={customService.basePrice}
                        onChange={(event) =>
                          setCustomService((prev) => ({
                            ...prev,
                            basePrice: event.target.value,
                          }))
                        }
                        placeholder="0"
                      />
                    </Col>
                  </>
                )}
                <Col span={23}>
                  <label
                    htmlFor="service-description"
                    className="composer-subLabel"
                  >
                    Mô tả
                  </label>
                  <textarea
                    id="service-description"
                    className="renter-nativeTextarea"
                    value={customService.description}
                    onChange={(event) =>
                      setCustomService((prev) => ({
                        ...prev,
                        description: event.target.value,
                      }))
                    }
                    placeholder="Mô tả ngắn về dịch vụ"
                    style={{ width: "100%" }}
                  />
                </Col>
              </Row>
              <div className="composer-action form-action">
                <Button
                  htmlType="button"
                  className="button-submit"
                  onClick={addCustomService}
                >
                  Thêm dịch vụ mới
                </Button>
              </div>

              <div className="wrapper">
                <h1 className="body__section-2-content-title">
                  Danh sách đã chọn
                </h1>
                <ServiceList
                  selectedServices={selectedServices}
                  services={services}
                  updateSelectedService={updateSelectedService}
                  removeSelectedService={removeSelectedService}
                />
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
