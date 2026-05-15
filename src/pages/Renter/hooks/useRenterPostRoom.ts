import { useMutation, useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createLocation,
  getAllLocationType,
  updateLocation,
} from "../../../api/configs/location.config";
import { getMyOwnerPackage } from "../../../api/configs/payment.config";
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
import { ROUTER_PATH } from "../../../router/Route";

interface UseRenterPostRoomOptions {
  mode?: "create" | "edit";
  locationCode?: string;
  storageKey?: string;
}

export const useRenterPostRoom = ({
  mode = "create",
  locationCode,
  storageKey,
}: UseRenterPostRoomOptions = {}) => {
  const navigate = useNavigate();
  const { setLoading } = useLoading();
  const { showNotification } = useNotification();
  const {
    draft,
    updateBasicInfo,
    updateAddress,
    updateServices,
    reset,
    initialize,
  } = useCreateLocationDraft(storageKey);
  const [step, setStep] = useState(0);

  const { data: typeList, isLoading: typeLoading } = useQuery({
    queryKey: [LocationEndpoint.GET_ALL_LOCATION_TYPE],
    queryFn: () => getAllLocationType(),
  });

  const { data: serviceList, isLoading: serviceLoading } = useQuery({
    queryKey: [ServiceEndpoint.GET_ALL_LOCATION_SERVICE],
    queryFn: () => getAllService(),
  });

  const {
    data: ownerPackage,
    isLoading: ownerPackageLoading,
    refetch: refetchOwnerPackage,
  } = useQuery({
    queryKey: ["owner-package-me"],
    queryFn: getMyOwnerPackage,
    retry: false,
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
      refetchOwnerPackage();
      reset();
      navigate(-1);
    },
    onError: (error) => {
      if (isAxiosError(error) && error.response?.status === 402) {
        const apiMessage =
          typeof error.response?.data?.message === "string"
            ? error.response.data.message
            : "Trial da het han. Vui long mua goi dang tin de tiep tuc.";
        showNotification(apiMessage, NOTI_ERROR);
        navigate(ROUTER_PATH.PROFILE_OWNER_PACKAGE);
        return;
      }

      const apiMessage =
        isAxiosError(error) && typeof error.response?.data?.message === "string"
          ? error.response?.data?.message
          : DEFAULT_MESSAGE;
      showNotification(apiMessage, NOTI_ERROR);
    },
  });

  const updateMutation = useMutation({
    mutationFn: () => {
      if (!locationCode) {
        throw new Error("Location code is required");
      }

      return updateLocation(locationCode, mapDraftToCreateLocationRequest(draft));
    },
    onSuccess: (data) => {
      showNotification(data.message, NOTI_SUCCESS);
      reset();
      navigate(-1);
    },
    onError: (error) => {
      const apiMessage =
        isAxiosError(error) && typeof error.response?.data?.message === "string"
          ? error.response?.data?.message
          : error instanceof Error && error.message
          ? error.message
          : DEFAULT_MESSAGE;
      showNotification(apiMessage, NOTI_ERROR);
    },
  });

  useEffect(() => {
    setLoading(
      typeLoading ||
        serviceLoading ||
        ownerPackageLoading ||
        uploadMutation.isPending ||
        uploadVideoMutation.isPending ||
        uploadFileMutation.isPending ||
        createMutation.isPending ||
        updateMutation.isPending,
    );
  }, [
    createMutation.isPending,
    updateMutation.isPending,
    serviceLoading,
    setLoading,
    typeLoading,
    ownerPackageLoading,
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
      cancellationFeePercent: value.cancellationFeePercent,
      rescheduleFeePercent: value.rescheduleFeePercent,
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

  /**
   * Kiểm tra các trường thông tin bắt buộc trước khi gửi lên Server
   */
  const validateDraft = () => {
    const { basicInfo, address } = draft;
    const errors: string[] = [];

    // Kiểm tra thông tin cơ bản
    if (!basicInfo.typeCode) errors.push("Loại phòng");
    if (!basicInfo.locationName?.trim()) errors.push("Tên địa điểm");
    if (!basicInfo.price || basicInfo.price <= 0) errors.push("Giá cho thuê");
    if (!basicInfo.area || basicInfo.area <= 0) errors.push("Diện tích");
    if (basicInfo.media.length === 0) errors.push("Hình ảnh/video thực tế");


    return errors;
  };

  /**
   * Xử lý gửi dữ liệu đăng phòng
   */
  const handleCreateLocation = () => {
    const missingFields = validateDraft();

    if (missingFields.length > 0) {
      showNotification(
        `Vui lòng bổ sung đầy đủ ${missingFields.join(", ")} trước khi đăng phòng!`,
        NOTI_ERROR,
      );
      return;
    }

    if (mode === "edit") {
      updateMutation.mutate();
      return;
    }

    createMutation.mutate();
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
    ownerPackage,
    refetchOwnerPackage,
    isUploading: uploadMutation.isPending,
    isSubmitting: createMutation.isPending || updateMutation.isPending,

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
    initialize,

    // Services
    updateServices,
  };
};
