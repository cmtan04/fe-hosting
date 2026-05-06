import { Col, Row, Steps } from "antd";
import { STEP_ITEMS } from "@common/constants/renter";
import type { LocationTypeDto, ServiceDto } from "@api/dtos/location.dto";
import type { CreateLocationDraft } from "@features/locationCreation/types";
import { LocationMediaEditor } from "@components/LocationMediaEditor";
import { ServiceTag } from "@pages/Renter/components/ServiceTag";
import { SummaryPanel } from "@pages/Renter/components/SummaryPanel";
import { StepHeader } from "../../components/StepHeader";
import { StepNavigation } from "../../components/StepNavigation";
import { useConfirmStep } from "../../hooks/useConfirmStep";
import { ConfirmDataSection } from "./components/ConfirmDataSection";
import "./styles.scss";

interface ConfirmStepProps {
  draft: CreateLocationDraft;
  typeList?: LocationTypeDto[];
  services?: ServiceDto[];
  currentStep: number;
  onBack: () => void;
  onCancel: () => void;
  onSubmit: () => void;
  onStepChange: (nextStep: number) => void;
  isSubmitting: boolean;
  isUploading: boolean;
  onUpload: (files: FileList) => void;
  onRemoveMedia: (id: string) => void;
  onSetAvatar: (id: string) => void;
}

export const ConfirmStep = ({
  draft,
  typeList,
  services,
  currentStep,
  onBack,
  onSubmit,
  onCancel,
  onStepChange,
  isSubmitting,
  isUploading,
  onUpload,
  onRemoveMedia,
  onSetAvatar,
}: ConfirmStepProps) => {
  const {
    selectedServices,
    basicData,
    addressData,
    summaryRows,
  } = useConfirmStep({
    draft,
    typeList,
    services,
  });

  return (
    <div className="renter">
      <StepHeader title="Xác nhận thông tin" onCancel={onCancel} />
      <Steps
        current={currentStep}
        items={STEP_ITEMS}
        className="renter-steps"
        onChange={onStepChange}
      />
      <Row gutter={[16, 16]} className="renter-confirmGrid">
        <Col span={16}>
          <ConfirmDataSection
            label={basicData.label}
            items={basicData.value}
          />
          <ConfirmDataSection
            label={addressData.label}
            items={addressData.value}
          />
        </Col>
        <Col span={8}>
          <div className="renter-sectionBand">
            <div className="renter-sectionBand-header">
              <h2>Tập đính kèm</h2>
            </div>
            <LocationMediaEditor
              media={draft.basicInfo.media}
              isUploading={isUploading}
              inputId="upload-basic-media"
              emptyLabel="Chưa tải lên tập đính kèm nào"
              onUpload={onUpload}
              onRemove={onRemoveMedia}
              onSetAvatar={onSetAvatar}
            />
          </div>
          <SummaryPanel
            title="Chi phí và dịch vụ"
            rows={summaryRows}
          />
          <div className="renter__confirm-section row-3">
            <h1 className="renter__confirm-section-title">Dịch vụ đã chọn</h1>
            <div className="wrapper__content">
              {selectedServices.map((item) => (
                <ServiceTag
                  key={`${item.serviceCode}-${item.serviceName}`}
                  icon={item.serviceLogo}
                  name={`${item.serviceName}${item.unit === "DAILY" ? " - Theo ngày" : " - Trọn gói"} x${item.quantity}`}
                  price={item.servicePrice}
                  description={item.serviceDescription}
                  active={true}
                />
              ))}
            </div>
          </div>
        </Col>
      </Row>

      <StepNavigation
        onBack={onBack}
        nextText="Đăng phòng"
        isSubmitting={isSubmitting}
        submitHtmlType="button"
        onNext={onSubmit}
      />
    </div>
  );
};
