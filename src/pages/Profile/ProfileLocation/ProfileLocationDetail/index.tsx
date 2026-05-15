import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { getLocationByCode } from "@api/configs/location.config";
import { LocationEndpoint } from "@api/endpoints/location.endpoint";
import { ScrollToTop } from "@components/ScrollToTop";
import { mapLocationToDraft } from "@features/locationCreation/types";
import { useLoading } from "@providers/loadingProvider";
import { useRenterPostRoom } from "@pages/Renter/hooks/useRenterPostRoom";
import { BasicInfoStep } from "@pages/Renter/steps/BasicInfoStep";
import { AddressAndServicesStep } from "@pages/Renter/steps/AddressAndServicesStep";
import { ConfirmStep } from "@pages/Renter/steps/ConfirmStep";
import { Row } from "antd";
import "@pages/Renter/styles.scss";

export const ProfileLocationDetail = () => {
  const location = useLocation();
  const { setLoading } = useLoading();
  const initializedCodeRef = useRef<string | undefined>(undefined);
  const [hasInitializedDraft, setHasInitializedDraft] = useState(false);
  const locationState = location.state as
    | { locationCode?: string; code?: string }
    | null;
  const locationCode = locationState?.locationCode ?? locationState?.code;

  const storageKey = useMemo(
    () => `edit_location_draft_${locationCode || "unknown"}`,
    [locationCode],
  );

  const {
    step,
    draft,
    typeList,
    serviceList,
    ownerPackage,
    refetchOwnerPackage,
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
    initialize,
  } = useRenterPostRoom({
    mode: "edit",
    locationCode,
    storageKey,
  });

  const { data: locationData, isLoading: locationLoading } = useQuery({
    queryKey: [LocationEndpoint.GET_LOCATION_BY_CODE, locationCode],
    queryFn: () => getLocationByCode(locationCode ?? ""),
    enabled: Boolean(locationCode),
  });

  useEffect(() => {
    setLoading(locationLoading);
  }, [locationLoading, setLoading]);

  useEffect(() => {
    setHasInitializedDraft(false);
    initializedCodeRef.current = undefined;
  }, [locationCode]);

  useEffect(() => {
    if (!locationData || initializedCodeRef.current === locationData.locationCode) {
      return;
    }

    initialize(mapLocationToDraft(locationData));
    initializedCodeRef.current = locationData.locationCode;
    setHasInitializedDraft(true);
  }, [initialize, locationData]);

  if (!hasInitializedDraft) {
    return null;
  }

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
            ownerPackage={ownerPackage}
            onRefreshOwnerPackage={refetchOwnerPackage}
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
            submitText="Cập nhật phòng"
          />
        );
      default:
        return null;
    }
  };

  return (
    <Row>
      <ScrollToTop watch={step} />
      {renderStep()}
    </Row>
  );
};
