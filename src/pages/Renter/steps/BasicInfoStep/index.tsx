import { Col, Form, Row, Steps } from "antd";
import { STEP_ITEMS } from "@common/constants/renter";
import type { LocationTypeDto } from "@api/dtos/location.dto";
import { LocationMediaEditor } from "@components/LocationMediaEditor";
import { SummaryPanel } from "@pages/Renter/components/SummaryPanel";
import type { CreateLocationDraft } from "@features/locationCreation/types";
import type {
  BasicInfoDraftPatch,
  BasicInfoStepSubmitValue,
} from "@common/types/renter";
import { StepHeader } from "../../components/StepHeader";
import { StepNavigation } from "../../components/StepNavigation";
import { useBasicInfoStep } from "../../hooks/useBasicInfoStep";
import { LocationTypeSelector } from "./components/LocationTypeSelector";
import { BasicInfoFields } from "./components/BasicInfoFields";
import "./styles.scss";

interface BasicInfoStepProps {
  draft: CreateLocationDraft;
  typeList?: LocationTypeDto[];
  currentStep: number;
  isUploading: boolean;
  onCancel: () => void;
  onStepChange: (nextStep: number) => void;
  onDraftChange: (value: BasicInfoDraftPatch) => void;
  onUpload: (files: FileList) => void;
  onRemoveMedia: (id: string) => void;
  onSetAvatar: (id: string) => void;
  onNext: (value: BasicInfoStepSubmitValue) => void;
}

/**
 * Step 1: Thành phần Thông tin cơ bản
 * Thành phần này xử lý giai đoạn đầu của luồng đăng phòng, nơi người thuê chọn
 * loại không gian và điền các chi tiết cốt lõi (tên, diện tích, giá, v.v.).
 *
 * Nó tuân theo mô hình Presentational and Container bằng cách ủy thác toàn bộ logic
 * nghiệp vụ cho hook tùy chỉnh `useBasicInfoStep`.
 */
export const BasicInfoStep = ({
  draft,
  typeList,
  currentStep,
  isUploading,
  onCancel,
  onStepChange,
  onDraftChange,
  onUpload,
  onRemoveMedia,
  onSetAvatar,
  onNext,
}: BasicInfoStepProps) => {
  // Hook điều khiển quản lý trạng thái form, validation và đồng bộ hóa dữ liệu
  const {
    form,
    summaryRows,
    handleFormValuesChange,
    handleTypeSelect,
    handleStepChange,
    handleFinish,
    initialValues,
    selectedTypeCode,
  } = useBasicInfoStep({
    draft,
    typeList,
    onDraftChange,
    onNext,
    onStepChange,
  });

  return (
    <div className="renter">
      {/* Header dùng chung với tiêu đề và hành động đóng */}
      <StepHeader title="Thông tin cơ bản" onCancel={onCancel} />

      {/* Chỉ báo tiến trình các bước */}
      <Steps
        current={currentStep}
        items={STEP_ITEMS}
        className="renter-steps"
        onChange={handleStepChange}
      />

      <Row gutter={[16, 16]} className="renter_location-type-body">
        {/* CỘT TRÁI: Các Form nhập liệu */}
        <Col xs={24} lg={16}>
          <Form
            form={form}
            layout="vertical"
            initialValues={initialValues}
            onValuesChange={(_, allValues) => handleFormValuesChange(allValues)}
            onFinish={handleFinish}
          >
            {/* Thành phần chọn danh mục không gian (vídụ: Căn hộ, Nhà riêng) */}
            <LocationTypeSelector
              typeList={typeList}
              selectedTypeCode={selectedTypeCode}
              onSelect={handleTypeSelect}
            />

            {/* Các trường nhập liệu cốt lõi (Tên, Giá, Diện tích, Mô tả, v.v.) */}
            <BasicInfoFields />

            {/* Các nút điều hướng và gửi form */}
          </Form>
        </Col>

        {/* CỘT PHẢI: Tải lên Media & Bảng tổng quan */}
        <Col xs={24} lg={8}>
          <div className="renter-sectionBand">
            <div className="renter-sectionBand-header">
              <h2>Tập đính kèm</h2>
            </div>
            {/* Thành phần tải lên và quản lý hình ảnh/video của phòng */}
            <LocationMediaEditor
              media={draft.basicInfo.media}
              isUploading={isUploading}
              inputId="upload-basic-media"
              uploadLabel="Tải ảnh/video lên"
              emptyLabel="Chưa tải lên tập đính kèm nào"
              onUpload={onUpload}
              onRemove={onRemoveMedia}
              onSetAvatar={onSetAvatar}
            />
          </div>

          {/* Bảng tổng quan thời gian thực dựa trên giá trị form hiện tại */}
          <SummaryPanel title="Tổng quan" rows={summaryRows} />
        </Col>
        <div
          style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}
        >
          <StepNavigation onNext={onNext} />
        </div>
      </Row>
    </div>
  );
};
