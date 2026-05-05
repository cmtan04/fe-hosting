import { useMutation, useQuery } from "@tanstack/react-query";
import { Form } from "antd";
import { useEffect, useState, useCallback } from "react";
import dayjs from "dayjs";
import { UserEndpoint } from "@api/endpoints/user.endpoint";
import { getUserPRofile, updateUserProfile } from "@api/configs/user.config";
import { uploadImage } from "@api/configs/common.config";
import {
  DATE_FORMAT,
  DEFAULT_MESSAGE,
  NOTI_ERROR,
  NOTI_SUCCESS,
} from "@common/constants/constants";
import { isAxiosError } from "axios";
import { useLoading } from "@providers/loadingProvider";
import { useNotification } from "@providers/notificationProvider";
import type { UserAddressDto, UserUpdatePayloadDto } from "@api/dtos/user.dto";
import {
  createDraftAddressFromMapResult,
  createDraftAddressFromUserAddress,
  mapDraftAddressToUserAddress,
} from "@features/mapAddress/address";
import { useMapAddressPicker } from "@features/mapAddress/useMapAddressPicker";

export const useProfileInformation = () => {
  const [form] = Form.useForm();
  const { setLoading } = useLoading();
  const { showNotification } = useNotification();
  const [url, setUrl] = useState<string>("");
  const [coverUrl, setCoverUrl] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [address, setAddress] = useState<UserAddressDto>();
  const [addressDraft, setAddressDraft] = useState(() =>
    createDraftAddressFromUserAddress(),
  );
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const { mapData, resolveCoordinates, searchState } = useMapAddressPicker({
    initialAddress: addressDraft,
    hasSearch: true,
    onAddressResolved: (value) => {
      const nextDraft = createDraftAddressFromMapResult(value, addressDraft);
      setAddressDraft(nextDraft);
      form.setFieldValue("fullAddress", nextDraft.fullAddress);
      setAddress(mapDraftAddressToUserAddress(nextDraft));
    },
  });

  const {
    data: user,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [UserEndpoint.GET_USER_INFORMATION],
    queryFn: () => getUserPRofile(),
  });

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  const updateUserMutation = useMutation({
    mutationFn: (payload: UserUpdatePayloadDto) => updateUserProfile(payload),
    onSuccess: () => {
      refetch();
      showNotification("Cập nhật thành công", NOTI_SUCCESS);
    },
    onError: (error) => {
      let message = DEFAULT_MESSAGE;
      if (isAxiosError(error)) {
        const apiMessage = error.response?.data?.message;
        if (typeof apiMessage === "string") {
          message = apiMessage;
        } else if (Array.isArray(apiMessage) && apiMessage[0]) {
          message = apiMessage[0];
        }
      }
      showNotification(message, NOTI_ERROR);
    },
    onMutate: () => setLoading(true),
    onSettled: () => setLoading(false),
  });

  const uploadMutation = useMutation({
    mutationFn: (payload: FormData) => uploadImage(payload),
    onSuccess: (data) => {
      setUrl(data.imageUrl);
      const values = form.getFieldsValue();
      const payload: UserUpdatePayloadDto = {
        userName: values.username,
        fullName: values.fullName,
        phone: values.phone,
        bio: values.bio,
        fullAddress: values.fullAddress,
        dateOfBirth: values.dateOfBirth
          ? dayjs(values.dateOfBirth).format(DATE_FORMAT)
          : undefined,
        avatarUrl: data.imageUrl,
        coverUrl: coverUrl,
        ...address,
      };
      updateUserMutation.mutate(payload);
    },
    onError: (error) => {
      let message = DEFAULT_MESSAGE;
      if (isAxiosError(error)) {
        const apiMessage = error.response?.data?.message;
        message = typeof apiMessage === "string" ? apiMessage : apiMessage?.[0] || message;
      }
      showNotification(message, NOTI_ERROR);
      setUrl(user?.avatarUrl || "");
    },
  });

  const uploadCoverMutation = useMutation({
    mutationFn: (payload: FormData) => uploadImage(payload),
    onSuccess: (data) => {
      setCoverUrl(data.imageUrl);
      const values = form.getFieldsValue();
      const payload: UserUpdatePayloadDto = {
        userName: values.username,
        fullName: values.fullName,
        phone: values.phone,
        bio: values.bio,
        fullAddress: values.fullAddress,
        dateOfBirth: values.dateOfBirth
          ? dayjs(values.dateOfBirth).format(DATE_FORMAT)
          : undefined,
        avatarUrl: url,
        coverUrl: data.imageUrl,
        ...address,
      };
      updateUserMutation.mutate(payload);
    },
    onError: (error) => {
      let message = DEFAULT_MESSAGE;
      if (isAxiosError(error)) {
        const apiMessage = error.response?.data?.message;
        message = typeof apiMessage === "string" ? apiMessage : apiMessage?.[0] || message;
      }
      showNotification(message, NOTI_ERROR);
      setCoverUrl(user?.coverUrl || "");
    },
  });

  useEffect(() => {
    if (user) {
      setUrl(user.avatarUrl);
      setCoverUrl(user.coverUrl);
      const nextAddressDraft = createDraftAddressFromUserAddress(user);
      setAddressDraft(nextAddressDraft);
      setAddress(mapDraftAddressToUserAddress(nextAddressDraft));
      form.setFieldsValue({
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        bio: user.bio,
        dateOfBirth: user.dateOfBirth ? dayjs(user.dateOfBirth) : null,
        fullAddress: user.fullAddress,
      });
    }
  }, [user, form]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUrl(URL.createObjectURL(file));
    const formData = new FormData();
    formData.append("image", file);
    uploadMutation.mutate(formData);
  }, [uploadMutation]);

  const handleCoverFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverUrl(URL.createObjectURL(file));
    const formData = new FormData();
    formData.append("image", file);
    uploadCoverMutation.mutate(formData);
  }, [uploadCoverMutation]);

  const onSubmit = useCallback(() => {
    const values = form.getFieldsValue();
    const payload: UserUpdatePayloadDto = {
      userName: values.username,
      fullName: values.fullName,
      phone: values.phone,
      bio: values.bio,
      fullAddress: values.fullAddress,
      dateOfBirth: dayjs(values.dateOfBirth).format(DATE_FORMAT),
      avatarUrl: url,
      coverUrl: coverUrl,
      ...address,
    };
    updateUserMutation.mutate(payload);
  }, [form, url, coverUrl, address, updateUserMutation]);

  return {
    form,
    user,
    url,
    coverUrl,
    showModal,
    setShowModal,
    mapData,
    resolveCoordinates,
    searchState,
    isUploadingAvatar: uploadMutation.isPending,
    isUploadingCover: uploadCoverMutation.isPending,
    handleFileChange,
    handleCoverFileChange,
    onSubmit,
    isEditing,
    setIsEditing,
  };
};
