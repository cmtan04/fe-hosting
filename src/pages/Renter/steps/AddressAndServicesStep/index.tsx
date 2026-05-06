import { Col, Form, Row, Steps } from "antd";
import type {
  LocationServiceSelectionDto,
  ServiceDto,
} from "@api/dtos/location.dto";
import { STEP_ITEMS } from "@common/constants/renter";
import type {
  AddressDraftPatch,
  AddressAndServicesStepSubmitValue,
} from "@common/types/renter";
import { MapViewCommon } from "@components/MapViewCommon";
import type { CreateLocationDraft } from "@features/locationCreation/types";
import { ServiceList } from "@pages/Renter/components/ServiceList";
import { StepHeader } from "../../components/StepHeader";
import { StepNavigation } from "../../components/StepNavigation";
import { useAddressAndServicesStep } from "../../hooks/useAddressAndServicesStep";
import { AddressFields } from "./components/AddressFields";
import { ServiceComposer } from "./components/ServiceComposer";
import "./styles.scss";

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
  const {
    form,
    mapData,
    searchState,
    resolveCoordinates,
    initialFormValues,
    selectedServices,
    serviceQuery,
    customService,
    serviceOptions,
    setServiceQuery,
    setCustomService,
    updateSelectedService,
    removeSelectedService,
    addCustomService,
    handleServiceSelectChange,
    handleCreateNewService,
    handleFormValuesChange,
    handleStepChange,
    handleFinish,
  } = useAddressAndServicesStep({
    draft,
    services,
    onNext,
    onStepChange,
    onAddressDraftChange,
    onServicesDraftChange,
  });

  return (
    <div className="renter">
      <StepHeader title="Địa chỉ & Tiện ích" onCancel={onCancel} />
      <Steps
        current={currentStep}
        items={STEP_ITEMS}
        className="renter-steps"
        onChange={handleStepChange}
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
            onFinish={handleFinish}
            onValuesChange={(_, allValues) => handleFormValuesChange(allValues)}
          >
            <AddressFields />

            <ServiceComposer
              customService={customService}
              serviceQuery={serviceQuery}
              serviceOptions={serviceOptions}
              setServiceQuery={setServiceQuery}
              setCustomService={setCustomService}
              handleCreateNewService={handleCreateNewService}
              handleServiceSelectChange={handleServiceSelectChange}
              addCustomService={addCustomService}
            />

            <div className="wrapper renter-sectionBand">
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

            <StepNavigation onBack={onBack} />
          </Form>
        </Col>
      </Row>
    </div>
  );
};
