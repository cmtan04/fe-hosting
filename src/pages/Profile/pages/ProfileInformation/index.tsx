import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Col, Form, Modal, Row, Image, Spin } from "antd";
import { UserEndpoint } from "@api/endpoints/user.endpoint";
import {
  getUserPRofile,
  updateUserProfile,
} from "@api/configs/user.config";
import phone from "@assets/svg/profile/phone.svg";
import mail from "@assets/svg/profile/mail.svg";
import locationIcon from "@assets/images/profile/icn_location.svg";
import fallbackAvatar from "@assets/images/profile/icn_profile.svg";
import fallbackCover from "@assets/images/home/home-background2.jpg";
import { useEffect, useRef, useState } from "react";
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
import { FormInput } from "@components/FormInput/formInput";
import { FormDatePicker } from "@components/FormDatePicker/formDatePicker";
import { FormTextArea } from "@components/FormTextArea/formTextArea";
import type {
  UserAddressDto,
  UserUpdatePayloadDto,
} from "@api/dtos/user.dto";
import dayjs from "dayjs";
import { MapViewCommon } from "@components/MapViewCommon";
import {
  createDraftAddressFromMapResult,
  createDraftAddressFromUserAddress,
  mapDraftAddressToUserAddress,
} from "@features/mapAddress/address";
import { useMapAddressPicker } from "@features/mapAddress/useMapAddressPicker";

