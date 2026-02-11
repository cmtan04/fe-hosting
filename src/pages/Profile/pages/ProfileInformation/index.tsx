import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Col, DatePicker, Form, Modal, Row } from "antd";
import { UserEndpoint } from "../../../../api/endpoints/user.endpoint";
import {
  getUserPRofile,
  updateUserProfile,
} from "../../../../api/configs/user.config";
import phone from "../../../../assets/svg/profile/phone.svg";
import mail from "../../../../assets/svg/profile/mail.svg";
import bio from "../../../../assets/svg/profile/bio.svg";
import upload from "../../../../assets/svg/profile/upload.svg";
import { useEffect, useRef, useState } from "react";
import { uploadImage } from "../../../../api/configs/common.config";
import {
  DATE_FORMAT,
  DEFAULT_MESSAGE,
  NOTI_ERROR,
  NOTI_SUCCESS,
} from "../../../../common/constants/constants";
import { isAxiosError } from "axios";
import { useLoading } from "../../../../providers/loadingProvider";
import { useNotification } from "../../../../providers/notificationProvider";
import { FormInput } from "../../../../components/FormInput/formInput";
import { FormTextArea } from "../../../../components/FormTextArea/formTextArea";
import type {
  UserAddressDto,
  UserUpdatePayloadDto,
} from "../../../../api/dtos/user.dto";
import dayjs from "dayjs";
import { MapViewCommon } from "../../../../components/MapViewCommon";
import {
  MapAddressMapper,
  type MapAddressDto,
} from "../../../../api/dtos/map.dto";

export const ProfileInformation = () => {
  const [form] = Form.useForm();
  const { setLoading } = useLoading();
  const { showNotification } = useNotification();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [url, setUrl] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>();
  const [location, setLocation] = useState<MapAddressDto>(
    MapAddressMapper.createEmpty(21.0285, 105.8542),
  );
  const [address, setAddress] = useState<UserAddressDto>();

  const { data: user, isLoading } = useQuery({
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
      showNotification(data.message, NOTI_SUCCESS);
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

  const updateUserMutation = useMutation({
    mutationFn: (payload: UserUpdatePayloadDto) => updateUserProfile(payload),
    onSuccess: (data) => {
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
      form.setFieldsValue({
        userName: user.username,
        email: user.email,
        userPhone: user.phone,
        userAdress: user.fullAddress,
      });
    }
  }, [user, form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    uploadMutation.mutate(formData);
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

  const handleMapClick = (data: MapAddressDto) => {
    form.setFieldValue("fullAdress", data.fullAddress);
    setAddress({
      fullAddress: data.fullAddress,
      userWard: data.addressWard,
      userDistrict: data.addressDistrict,
      userCity: data.addressCity,
      userProvince: data.addressProvince,
      userCountry: data.addressCountry,
      userPortal: data.addressPostal,
      userLat: data.addressLat,
      userLong: data.addressLong,
    });
    setShowModal(!showModal);
  };

  console.log(address);

  return (
    <div className="profile__information">
      <Col className="profile__information-header">
        <img
          className="image-background"
          crossOrigin="anonymous"
          src={user?.avatarUrl}
          alt=""
        />

        <div className="blur-blender"></div>
        <Col className="profile__information-header-content">
          <h1 className="title">Thông tin cá nhân</h1>
          <div className="content">
            <div className="content__avatar">
              <figure style={{ margin: 0 }}>
                {url ? (
                  <img className="content__avatar-url" src={url} alt="" />
                ) : (
                  <div className="content__avatar-url"></div>
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
            <div className="content__info">
              <p className="content__info-text name">{user?.fullName}</p>
              <p className="content__info-text email">
                <img className="content__info-icon" src={mail} alt="" />
                {user?.email}
              </p>
              <p className="content__info-text bio">
                <img className="content__info-icon" src={bio} alt="" />
                {user?.bio}
              </p>
              <p className="content__info-text phone">
                <img className="content__info-icon" src={phone} alt="" />
                {user?.phone}
              </p>
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
              <Form.Item
                label="Ngày sinh"
                name="dateOfBirth"
                vertical={true}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn ngày sinh",
                  },
                ]}
              >
                <DatePicker
                  format={DATE_FORMAT}
                  placeholder="Chọn ngày sinh"
                  style={{ width: "100%" }}
                />
              </Form.Item>
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
            className="profile__information-modal"
          >
            <div className="profile__information-modal-body">
              <MapViewCommon
                data={location}
                hasInputSearch={true}
                onMapClick={handleMapClick}
              />
            </div>
          </Modal>
        </Form>
      </Col>
    </div>
  );
};
