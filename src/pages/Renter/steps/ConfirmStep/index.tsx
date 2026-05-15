import { Button, Col, Empty, Modal, Row, Space, Steps, message } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { STEP_ITEMS } from "@common/constants/renter";
import type { LocationTypeDto, ServiceDto } from "@api/dtos/location.dto";
import {
  buyOwnerPackage,
  getOwnerPackagePlans,
} from "@api/configs/payment.config";
import type {
  OwnerPackageSubscriptionResponseDto,
  PaymentUrlResponseDto,
} from "@api/dtos/payment.dto";
import type { CreateLocationDraft } from "@features/locationCreation/types";
import { LocationMediaEditor } from "@components/LocationMediaEditor";
import { resolveServiceUnit } from "@features/locationCreation/services";
import { ServiceTag } from "@pages/Renter/components/ServiceTag";
import {
  getOwnerPackagePlanLabel,
  OwnerPackagePaymentInfoCard,
  OwnerPackagePlanCard,
} from "@components/OwnerPackage";
import { StepHeader } from "../../components/StepHeader";
import { StepNavigation } from "../../components/StepNavigation";
import { useConfirmStep } from "../../hooks/useConfirmStep";
import { ConfirmDataSection } from "./components/ConfirmDataSection";
import "./styles.scss";

interface ConfirmStepProps {
  draft: CreateLocationDraft;
  typeList?: LocationTypeDto[];
  services?: ServiceDto[];
  ownerPackage?: OwnerPackageSubscriptionResponseDto;
  onRefreshOwnerPackage?: () => void;
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
  submitText?: string;
}

export const ConfirmStep = ({
  draft,
  typeList,
  services,
  ownerPackage,
  onRefreshOwnerPackage,
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
  submitText = "Đăng phòng",
}: ConfirmStepProps) => {
  const queryClient = useQueryClient();
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const [selectedPlanCode, setSelectedPlanCode] = useState<string | null>(null);
  const [paymentInfo, setPaymentInfo] = useState<PaymentUrlResponseDto | null>(
    null,
  );

  const { selectedServices, basicData, addressData } = useConfirmStep({
    draft,
    typeList,
    services,
  });

  const { data: packagePlans, isLoading: packagePlansLoading } = useQuery({
    queryKey: ["owner-package-plans"],
    queryFn: getOwnerPackagePlans,
    enabled: isPackageModalOpen,
  });

  const buyPackageMutation = useMutation({
    mutationFn: buyOwnerPackage,
    onSuccess: async (data) => {
      const selectedPlan = packagePlans?.find(
        (plan) => plan.planCode === selectedPlanCode,
      );

      if (selectedPlan && Number(selectedPlan.price) <= 0) {
        setPaymentInfo(null);
        setIsPackageModalOpen(false);
        setSelectedPlanCode(null);
        await queryClient.invalidateQueries({ queryKey: ["owner-package-me"] });
        onRefreshOwnerPackage?.();
        message.success("Đã nhận ưu đãi gói đăng tin");
        return;
      }

      setPaymentInfo(data);
      await queryClient.invalidateQueries({ queryKey: ["owner-package-me"] });
      onRefreshOwnerPackage?.();
      message.success("Đã tạo thông tin thanh toán gói đăng tin");
    },
    onError: (error: any) => {
      const apiMessage = error?.response?.data?.message;
      message.error(
        typeof apiMessage === "string"
          ? apiMessage
          : "Không thể tạo thanh toán gói đăng tin",
      );
    },
  });

  let packagePlansContent = (
    <Row gutter={[16, 16]}>
      {packagePlans?.map((plan) => (
        <Col xs={24} md={12} key={plan.planCode}>
          <OwnerPackagePlanCard
            plan={plan}
            currentPlanCode={ownerPackage?.planCode}
            loading={
              buyPackageMutation.isPending &&
              buyPackageMutation.variables?.planCode === plan.planCode
            }
            onSelect={(planCode) => {
              setSelectedPlanCode(planCode);
              if (packagePlans?.some((plan) => plan.planCode === planCode && Number(plan.price) <= 0)) {
                setPaymentInfo(null);
              }
              buyPackageMutation.mutate({ planCode });
            }}
          />
        </Col>
      ))}
    </Row>
  );

  if (packagePlansLoading) {
    packagePlansContent = <p>Đang tải danh sách gói...</p>;
  } else if (!packagePlans?.length) {
    packagePlansContent = <Empty description="Chưa có gói đăng tin" />;
  }
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
          <div className="renter-packageStatus">
            <div>
              <span>Gói đăng tin</span>
              <strong>
                {getOwnerPackagePlanLabel(ownerPackage?.planCode)}
              </strong>
            </div>
            <div>
              <span>Tin đang hiển thị</span>
              <strong>{ownerPackage?.activeListings ?? 0}</strong>
            </div>
            <div>
              <span>Tin còn lại</span>
              <strong>{ownerPackage?.remainingListings ?? 0}</strong>
            </div>
            <div>
              <span>Hết hạn</span>
              <strong>
                {ownerPackage?.expiresAt
                  ? new Date(ownerPackage.expiresAt).toLocaleDateString("vi-VN")
                  : "Không giới hạn"}
              </strong>
            </div>
            <div>
              <Button
                type="primary"
                onClick={() => setIsPackageModalOpen(true)}
              >
                Chọn gói
              </Button>
            </div>
          </div>

          <ConfirmDataSection label={basicData.label} items={basicData.value} />
          <ConfirmDataSection
            label={addressData.label}
            items={addressData.value}
          />
        </Col>

        <Col span={8}>
          <Col className="renter-sectionBand">
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
          </Col>

          <Col className="renter-sectionBand">
            <div className="renter-sectionBand-header">
              <h2>Dịch vụ đã chọn ({selectedServices.length})</h2>
            </div>
            <Row gutter={[8, 8]}>
              {selectedServices.map((item) => (
                <Col span={12} key={`${item.serviceCode}-${item.serviceName}`}>
                  <ServiceTag
                    icon={item.serviceLogo}
                    name={item.serviceName}
                    price={item.servicePrice}
                    description={item.serviceDescription}
                    active={true}
                    isFree={item.isFree}
                    unit={resolveServiceUnit(item.unit)}
                  />
                </Col>
              ))}
            </Row>
          </Col>
        </Col>
      </Row>

      <StepNavigation
        onBack={onBack}
        nextText={submitText}
        isSubmitting={isSubmitting}
        submitHtmlType="button"
        onNext={onSubmit}
      />

      <Modal
        open={isPackageModalOpen}
        title="Chọn gói đăng tin"
        width={900}
        footer={null}
        onCancel={() => setIsPackageModalOpen(false)}
      >
        <Space vertical size={16} style={{ width: "100%" }}>
          <div
            style={{
              padding: 12,
              borderRadius: 8,
              background: "#eef6ff",
              color: "#1d4ed8",
            }}
          >
            Chọn gói phù hợp trước khi đăng tin. Gói Nhận ưu đãi có thể dùng
            ngay, các gói còn lại cần thanh toán.
          </div>

          <Button icon={<ReloadOutlined />} onClick={onRefreshOwnerPackage}>
            Làm mới gói
          </Button>

          {packagePlansContent}
            
          {paymentInfo !== null && paymentInfo.amount > 0 && (
            <OwnerPackagePaymentInfoCard
              paymentInfo={paymentInfo}
              title="Thông tin thanh toán"
            />
          )}
        </Space>
      </Modal>
    </div>
  );
};
