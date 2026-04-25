import { useMutation, useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createLocation,
  getAllLocationType,
} from "../../api/configs/location.config";
import { uploadImage } from "../../api/configs/common.config";
import { getAllService } from "../../api/configs/service.config";
import { LocationEndpoint } from "../../api/endpoints/location.endpoint";
import { ServiceEndpoint } from "../../api/endpoints/service.endpoint";
import {
  DEFAULT_MESSAGE,
  NOTI_ERROR,
  NOTI_SUCCESS,
} from "../../common/constants/constants";
import {
  appendEditableMedia,
  markEditableMediaAsLogo,
  removeEditableMediaById,
} from "../../features/locationCreation/media";
import { mapDraftToCreateLocationRequest } from "../../features/locationCreation/types";
import { uploadLocationMediaFiles } from "../../features/locationCreation/upload";
import { useCreateLocationDraft } from "../../features/locationCreation/useCreateLocationDraft";
import { useLoading } from "../../providers/loadingProvider";
import { useNotification } from "../../providers/notificationProvider";
import { BasicInfoStep } from "./steps/BasicInfoStep";
import { AddressAndServicesStep } from "./steps/AddressAndServicesStep";
import { ConfirmStep } from "./steps/ConfirmStep";
import type {
  AddressDraftPatch,
  AddressAndServicesStepSubmitValue,
  BasicInfoDraftPatch,
  BasicInfoStepSubmitValue,
} from "./steps/types";
import "./renterLayout.scss";

export const RenterLayout = () => {
  const navigate = useNavigate();
  const { setLoading } = useLoading();
  const { showNotification } = useNotification();
  const { draft, updateBasicInfo, updateAddress, updateServices, reset } =
    useCreateLocationDraft();
  const [step, setStep] = useState(0);

  const { data: typeList, isLoading: typeLoading } = useQuery({
    queryKey: [LocationEndpoint.GET_ALL_LOCATION_TYPE],
    queryFn: () => getAllLocationType(),
  });

  const { data: serviceList, isLoading: serviceLoading } = useQuery({
    queryKey: [ServiceEndpoint.GET_ALL_LOCATION_SERVICE],
    queryFn: () => getAllService(),
  });

  const uploadMutation = useMutation({
    mutationFn: (payload: FormData) => uploadImage(payload),
    onError: (error) => {
      const apiMessage =
        isAxiosError(error) && typeof error.response?.data?.message === "string"
          ? error.response?.data?.message
          : DEFAULT_MESSAGE;
      showNotification(apiMessage, NOTI_ERROR);
    },
  });

  const createMutation = useMutation({
    mutationFn: () => createLocation(mapDraftToCreateLocationRequest(draft)),
    onSuccess: (data) => {
      showNotification(data.message, NOTI_SUCCESS);
      reset();
      navigate(-1);
    },
    onError: (error) => {
      const apiMessage =
        isAxiosError(error) && typeof error.response?.data?.message === "string"
          ? error.response?.data?.message
          : DEFAULT_MESSAGE;
      showNotification(apiMessage, NOTI_ERROR);
    },
  });

  const handleCreateLocation = () => {
    //Validate data before submit
    try {
      // If valid, submit data
      createMutation.mutate();
    } catch (error) {
      throw error; // Let the mutation's onError handle the notification
    }
  };

  useEffect(() => {
    setLoading(
      typeLoading ||
        serviceLoading ||
        uploadMutation.isPending ||
        createMutation.isPending,
    );
  }, [
    createMutation.isPending,
    serviceLoading,
    setLoading,
    typeLoading,
    uploadMutation.isPending,
  ]);

  const handleBasicInfoNext = (value: BasicInfoStepSubmitValue) => {
    updateBasicInfo({
      typeCode: value.typeCode,
      locationName: value.locationName,
      description: value.description ?? "",
      note: value.note ?? "",
      area: value.area,
      basePrice: value.basePrice,
      finalPrice: value.finalPrice,
      hasTimeLimit: value.hasTimeLimit,
      availableFrom: value.availableFrom,
      availableTo: value.availableTo,
    });
    setStep(1);
  };

  const handleBasicInfoDraftChange = (value: BasicInfoDraftPatch) => {
    updateBasicInfo(value);
  };

  const handleAddressAndServicesNext = (
    value: AddressAndServicesStepSubmitValue,
  ) => {
    updateAddress({
      addressDetail: value.addressDetail,
      fullAddress: value.fullAddress,
      ward: value.ward ?? "",
      city: value.city ?? "",
      country: value.country ?? "",
      region: value.region ?? "",
      latitude: value.latitude,
      longitude: value.longitude,
      description: value.description ?? "",
      note: value.note ?? "",
    });
    updateServices(value.services ?? []);
    setStep(2);
  };

  const handleAddressAndServicesDraftChange = (
    address: AddressDraftPatch,
    servicesValue: AddressAndServicesStepSubmitValue["services"],
  ) => {
    updateAddress(address);
    updateServices(servicesValue ?? []);
  };

  const handleStepChange = (nextStep: number) => {
    setStep(nextStep);
  };

  const handleUploadMedia = async (files: FileList) => {
    try {
      const uploadedMedia = await uploadLocationMediaFiles(
        files,
        uploadMutation.mutateAsync,
      );

      updateBasicInfo({
        media: appendEditableMedia(draft.basicInfo.media, uploadedMedia),
      });
      showNotification("Tai media thanh cong", NOTI_SUCCESS);
    } catch {
      // Error notification handled by mutation.
    }
  };

  if (step === 0) {
    return (
      <BasicInfoStep
        draft={draft}
        typeList={typeList}
        isUploading={uploadMutation.isPending}
        currentStep={step}
        onCancel={() => {
          reset();
          navigate(-1);
        }}
        onDraftChange={handleBasicInfoDraftChange}
        onStepChange={handleStepChange}
        onUpload={handleUploadMedia}
        onRemoveMedia={(id) => {
          updateBasicInfo({
            media: removeEditableMediaById(draft.basicInfo.media, id),
          });
        }}
        onSetAvatar={(id) => {
          updateBasicInfo({
            media: markEditableMediaAsLogo(draft.basicInfo.media, id),
          });
        }}
        onNext={handleBasicInfoNext}
      />
    );
  }

  if (step === 1) {
    return (
      <AddressAndServicesStep
        draft={draft}
        services={serviceList}
        currentStep={step}
        onBack={() => setStep(0)}
        onCancel={() => {
          reset();
          navigate(-1);
        }}
        onDraftChange={handleAddressAndServicesDraftChange}
        onNext={handleAddressAndServicesNext}
        onStepChange={handleStepChange}
      />
    );
  }

  return (
    <ConfirmStep
      draft={draft}
      typeList={typeList}
      services={serviceList}
      currentStep={step}
      isSubmitting={createMutation.isPending}
      onBack={() => setStep(1)}
      onCancel={() => {
        reset();
        navigate(-1);
      }}
      onSubmit={() => handleCreateLocation()}
      onStepChange={handleStepChange}
    />
  );
};
