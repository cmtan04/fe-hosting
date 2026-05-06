import { useMutation, useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createLocation,
  getAllLocationType,
} from "../../../api/configs/location.config";
import {
  uploadImage,
  uploadVideo,
  uploadFile,
} from "../../../api/configs/common.config";
import { getAllService } from "../../../api/configs/service.config";
import { LocationEndpoint } from "../../../api/endpoints/location.endpoint";
import { ServiceEndpoint } from "../../../api/endpoints/service.endpoint";
import {
  DEFAULT_MESSAGE,
  NOTI_ERROR,
  NOTI_SUCCESS,
} from "../../../common/constants/constants";
import type { UploadImageResponseDto } from "../../../api/dtos/common.dto";
import {
  appendEditableMedia,
  markEditableMediaAsLogo,
  removeEditableMediaById,
} from "../../../features/locationCreation/media";
import { mapDraftToCreateLocationRequest } from "../../../features/locationCreation/types";
import { uploadLocationMediaFiles } from "../../../features/locationCreation/upload";
import { useCreateLocationDraft } from "../../../features/locationCreation/useCreateLocationDraft";
import { useLoading } from "../../../providers/loadingProvider";
import { useNotification } from "../../../providers/notificationProvider";
import type {
  BasicInfoDraftPatch,
  BasicInfoStepSubmitValue,
  AddressDraftPatch,
  AddressAndServicesStepSubmitValue,
} from "../../../common/types/renter";

export const useRenterPostRoom = () => {
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

  const uploadMutation = useMutation<UploadImageResponseDto, Error, FormData>({
    mutationFn: (payload: FormData) => uploadImage(payload),
    onError: (error) => {
      const apiMessage =
        isAxiosError(error) && typeof error.response?.data?.message === "string"
          ? error.response?.data?.message
          : DEFAULT_MESSAGE;
      showNotification(apiMessage, NOTI_ERROR);
    },
  });

  const uploadVideoMutation = useMutation<UploadImageResponseDto, Error, FormData>({
    mutationFn: (payload: FormData) => uploadVideo(payload),
    onError: (error) => {
      const apiMessage =
        isAxiosError(error) && typeof error.response?.data?.message === "string"
          ? error.response?.data?.message
          : DEFAULT_MESSAGE;
      showNotification(apiMessage, NOTI_ERROR);
    },
  });

  const uploadFileMutation = useMutation<UploadImageResponseDto, Error, FormData>({
    mutationFn: (payload: FormData) => uploadFile(payload),
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

  useEffect(() => {
    setLoading(
      typeLoading ||
        serviceLoading ||
        uploadMutation.isPending ||
        uploadVideoMutation.isPending ||
        uploadFileMutation.isPending ||
        createMutation.isPending,
    );
  }, [
    createMutation.isPending,
    serviceLoading,
    setLoading,
    typeLoading,
    uploadMutation.isPending,
    uploadVideoMutation.isPending,
    uploadFileMutation.isPending,
  ]);

  const handleBasicInfoNext = (value: BasicInfoStepSubmitValue) => {
    updateBasicInfo({
      typeCode: value.typeCode,
      locationName: value.locationName,
      description: value.description ?? "",
      note: value.note ?? "",
      area: value.area,
      price: value.price,
      priceUnit: value.priceUnit,
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

  const handleAddressAndServicesDraftChange = (address: AddressDraftPatch) => {
    updateAddress(address);
  };

  const handleStepChange = (nextStep: number) => {
    setStep(nextStep);
  };

  const handleUploadMedia = async (files: FileList) => {
    try {
      const uploadedMedia = await uploadLocationMediaFiles(
        files,
        uploadMutation.mutateAsync,
        uploadVideoMutation.mutateAsync,
        uploadFileMutation.mutateAsync,
      );
      updateBasicInfo({
        media: appendEditableMedia(draft.basicInfo.media, uploadedMedia),
      });
      showNotification("Tai media thanh cong", NOTI_SUCCESS);
    } catch (error) {
      console.error("Media upload error:", error);
    }
  };

  const handleRemoveMedia = (id: string) => {
    updateBasicInfo({
      media: removeEditableMediaById(draft.basicInfo.media, id),
    });
  };

  const handleSetAvatar = (id: string) => {
    updateBasicInfo({
      media: markEditableMediaAsLogo(draft.basicInfo.media, id),
    });
  };

  const handleCreateLocation = () => {
    //Validate data before submit
    try {
      // If valid, submit data
      createMutation.mutate();
    } catch (error) {
      throw error; // Let the mutation's onError handle the notification
    }
  };

  const handleCancel = () => {
    reset();
    navigate(-1);
  };

  return {
    // State
    step,
    draft,
    typeList,
    serviceList,
    isUploading: uploadMutation.isPending,
    isSubmitting: createMutation.isPending,

    // Step handlers
    handleBasicInfoNext,
    handleBasicInfoDraftChange,
    handleAddressAndServicesNext,
    handleAddressAndServicesDraftChange,
    handleStepChange,
    handleCancel,

    // Media handlers
    handleUploadMedia,
    handleRemoveMedia,
    handleSetAvatar,

    // Submit handler
    handleCreateLocation,

    // Services
    updateServices,
  };
};
