import { useRenterPostRoom } from "./hooks/useRenterPostRoom";
import { BasicInfoStep } from "./steps/BasicInfoStep";
import { AddressAndServicesStep } from "./steps/AddressAndServicesStep";
import { ConfirmStep } from "./steps/ConfirmStep";
import "./styles.scss";
import { ScrollToTop } from "@/components/ScrollToTop";

/**
 * Layout chính cho luồng Đăng phòng của Renter.
 * Quản lý trạng thái đa bước (multi-step) và điều phối dữ liệu giữa các bước.
 */
export const RenterLayout = () => {
  const {
    step,
    draft,
    typeList,
    serviceList,
    isUploading,
    isSubmitting,
    handleBasicInfoNext,
    handleBasicInfoDraftChange,
    handleAddressAndServicesNext,
    handleAddressAndServicesDraftChange,
    handleStepChange,
    handleCancel,
    handleUploadMedia,
    handleRemoveMedia,
    handleSetAvatar,
    handleCreateLocation,
    updateServices,
  } = useRenterPostRoom();

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <BasicInfoStep
            draft={draft}
            typeList={typeList}
            isUploading={isUploading}
            currentStep={step}
            onCancel={handleCancel}
            onDraftChange={handleBasicInfoDraftChange}
            onStepChange={handleStepChange}
            onUpload={handleUploadMedia}
            onRemoveMedia={handleRemoveMedia}
            onSetAvatar={handleSetAvatar}
            onNext={handleBasicInfoNext}
          />
        );
      case 1:
        return (
          <AddressAndServicesStep
            draft={draft}
            services={serviceList}
            currentStep={step}
            onBack={() => handleStepChange(0)}
            onCancel={handleCancel}
            onAddressDraftChange={handleAddressAndServicesDraftChange}
            onServicesDraftChange={(servicesValue) =>
              updateServices(servicesValue ?? [])
            }
            onNext={handleAddressAndServicesNext}
            onStepChange={handleStepChange}
          />
        );
      case 2:
        return (
          <ConfirmStep
            draft={draft}
            typeList={typeList}
            services={serviceList}
            currentStep={step}
            isSubmitting={isSubmitting}
            onBack={() => handleStepChange(1)}
            onCancel={handleCancel}
            onSubmit={handleCreateLocation}
            onStepChange={handleStepChange}
            isUploading={isUploading}
            onUpload={handleUploadMedia}
            onRemoveMedia={handleRemoveMedia}
            onSetAvatar={handleSetAvatar}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="renter-layout">
      <ScrollToTop watch={step} />
      {renderStep()}
    </div>
  );
};