export const ProfileInformation = () => {
  const [form] = Form.useForm();
  const { setLoading } = useLoading();
  const { showNotification } = useNotification();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const fileCoverInputRef = useRef<HTMLInputElement | null>(null);
  const [url, setUrl] = useState<string>("");
  const [coverUrl, setCoverUrl] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>();
  const [address, setAddress] = useState<UserAddressDto>();
  const [addressDraft, setAddressDraft] = useState(() =>
    createDraftAddressFromUserAddress(),
  );
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
  }, [isLoading]);

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
        dateOfBirth: values.dateOfBirth ? dayjs(values.dateOfBirth).format(DATE_FORMAT) : undefined,
        avatarUrl: data.imageUrl,
        coverUrl: coverUrl,
        userWard: address?.userWard,
        userDistrict: address?.userDistrict,
        userCity: address?.userCity,
        userProvince: address?.userProvince,
        userCountry: address?.userCountry,
        userPortal: address?.userPortal,
        userLat: address?.userLat,
        userLong: address?.userLong,
      };
      updateUserMutation.mutate(payload);
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
        dateOfBirth: values.dateOfBirth ? dayjs(values.dateOfBirth).format(DATE_FORMAT) : undefined,
        avatarUrl: url,
        coverUrl: data.imageUrl,
        userWard: address?.userWard,
        userDistrict: address?.userDistrict,
        userCity: address?.userCity,
        userProvince: address?.userProvince,
        userCountry: address?.userCountry,
        userPortal: address?.userPortal,
        userLat: address?.userLat,
        userLong: address?.userLong,
      };
      updateUserMutation.mutate(payload);
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
      setCoverUrl(user?.coverUrl || "");
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: (payload: UserUpdatePayloadDto) => updateUserProfile(payload),
    onSuccess: (data) => {
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
      setUrl("");
    },

    onMutate: () => {
      setLoading(true);
    },
    onSettled: () => {
      setLoading(false);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    setUrl(URL.createObjectURL(file)); // Local preview
    const formData = new FormData();
    formData.append("image", file);
    uploadMutation.mutate(formData);
  };

  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    setCoverUrl(URL.createObjectURL(file)); // Local preview
    const formData = new FormData();
    formData.append("image", file);
    uploadCoverMutation.mutate(formData);
  };

  const onSubmit = () => {
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
      userWard: address?.userWard,
      userDistrict: address?.userDistrict,
      userCity: address?.userCity,
      userProvince: address?.userProvince,
      userCountry: address?.userCountry,
      userPortal: address?.userPortal,
      userLat: address?.userLat,
      userLong: address?.userLong,
    };

    updateUserMutation.mutate(payload);
  };

  const headerCover = coverUrl || user?.coverUrl || fallbackCover;
  const headerAvatar = url || user?.avatarUrl || fallbackAvatar;
  const headerName = user?.fullName || "Người dùng";
  const headerEmail = user?.email || "Chưa cập nhật email";
  const headerBio = user?.bio || "Chưa cập nhật giới thiệu";
  const headerPhone = user?.phone || "Chưa cập nhật số điện thoại";
  const headerLocation = user?.fullAddress || "Chưa cập nhật địa chỉ";

  return (
    <div className="profile__information">
      <h1 className="title">Thông tin cá nhân</h1>
      <Col className="profile__information-header">
        <div className="profile__information-cover">
          <Image
            rootClassName="image-background"
            src={headerCover}
            alt="Ảnh bìa hồ sơ"
            preview={{ mask: 'Xem to' }}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          {uploadCoverMutation.isPending && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(255,255,255,0.4)', zIndex: 11 }}>
              <Spin size="large" />
            </div>
          )}
          <div className="blur-blender"></div>
          <label htmlFor="upload-cover" className="profile__information-cover-upload">
            <input
              id="upload-cover"
              type="file"
              accept="image/*"
              ref={fileCoverInputRef}
              onChange={handleCoverFileChange}
            />
          </label>
        </div>

        <div className="profile__information-avatar-bridge">
          <div className="content__avatar">
            <figure style={{ margin: 0, position: 'relative', width: 212, height: 212 }}>
              <Image
                rootClassName="content__avatar-url"
                src={headerAvatar}
                alt="Ảnh đại diện"
                preview={{ mask: 'Xem to' }}
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
              />
              {uploadMutation.isPending && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(255,255,255,0.5)', borderRadius: '50%', zIndex: 11 }}>
                  <Spin size="large" />
                </div>
              )}
            </figure>
            <label htmlFor="upload" className="content__avatar-upload">
              <input
                id="upload"
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </label>
          </div>
        </div>

        <Col className="profile__information-header-content">
          <div className="content">
            <div className="content__info">
              <div className="content__info-head">
                <p className="content__info-text name">{headerName}</p>
              </div>

              <p className="content__info-text subtitle">{headerBio}</p>

              <div className="content__meta">
                <p className="content__info-text meta-item">
                  <img
                    className="content__info-icon"
                    src={locationIcon}
                    alt=""
                  />
                  {headerLocation}
                </p>
                <p className="content__info-text meta-item">
                  <img className="content__info-icon" src={mail} alt="" />
                  {headerEmail}
                </p>
                <p className="content__info-text meta-item">
                  <img className="content__info-icon" src={phone} alt="" />
                  {headerPhone}
                </p>
              </div>
            </div>
          </div>
        </Col>
      </Col>

      <Col className="profile__information-body">
        <Form form={form} onFinish={onSubmit}>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <FormInput
                label="Tên người dùng"
                name="username"
                placeholder="Nhập tên người dùng"
                vertical={true}
                formItemProps={{
                  rules: [
                    {
                      required: true,
                      message: "Trường này là trường bắt buộc.",
                    },
                  ],
                }}
              />
            </Col>
            <Col span={16}>
              <FormInput
                label="Tên đầy đủ"
                name="fullName"
                placeholder="Nhập tên đầy đủ"
                vertical={true}
                formItemProps={{
                  rules: [
                    {
                      required: true,
                      message: "Trường này là trường bắt buộc.",
                    },
                  ],
                }}
              />
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <FormInput
                label="Số điện thoại"
                name="phone"
                placeholder="Nhập số điện thoại"
                vertical={true}
                formItemProps={{
                  rules: [
                    {
                      required: true,
                      message: "Trường này là trường bắt buộc.",
                    },
                  ],
                }}
              />
            </Col>
            <Col span={8}>
              <FormInput
                label="Địa chỉ email"
                name="email"
                placeholder="Nhập địa chỉ email"
                disabled
                vertical={true}
                formItemProps={{
                  rules: [
                    {
                      required: true,
                      message: "Trường này là trường bắt buộc.",
                    },
                  ],
                }}
              />
            </Col>
            <Col span={8} className="time-wrapper">
              <FormDatePicker
                label="Ngày sinh"
                name="dateOfBirth"
                vertical={true}
                formItemProps={{
                  rules: [
                    {
                      required: true,
                      message: "Vui lòng chọn ngày sinh",
                    },
                  ],
                }}
                datePickerProps={{
                  format: DATE_FORMAT,
                  placeholder: "Chọn ngày sinh",
                  disabledDate: (current) => current.isAfter(dayjs()),
                }}
              />
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col span={24}>
              <FormTextArea
                label="Bio"
                name="bio"
                placeholder="Nhập bio"
                vertical={true}
                formItemProps={{
                  rules: [
                    {
                      required: false,
                      message: "Trường này là trường bắt buộc.",
                    },
                  ],
                }}
              />
            </Col>
          </Row>

          <Row gutter={[16, 16]} className="address">
            <Col span={20}>
              <FormTextArea
                label="Địa chỉ"
                name="fullAddress"
                disabled
                placeholder="Nhập địa chỉ"
                vertical={true}
                formItemProps={{
                  rules: [
                    {
                      required: false,
                      message: "Trường này là trường bắt buộc.",
                    },
                  ],
                }}
              />
            </Col>
            <Col span={4}>
              <Button
                htmlType="button"
                className="button-submit"
                onClick={() => setShowModal(!showModal)}
              >
                Chọn địa chỉ
              </Button>
            </Col>
          </Row>

          <Row gutter={[16, 16]} className="action">
            <Button htmlType="submit" className="button-submit">
              Lưu
            </Button>
          </Row>

          <Modal
            open={showModal}
            footer={false}
            onCancel={() => {
              setShowModal(!showModal);
            }}
            afterOpenChange={(visible) => {
              if (visible) {
                setTimeout(() => {
                  window.dispatchEvent(new Event("resize"));
                }, 0);
              }
            }}
            className="profile__information-modal"
          >
            <div className="profile__information-modal-body">
              <MapViewCommon
                center={{
                  lat: mapData.lat,
                  lng: mapData.long,
                }}
                searchState={searchState}
                onCoordinateSelect={resolveCoordinates}
              />
            </div>
          </Modal>
        </Form>
      </Col>
    </div>
  );
};
